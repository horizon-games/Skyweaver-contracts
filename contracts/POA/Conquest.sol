pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../utils/TieredOwnable.sol";
import "../interfaces/ISkyweaverAssets.sol";
import "multi-token-standard/contracts/utils/SafeMath.sol";
import "multi-token-standard/contracts/interfaces/IERC165.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "multi-token-standard/contracts/interfaces/IERC1155TokenReceiver.sol";

/**
 * Contract used on POA to internally keep track of players participation
 * in Conquest. 
 */
contract Conquest is IERC1155TokenReceiver, TieredOwnable {
  using SafeMath for uint256;

  /***********************************|
  |             Variables             |
  |__________________________________*/

  uint256 constant public TIME_BETWEEN_CONQUESTS = 2 minutes;  // Seconds that must elapse between two conquest
  uint256 constant public MAX_REWARD_AMOUNT = 200;             // Maximum number of cards one can win from a conquest (2 decimals)
  uint256 constant public ENTRIES_DECIMALS = 2;                // Amount of decimals conquest entries have

  ISkyweaverAssets immutable public skyweaverAssets; // ERC-1155 Skyweaver assets contract
  uint256 immutable public conquestEntryID;          // Conquest entry token id

  mapping(address => bool) public isActiveConquest;    // Whether a given player is currently in a conquest
  mapping(address => uint256) public conquestsEntered; // Number of conquest a given player has entered so far
  mapping(address => uint256) public nextConquestTime; // Time when the next conquest can be started for players

  // Event
  event ConquestEntered(address user, uint256 nConquests);


  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create factory, link skyweaver assets and store initial parameters
   * @param _skyweaverAssetsAddress The address of the ERC-1155 Assets Token contract
   * @param _conquestEntryTokenId   Conquest entry token id
   */
  constructor(
    address _skyweaverAssetsAddress,
    uint256 _conquestEntryTokenId
  ) public 
  {
    require(
      _skyweaverAssetsAddress != address(0),
      "Conquest#constructor: INVALID_INPUT"
    );

    // Assets
    skyweaverAssets = ISkyweaverAssets(_skyweaverAssetsAddress);
    conquestEntryID = _conquestEntryTokenId;
  }

  
  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("Conquest#_: UNSUPPORTED_METHOD");
  }

  /**
   * @notice Players entering conquest with conquest entry token
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
   * @notice Conquest entry point. Will mark user as having entered conquest if valid entry.
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
    require(msg.sender == address(skyweaverAssets), "Conquest#entry: INVALID_ENTRY_TOKEN_ADDRESS");
    require(_ids.length == 1, "Conquest#entry: INVALID_IDS_ARRAY_LENGTH");
    require(_amounts.length == 1, "Conquest#entry: INVALID_AMOUNTS_ARRAY_LENGTH");
    require(_ids[0] == conquestEntryID, "Conquest#entry: INVALID_ENTRY_TOKEN_ID");
    require(_amounts[0] == 10**ENTRIES_DECIMALS, "Conquest#entry: INVALID_ENTRY_TOKEN_AMOUNT");
    require(!isActiveConquest[_from], "Conquest#entry: PLAYER_ALREADY_IN_CONQUEST");
    require(nextConquestTime[_from] <= now, "Conquest#entry: NEW_CONQUEST_TOO_EARLY");

    // Mark player as playing
    isActiveConquest[_from] = true;
    conquestsEntered[_from] = conquestsEntered[_from].add(1);
    nextConquestTime[_from] = now.add(TIME_BETWEEN_CONQUESTS);

    // Emit event
    emit ConquestEntered(_from, conquestsEntered[_from]);

    // Return success
    return IERC1155TokenReceiver.onERC1155BatchReceived.selector;
  }


  /***********************************|
  |         Minting Functions         |
  |__________________________________*/

  /**
   * @notice Will exit user from conquest and mint tokens to user 
   * @param _user    The address that exists conquest and receive the rewards
   * @param _ids     Array of Tokens ID that are minted
   * @param _amounts Amount of Tokens id minted for each corresponding Token id in _tokenIds
   */
  function exitConquest(address _user, uint256[] calldata _ids, uint256[] calldata _amounts)
    external onlyOwnerTier(1)
  { 
    // Ensures user is currently in conquest
    require(isActiveConquest[_user], "Conquest#exitConquest: USER_IS_NOT_IN_CONQUEST");

    // Check if at most N cards are printed, which 
    // is the maximum one can earn per conquest
    uint256 maxRewards = MAX_REWARD_AMOUNT;
    for (uint256 i = 0; i < _ids.length; i++) {
      maxRewards = maxRewards.sub(_amounts[i]);
    }

    // Mark player as not playing anymore
    isActiveConquest[_user] = false;

    // Mint assets
    skyweaverAssets.batchMint(_user, _ids, _amounts, "");
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
