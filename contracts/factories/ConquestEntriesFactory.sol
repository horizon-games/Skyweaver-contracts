pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../utils/TieredOwnable.sol";
import "../interfaces/ISkyweaverAssets.sol";
import "multi-token-standard/contracts/utils/SafeMath.sol";
import "multi-token-standard/contracts/interfaces/IERC165.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "multi-token-standard/contracts/interfaces/IERC1155TokenReceiver.sol";

/**
 * @notice Contract used  allowing players to convert their silver cards and ARC to 
 * conquest entries.
 * 
 * @dev Assumes both cards and entries have the same number of decimals, if not, need to change
 * the amount minted
 * 
 * @dev This contract should only be able to mint conquest entries.
 */
contract ConquestEntriesFactory is IERC1155TokenReceiver, TieredOwnable {
  using SafeMath for uint256;
  
  /***********************************|
  |             Variables             |
  |__________________________________*/

  // Assets
  ISkyweaverAssets immutable public skyweaverAssets; // ERC-1155 Skyweaver assets contract
  IERC1155 immutable internal arcadeumCoin; // ERC-1155 Arcadeum Coin contract
  uint256 immutable public arcadeumCoinID;  // ID of ARC token in respective ERC-1155 contract
  uint256 immutable public silverRangeMin;  // Lower bound for the range of asset IDs that can be converted to entries
  uint256 immutable public silverRangeMax;  // Upper bound for the range of asset IDs that can be converted to entries

  // Conquest entry token id
  uint256 immutable public conquestEntryID; 

  // Parameters
  // Assumes cards and entries have the same number of decimals,
  // uint256 constant internal CARD_DECIMALS = 2;            // Number of decimals cards have
  // uint256 constant internal ENTRIES_DECIMALS = 2;         // Number of decimals entries have
  uint256 constant internal ARC_DECIMALS = 16;               // Number of decimals arc have
  uint256 constant internal ARC_REQUIRED = 10**ARC_DECIMALS; // 100 arc for 1 conquest entry (after decimals)


  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create factory, link skyweaver assets and store initial parameters
   * @param _firstOwner             Address of the first owner
   * @param _skyweaverAssetsAddress The address of the ERC-1155 Assets Token contract
   * @param _arcadeumCoinAddress    The address of the ERC-1155 Arcadeum coin
   * @param _arcadeumCoinId         Arcadeum coin token id
   * @param _conquestEntryTokenId   Conquest entry token id
   * @param _silverRangeMin         Minimum id for silver cards
   * @param _silverRangeMax         Maximum id for silver cards
   */
  constructor(
    address _firstOwner,
    address _skyweaverAssetsAddress,
    address _arcadeumCoinAddress,
    uint256 _arcadeumCoinId,
    uint256 _conquestEntryTokenId,
    uint256 _silverRangeMin,
    uint256 _silverRangeMax
  ) TieredOwnable(_firstOwner) public 
  {
    require(
      _skyweaverAssetsAddress != address(0) && 
      _arcadeumCoinAddress != address(0),
      "Conquest#constructor: INVALID_INPUT"
    );

    // Assets
    skyweaverAssets = ISkyweaverAssets(_skyweaverAssetsAddress);
    arcadeumCoin = IERC1155(_arcadeumCoinAddress);
    arcadeumCoinID = _arcadeumCoinId;
    conquestEntryID = _conquestEntryTokenId;
    silverRangeMin = _silverRangeMin;
    silverRangeMax = _silverRangeMax;
  }

  
  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("ConquestEntriesFactory#_: UNSUPPORTED_METHOD");
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
    bytes memory _data
  )
    public override returns(bytes4)
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
   * @notice Players converting silver cards or ARCs to conquest entries
   * @param _from    Address who sent the token
   * @param _ids     An array containing ids of each Token being transferred
   * @param _amounts An array containing amounts of each Token being transferred
   * @param _data    If data is provided, it should be address who will receive the entries
   */
  function onERC1155BatchReceived(
    address, // _operator
    address _from,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory _data
  )
    public override returns(bytes4)
  { 
    // Number of entries to mint
    uint256 n_entries = 0; 

    // Burn cards or store ARC
    if (msg.sender == address(skyweaverAssets)) {
      
      // Validate IDs and count number of entries to mint
      for (uint256 i = 0; i < _ids.length; i++) {
        require(
          silverRangeMin <= _ids[i] && _ids[i] <= silverRangeMax, 
          "ConquestEntriesFactory#onERC1155BatchReceived: ID_IS_OUT_OF_RANGE"
        );
        n_entries = n_entries.add(_amounts[i]);
      }

      // Burn silver cards received
      skyweaverAssets.batchBurn(_ids, _amounts);

    } else if (msg.sender == address(arcadeumCoin)) {
      require(_ids.length == 1, "ConquestEntriesFactory#onERC1155BatchReceived: INVALID_ARRAY_LENGTH");
      require(_ids[0] == arcadeumCoinID, "ConquestEntriesFactory#onERC1155BatchReceived: INVALID_ARC_ID");
      n_entries = _amounts[0] / ARC_REQUIRED; 

      // Do nothing else. ARCs are stored until withdrawn

    } else {
      revert("ConquestEntriesFactory#onERC1155BatchReceived: INVALID_TOKEN_ADDRESS");
    }

    // If an address is specified in _data, use it as receiver, otherwise use _from address
    address receiver = _data.length > 0 ? abi.decode(_data, (address)) : _from;

    // Mint conquest entries
    skyweaverAssets.mint(receiver, conquestEntryID, n_entries, "");

    // Return success
    return IERC1155TokenReceiver.onERC1155BatchReceived.selector;
  }

  /**
   * @notice Send current ARC balance of conquest contract to recipient
   * @param _recipient Address where the currency will be sent to
   * @param _data      Data to pass with transfer function
   */
  function withdraw(address _recipient, bytes calldata _data) external onlyOwnerTier(HIGHEST_OWNER_TIER) {
    require(_recipient != address(0x0), "ConquestEntriesFactory#withdraw: INVALID_RECIPIENT");
    uint256 this_balance = arcadeumCoin.balanceOf(address(this), arcadeumCoinID);
    arcadeumCoin.safeTransferFrom(address(this), _recipient, arcadeumCoinID, this_balance, _data);
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
  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return  interfaceID == type(IERC165).interfaceId || 
      interfaceID == type(IERC1155TokenReceiver).interfaceId;
  }
}