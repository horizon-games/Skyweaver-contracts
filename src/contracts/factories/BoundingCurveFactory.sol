pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "../utils/TieredOwnable.sol";
import "../interfaces/ISkyweaverAssets.sol";
import "@0xsequence/erc-1155/contracts/utils/SafeMath.sol"; 
import "@0xsequence/erc-1155/contracts/interfaces/IERC165.sol";
import "@0xsequence/erc-1155/contracts/interfaces/IERC20.sol";
import "@0xsequence/erc-1155/contracts/interfaces/IERC1155TokenReceiver.sol";

/**
 * @notice Allows players mint items in exchange for burning items and some USDC
 *         Minting logic supports bonding curve for USDC.
 */
contract BoundingCurveFactory is IERC1155TokenReceiver, TieredOwnable {
  using SafeMath for uint256;
  
  /***********************************|
  |             Variables             |
  |__________________________________*/

  // Assets
  IERC20 immutable public usdc;                      // USDC contract address
  ISkyweaverAssets immutable public skyweaverAssets; // ERC-1155 Skyweaver items contract
  uint256 immutable public itemRangeMin;             // Lower bound for the range of items IDs that can be used to mint
  uint256 immutable public itemRangeMax;             // Upper bound for the range of items IDs that can be used to mint

  // Minting curve parameters
  // TO DO
  uint256 immutable costInItems; // Amount of items needed to be burnt per mint
  uint256 immutable costInUSDC;  // Amount of USDC needed to be sent per mint


  // Payment payload on erc-1155 transfer
  struct MintTokenRequest {
    address recipient;            // Who receives the tokens
    uint256[] itemsBoughtIDs;     // Token IDs to buy
    uint256[] itemsBoughtAmounts; // Amount of token to buy for each ID
    uint256 maxUSDC;              // Maximum amount of USDC to use for the order
  }

  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create factory, link skyweaver items and store initial parameters
   * @param _firstOwner             Address of the first owner
   * @param _usdc                   The address of the USDC contract
   * @param _skyweaverAssetsAddress The address of the Skyweaver ERC-1155 contract
   * @param _itemRangeMin           Minimum id for silver cards
   * @param _itemRangeMax           Maximum id for silver cards
   * @param _costInItems            Amount of items needed to burn per mint
   * @param _costInUSDC             Amount of USDC needed per mint
   */
  constructor(
    address _firstOwner,
    uint256 _usdc,
    address _skyweaverAssetsAddress,
    uint256 _itemRangeMin,
    uint256 _itemRangeMax,
    uint256 _costInItems,
    uint256 _costInUSDC
  ) TieredOwnable(_firstOwner) 
  {
    require(
      _skyweaverAssetsAddress != address(0) && 
      _itemRangeMin < _itemRangeMax &&
      (_costInItems > 100 || _costInItems == 0) &&  // To ensure decimals are ok
      (_costInUSDC > 100000 || _costInUSDC == 0),   // To ensure decimals are ok
      "BoundingCurveFactory#constructor: INVALID_INPUT"
    );

    // Assets
    usdc = IERC20(_usdc);
    skyweaverAssets = ISkyweaverAssets(_skyweaverAssetsAddress);
    itemRangeMin = _itemRangeMin;
    itemRangeMax = _itemRangeMax;

    // Parameters
    costInItems = _costInItems;
    costInUSDC = _costInUSDC;
  }

  
  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("BoundingCurveFactory#_: UNSUPPORTED_METHOD");
  }

  /**
   * @notice Players converting silver cards to conquest entries
   * @dev Payload is passed to and verified by onERC1155BatchReceived()
   */
  function onERC1155Received(
    address _operator,
    address _from,
    uint256 _id, 
    uint256 _amount, 
    bytes calldata _data
  )
    external override returns(bytes4)
  {
    // Convert payload to arrays to pass to onERC1155BatchReceived()
    uint256[] memory ids = new uint256[](1);
    uint256[] memory amounts = new uint256[](1);
    ids[0] = _id;
    amounts[0] = _amount;

    // Will revert call if doesn't pass
    onERC1155BatchReceived(_operator, _from, ids, amounts, _data);
    
    // Return success
    return IERC1155TokenReceiver.onERC1155Received.selector;
  }

  /**
   * @notice Players sending assets to mint
   * @param _ids     An array containing ids of each Token being transferred
   * @param _amounts An array containing amounts of each Token being transferred
   * @param _data    If data is provided, it should be address who will receive the entries
   */
  function onERC1155BatchReceived(
    address, // _operator
    address  _from,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory _data
  )
    public override returns(bytes4)
  { 
    require(
      msg.sender == address(skyweaverAssets), 
      "BoundingCurveFactory#onERC1155BatchReceived: INVALID_TOKEN_ADDRESS"
    );

    // Decode MintTokenRequest from _data to call _mint()
    MintTokenRequest memory req;
    req = abi.decode(_data, (MintTokenRequest));

    // Calculate cost
    (uint256 costItems, uint256 costUSDC) = getMintingCost(req.itemsBoughtIDs, req.itemsBoughtAmounts);

    // Calculate # of items sent
    uint256 nItemsReceived = _paidItemAmount(_ids, _amounts);

    // Validate payment is sufficient
    require(nItemsReceived == costItems, "BoundingCurveFactory#constructor: INCORRECT NUMBER OF ITEMS SENT");
    require(costUSDC <= req.maxUSDC, "BoundingCurveFactory#constructor: INSUFFICIENT USDC");

    // Burn items received
    skyweaverAssets.batchBurn(_ids, _amounts);

    // Transfer USDC to here
    usdc.transferFrom(_from, address(this), costUSDC);

    // Minting assets 
    address recipient = req.recipient == address(0x0) ? _from : req.recipient;
    skyweaverAssets.batchMint(recipient, req.itemsBoughtIDs, req.itemsBoughtAmounts, "");

    // Return success
    return IERC1155TokenReceiver.onERC1155BatchReceived.selector;
  }


  /***********************************|
  |             Payments              |
  |__________________________________*/  

  /**
   * @notice Calculate amount of items sent by user
   * @param _ids      Ids of items sent by user
   * @param _amounts  Amount of each item sent by user
   */
  function _paidItemAmount(uint256[] memory _ids, uint256[] memory _amounts) view internal returns (uint256 nItems) {
    nItems = 0; // Number of valid Items sent

    // Load in memory because Solidity is dumb
    uint256 minRange = itemRangeMin;
    uint256 maxRange = itemRangeMax;

    // Count how many valid items were sent in total
    for (uint256 i = 0; i < _ids.length; i++) {
      require(
        minRange <= _ids[i] && _ids[i] <= maxRange, 
        "BoundingCurveFactory#onERC1155BatchReceived: ID_IS_INVALID"
      );
      nItems = nItems.add(_amounts[i]);
    }

    return nItems;
  }

  /**
   * @notice Get item and usdc cost of a minting order
   * @param _ids      Ids of items to mint
   * @param _amounts  Amount of each item to be minted
   */
  function getMintingCost(uint256[] memory _ids, uint256[] memory _amounts) view public returns (uint256 nItems, uint256 nUSDC) {
    nItems = 0; // Number of items to be burnt
    nUSDC = 0;  // Number of USDC to be sent

    // Load in memory because Solidity is dumb
    uint256 itemCost = costInItems;
    uint256 usdcCost = costInUSDC;

    // Count how many valid items were sent in total
    for (uint256 i = 0; i < _ids.length; i++) {
      uint256 nMint = _amounts[i];
      nItems = nItems.add(nMint.mul(itemCost));
      nUSDC = nUSDC.add(nMint.mul(usdcCost));   // TODO replace by curve
    }

    return (nItems, nUSDC);
  }


  /**
   * @notice Send ERC-20 balance to recipient
   * @param _recipient Address where the currency will be sent to
   * @param _erc20     Address of ERC-20 token to transfer out
   */
  function withdrawERC20(address _recipient, address _erc20) external onlyOwnerTier(HIGHEST_OWNER_TIER) {
    require(_recipient != address(0x0), "BoundingCurveFactory#withdrawERC20: INVALID_RECIPIENT");
    uint256 this_balance = IERC20(_erc20).balanceOf(address(this));
    IERC20(_erc20).transfer(_recipient, this_balance);
  }


  /***********************************|
  |         Utility Functions         |
  |__________________________________*/

  /**
   * @notice Indicates whether a contract implements a given interface.
   * @param interfaceID The ERC-165 interface ID that is queried for support.
   * @return True if contract interface is supported.
   */
  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return  interfaceID == type(IERC165).interfaceId || 
      interfaceID == type(IERC1155TokenReceiver).interfaceId;
  }
}