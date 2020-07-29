pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../interfaces/ISkyweaverAssets.sol";
import "multi-token-standard/contracts/utils/SafeMath.sol";
import "multi-token-standard/contracts/interfaces/IERC165.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "multi-token-standard/contracts/interfaces/IERC1155TokenReceiver.sol";

/**
 * Contract used on POA allowing players to convert their silver cards to 
 * conquest entries.
 * 
 * This contract should only be able to mint conquest entries.
 */
contract ConquestEntryFactory is IERC1155TokenReceiver {
  using SafeMath for uint256;
  uint256 constant internal CARD_DECIMALS = 2; // Number of decimals silver and gold cards have
  
  /***********************************|
  |             Variables             |
  |__________________________________*/

  ISkyweaverAssets immutable public skyweaverAssets; // ERC-1155 Skyweaver assets contract
  uint256 immutable public conquestEntryID;          // Conquest entry token id
  Range public silverRange;                          // Range of asset ids that can be converted to tickets

  struct Range {uint256 min; uint256 max;}

  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create factory, link skyweaver assets and store initial parameters
   * @param _skyweaverAssetsAddress The address of the ERC-1155 Assets Token contract
   * @param _conquestEntryTokenId   Conquest entry token id
   * @param _silverCardsRange       ID range that includes only silver cards
   */
  constructor(
    address _skyweaverAssetsAddress,
    uint256 _conquestEntryTokenId,
    Range memory _silverCardsRange
  ) public 
  {
    require(
      _skyweaverAssetsAddress != address(0),
      "Conquest#constructor: INVALID_INPUT"
    );

    // Assets
    skyweaverAssets = ISkyweaverAssets(_skyweaverAssetsAddress);
    conquestEntryID = _conquestEntryTokenId;
    silverRange = _silverCardsRange;
  }

  
  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("ConquestEntryFactory#_: UNSUPPORTED_METHOD");
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
   * @notice Players converting silver cards to conquest entries
   * @param _from    Address who sent the token
   * @param _ids     An array containing ids of each Token being transferred
   * @param _amounts An array containing amounts of each Token being transferred
   */
  function onERC1155BatchReceived(
    address, // _operator
    address _from,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory // _data
  )
    public override returns(bytes4)
  {
    require(msg.sender == address(skyweaverAssets), "ConquestEntryFactory#onERC1155BatchReceived: INVALID_TOKEN_ADDRESS");
    uint256 n_entries = 0; // Number of entries to mint

    // Validate IDs and count number of entries to mint
    for (uint256 i = 0; i < _ids.length; i++) {
      require(
        silverRange.min <= _ids[i] && _ids[i] <= silverRange.max, 
        "ConquestEntryFactory#onERC1155BatchReceived: ID_IS_OUT_OF_RANGE"
      );
      n_entries = n_entries.add(_amounts[i]);
    }

    // Burn silver cards received
    skyweaverAssets.batchBurn(_ids, _amounts);

    // Mint conquest entries (silvers have 2 decimals)
    skyweaverAssets.mint(_from, conquestEntryID, n_entries / 10**CARD_DECIMALS, "");

    // Return success
    return IERC1155TokenReceiver.onERC1155BatchReceived.selector;
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