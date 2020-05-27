pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../utils/Ownable.sol";
import "../utils/ReentrancyGuard.sol";
import "../interfaces/ISkyweaverAssets.sol";
import "multi-token-standard/contracts/utils/SafeMath.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";

/**
 * This is a contract allowing contract owner to mint silver cards
 * up to k/N, where k is the number of entries paid for either by
 * burning a silver card or by paying the entry in ARC. Anyone can
 * send silver cards or ARC to this contract, which will then get
 * burned for the former and reserved for Horizon for the latter.
 */
contract SilverConquestFactory is Ownable, ReentrancyGuard {
  using SafeMath for uint256;

  /***********************************|
  |             Variables             |
  |__________________________________*/

  // Constants
  uint256 constant internal decimals = 2; // Number of decimals

  // Initiate Variables
  ISkyweaverAssets internal skyweaverAssets; // ERC-1155 Skyweaver assets contract
  IERC1155 internal arcadeumCoin;            // ERC-1155 Arcadeum Coin contract
  uint256 internal arcadeumCoinID;           // ID of ARC token in respective ERC-1155 contract

  uint256 internal arcPrice;         // How much an entry cost when paying with ARC
  uint256 internal mintEntryRatio;   // Can only mint k silvers for every N entries, where k <= N
  uint256 internal availableSupply;  // Amount of silvers that can currently be minted
  IdRange internal silverCardsRange; // ID space for silver cards

  // Struct for mint ID ranges permissions
  struct IdRange {
    uint256 minID;
    uint256 maxID;
  }

  /***********************************|
  |              Events               |
  |__________________________________*/

  event NewTribute(address user, uint256 nEntries);
  event MintEntryRatioChange(uint256 oldRatio, uint256 newRatio);
  event ArcPriceChange(uint256 oldPrice, uint256 newPrice);
  event IdRangeUpdated(IdRange newRange);

  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create factory, link skyweaver assets and store initial parameters
   * @param _assetsAddr       The address of the ERC-1155 Assets Token contract
   * @param _mintEntryRatio   Can only mint k silvers for every N burnt
   * @param _arcadeumCoinAddr The address of the ERC-1155 Base Token
   * @param _arcadeumCoinID   The ID of the ERC-1155 Base Token
   * @param _arcPrice         Amount of arc required for a Conquest entry
   */
  constructor(
    address _assetsAddr,
    uint256 _mintEntryRatio,
    address _arcadeumCoinAddr,
    uint256 _arcadeumCoinID,
    uint256 _arcPrice
  ) public {
    require(
      _assetsAddr != address(0) &&
      _arcadeumCoinAddr != address(0) &&
      _arcPrice > 100000000, //Sanity check to "make sure" decimals are accounted for
      "SilverConquestFactory#constructor: INVALID_INPUT"
    );
    require(
      _mintEntryRatio <= 1000,
      "SilverConquestFactory#constructor: RATIO_IS_BIGGER_THAN_1"
    );

    // Assets
    skyweaverAssets = ISkyweaverAssets(_assetsAddr);
    arcadeumCoin = IERC1155(_arcadeumCoinAddr);
    arcadeumCoinID = _arcadeumCoinID;

    // Conquest parameters
    mintEntryRatio = _mintEntryRatio;
    arcPrice = _arcPrice;
    emit MintEntryRatioChange(0, _mintEntryRatio);
    emit ArcPriceChange(0, _arcPrice);
  }


  /***********************************|
  |         Management Methods        |
  |__________________________________*/

  /**
   * @notice Will update the mint to burn ratio
   * @param _newMintEntryRatio New entry/mint ratio, over 1000
   */
  function updateMintEntryRatio(uint256 _newMintEntryRatio) external onlyOwner() {
    require(
      _newMintEntryRatio <= 1000,
      "SilverConquestFactory#updateMintEntryRatio: RATIO_IS_BIGGER_THAN_1"
    );
    emit MintEntryRatioChange(mintEntryRatio, _newMintEntryRatio);
    mintEntryRatio = _newMintEntryRatio;
  }

  /**
   * @notice Will update the arc price of a conquest entry
   * @dev Don't forget to account for the decimals
   * @param _newPrice New price in arc
   */
  function updateArcPrice(uint256 _newPrice) external onlyOwner() {
    // Sanity check to "make sure" decimals are accounted for (18 decimals)
    require(_newPrice > 100000000, "SilverConquestFactory#updateArcPrice: INVALID_PRICE");
    emit ArcPriceChange(arcPrice, _newPrice);
    arcPrice = _newPrice;
  }

  /**
   * @notice Will set which asset ids can be burned or minted
   * @param _minRange Minimum ID (inclusive) in id range that factory will be able to burn/mint
   * @param _maxRange Maximum ID (inclusive) in id range that factory will be able to burn/mint
   */
  function updateSilverCardsRange(uint256 _minRange, uint256 _maxRange) external onlyOwner() {
    require(_maxRange > 0, "SilverConquestFactory#updateSilverCardsRange: NULL_RANGE");
    require(_minRange <= _maxRange, "SilverConquestFactory#updateSilverCardsRange: INVALID_RANGE");

    silverCardsRange = IdRange(_minRange, _maxRange);
    emit IdRangeUpdated(silverCardsRange);
  }

  /**
   * @notice Send current ARC balance of conquest contract to recipient
   * @param _recipient Address where the currency will be sent to
   */
  function withdraw(address _recipient) external onlyOwner() {
    require(_recipient != address(0x0), "SilverConquestFactory#withdraw: INVALID_RECIPIENT");
    uint256 thisBalance = arcadeumCoin.balanceOf(address(this), arcadeumCoinID);
    arcadeumCoin.safeTransferFrom(address(this), _recipient, arcadeumCoinID, thisBalance, "");
  }


  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  // On receive success messages
  bytes4 constant internal ERC1155_RECEIVED_VALUE = 0xf23a6e61;
  bytes4 constant internal ERC1155_BATCH_RECEIVED_VALUE = 0xbc197c81;

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("SilverConquestFactory#_: UNSUPPORTED_METHOD");
  }

  /**
   * @dev Will pass array to `onERC1155BatchReceived()`
   */
  function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _amount, bytes memory _data)
    public returns(bytes4)
  {
    // Create arrays to pass to onERC1155BatchReceived()
    uint256[] memory ids = new uint256[](1);
    uint256[] memory amounts = new uint256[](1);
    ids[0] = _id;
    amounts[0] = _amount;

    // call onERC1155BatchReceived()
    require(
      ERC1155_BATCH_RECEIVED_VALUE == onERC1155BatchReceived(_operator, _from, ids, amounts, _data),
      "SilverConquestFactory#onERC1155Received: INVALID_ONRECEIVED_MESSAGE"
    );

    return ERC1155_RECEIVED_VALUE;
  }

  /**
   * @notice Burns silver cards as Tribute when received
   * @dev Only accepts ids associated to silver cards
   * @param _from    The address which previously owned the Tokens
   * @param _ids     An array containing ids of each Token being transferred
   * @param _amounts An array containing amounts of each Token being transferred
   * @return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")
   */
  function onERC1155BatchReceived(
    address, // _operator
    address _from,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory // _data
  )
    public nonReentrant() returns(bytes4)
  {
    // Silver card tribute
    if (msg.sender == address(skyweaverAssets)) {
      // Burn cards
      skyweaverAssets.batchBurn(_ids, _amounts);

      // Load valid id range into memory
      IdRange memory range = silverCardsRange;

      // Count how many cards were burned & Check if id is valid
      uint256 n_burned;
      for (uint256 i = 0; i < _ids.length; i++) {
        require(
          range.minID <= _ids[i] && _ids[i] <= range.maxID,
          "SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"
        );
        n_burned = n_burned.add(_amounts[i]);
      }

      // Increase avaiable supply that can be minted
      availableSupply = availableSupply.add(n_burned.mul(mintEntryRatio).div(1000));
      emit NewTribute(_from, n_burned);

    // Arc tribute
    } else if (msg.sender == address(arcadeumCoin)) {
      require(_ids[0] == arcadeumCoinID, "SilverConquestFactory#onERC1155Received: INVALID_ARC_ID");
      require(_ids.length == 1, "SilverConquestFactory#onERC1155Received: INVALID_ARRAY_LENGTH");
      uint256 n_entries = _amounts[0].div(arcPrice); // Will ignore exceeding amount

      // Increase available supply with mint to entry ratio
      availableSupply = availableSupply.add(n_entries.mul(mintEntryRatio).div(1000));
      emit NewTribute(_from,  n_entries);

    } else {
      revert("SilverConquestFactory#onERC1155BatchReceived: INVALID_TOKEN");
    }

    return ERC1155_BATCH_RECEIVED_VALUE;
  }


  /***********************************|
  |         Minting Functions         |
  |__________________________________*/

  /**
   * @notice Will mint tokens to user
   * @dev Can only mint up to 7/8 the amount that was burned by this contract.
   * @param _to      The address that receives the silver cards
   * @param _ids     Array of Tokens ID that are minted
   * @param _amounts Amount of Tokens id minted for each corresponding Token id in _tokenIds
   */
  function batchMint(address _to, uint256[] calldata _ids, uint256[] calldata _amounts)
    external onlyOwner()
  {
    // Count total amount to mint
    uint256 n_mint;
    for (uint256 i = 0; i < _ids.length; i++) {
      // Don't need to check for range, should be handled by SWSupplyManager already
      n_mint = n_mint.add(_amounts[i]);
    }

    // Update available supply: Will revert if n_mint exceeds available supply
    availableSupply = availableSupply.sub(n_mint);

    // Mint cards
    skyweaverAssets.batchMint(_to, _ids, _amounts, "");
  }


  /***********************************|
  |         Getter Functions          |
  |__________________________________*/

  /**
   * @notice Returns the address of the factory manager contract
   */
  function getSkyweaverAssets() external view returns (address) {
    return address(skyweaverAssets);
  }

  /**
   * @notice Returns the ratio of how many cards can be minted for 1000 entries paid for
   */
  function getMintEntryRatio() external view returns (uint256) {
    return mintEntryRatio;
  }

  /**
   * @notice Returns the amount of ARC a single entry costs
   */
  function getArcPrice() external view returns (uint256) {
    return arcPrice;
  }

  /**
   * @notice Returns how many cards can currently be minted by this factory
   */
  function getAvailableSupply() external view returns (uint256) {
    return availableSupply;
  }

  /**
   * @notice Returns the id range for assets considered valid
   */
  function getSilverCardsRange() external view returns (IdRange memory) {
    return silverCardsRange;
  }


  /***********************************|
  |         Utility Functions         |
  |__________________________________*/

  /**
   * @notice Indicates whether a contract implements the `ERC1155TokenReceiver` functions and so can accept ERC1155 token types.
   * @param  interfaceID The ERC-165 interface ID that is queried for support.s
   * @dev This function MUST return true if it implements the ERC1155TokenReceiver interface and ERC-165 interface.
   *      This function MUST NOT consume more than 5,000 gas.
   * @return Wheter ERC-165 or ERC1155TokenReceiver interfaces are supported.
   */
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
    return  interfaceID == 0x01ffc9a7 || // ERC-165 support (i.e. `bytes4(keccak256('supportsInterface(bytes4)'))`).
      interfaceID == 0x4e2312e0;         // ERC-1155 `ERC1155TokenReceiver` support (i.e. `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")) ^ bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`).
  }

}
