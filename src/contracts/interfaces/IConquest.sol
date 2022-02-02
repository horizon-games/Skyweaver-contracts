pragma solidity 0.7.4;

/**
 * @notice Keep track of players participation in Conquest and used to issue rewards.
 * @dev This contract must be at least a TIER 1 owner of the silverCardFactory and
 *      goldCardFactory.
 */
interface IConquest {

  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Players entering conquest with conquest entry token
   * @dev Payload is passed to and verified by onERC1155BatchReceived()
   */
  function onERC1155Received(
    address _operator,
    address _from,
    uint256 _id, 
    uint256 _amount, 
    bytes calldata _data
  ) external returns(bytes4);

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
  ) external returns(bytes4);

  /***********************************|
  |         Minting Functions         |
  |__________________________________*/

  /**
   * @notice Will exit user from conquest and mint tokens to user 
   * @param _user      The address that exits conquest and receive the rewards
   * @param _silverIds Ids of silver cards to mint (duplicate ids if amount > 1)
   * @param _goldIds   Ids of gold cards to mint (duplicate ids if amount > 1)
   */
  function exitConquest(address _user, uint256[] calldata _silverIds, uint256[] calldata _goldIds) external;

  /***********************************|
  |           View Functions          |
  |__________________________________*/

  // Whether a given player is currently in a conquest
  function isActiveConquest(address _user) external view returns (bool);

  // Number of conquest a given player has entered so far
  function conquestsEntered(address _user) external view returns (uint256);

  /**
   * @notice Indicates whether a contract implements a given interface.
   * @param interfaceID The ERC-165 interface ID that is queried for support.
   * @return True if contract interface is supported.
   */
  function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}
