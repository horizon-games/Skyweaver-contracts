pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "../utils/Ownable.sol";
import "../utils/TransferHelper.sol";
import "../interfaces/ISkyweaverAssets.sol";
import "@0xsequence/erc-1155/contracts/utils/SafeMath.sol";
import "@0xsequence/erc-1155/contracts/interfaces/IERC165.sol";
import "@0xsequence/erc-1155/contracts/interfaces/IERC20.sol";
import "@0xsequence/erc-1155/contracts/interfaces/IERC1155MintBurn.sol";
import "@0xsequence/erc-1155/contracts/interfaces/IERC1155TokenReceiver.sol";

/**
 * @notice Allows users to purchase off-chain assets with ERC-20s or by burning ERC-1155 tokens
 */
contract ItemPurchaseProxy is IERC1155TokenReceiver, Ownable {

  /***********************************|
  |             Variables             |
  |__________________________________*/

  // Track payment nonces to prevent accidental repeat orders
  mapping (address => uint32) public nonces;

  // Encoded data in ERC-1155 transfers, for log event
  struct BurnOrder {
    address itemRecipient;      // Who is supposed to receive the items
    uint32 nonce;               // Transaction nonce 
    uint256[] itemIDsPurchased; // Items that are supposed to be received
  }

  /***********************************|
  |               Events              |
  |__________________________________*/

  event ItemPurchase(address indexed itemRecipient, uint32 indexed nonce, uint256[] itemIDsPurchased);
  event ItemBurn(address indexed itemRecipient, uint32 indexed nonce, uint256[] itemIDsPurchased);

  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Create payment proxy and assign ownership
   * @param _firstOwner Address of the initial owner
   */
  constructor(address _firstOwner) Ownable(_firstOwner) { }


  /***********************************|
  |          Purchase Method          |
  |__________________________________*/


  /**
   * @notice User is sending ERC-20 tokens for payment
   * @param _currencyToken     Address of ERC-20 token used as currency by user
   * @param _currencyAmount    Amount ERC-20 token sent as currency by user
   * @param _nonce             Purchase nonce, to prevent repeats
   * @param _itemIDsPurchased  Items that are supposed to be received
   * @param _itemRecipient     Who is supposed to receive the items
   */
  function purchaseItems(address _currencyToken, uint256 _currencyAmount, uint32 _nonce, uint256[] calldata _itemIDsPurchased, address _itemRecipient) external {
    // Validate currency address and amount
    require(
      _currencyToken != address(0x0) && _currencyAmount > 0,
      "ItemPurchaseProxy#purchaseItems: INVALID_PAYMENT_TOKEN_OR_AMOUNT"
    );

    // Check if nonce is OK, then increment
    require(nonces[msg.sender] == _nonce && _nonce != 2**32-1, "ItemPurchaseProxy#purchaseItems: INVALID_NONCE");
    nonces[msg.sender] = nonces[msg.sender] + 1;

    // If an address is specifiedm use it as receiver, otherwise use msg.sender address
    address itemRecipient = _itemRecipient != address(0x0) ? _itemRecipient : msg.sender;

    // Transfer currency tokens here
    TransferHelper.safeTransferFrom(_currencyToken, msg.sender, address(this), _currencyAmount);
    emit ItemPurchase(itemRecipient, _nonce, _itemIDsPurchased);
  }


  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  fallback () external {
    revert("ItemPurchaseProxy#_: UNSUPPORTED_METHOD");
  }

  /**
   * @notice ItemBurn is being called
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
   * @notice ItemBurn is being called
   * @param _from    Address who sent the token
   * @param _ids     An array containing ids of each Token being transferred
   * @param _amounts An array containing amounts of each Token being transferred
   * @param _data    Encoded BurnOrder struct with order information
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
    // Decode struct to retrieve the burn token order information
    BurnOrder memory burnOrder = abi.decode(_data, (BurnOrder));

    // If an address is specified, use it as receiver, otherwise use _from address
    address itemRecipient = burnOrder.itemRecipient != address(0x0) ? burnOrder.itemRecipient : _from;

    // Check if nonce is OK, then increment
    require(nonces[_from] == burnOrder.nonce && burnOrder.nonce != 2**32-1, "ItemPurchaseProxy#onERC1155BatchReceived: INVALID_NONCE");
    nonces[_from] = nonces[_from] + 1;

    // Burn items received & emit event. msg.sender is the token contract
    IERC1155MintBurn(msg.sender).batchBurn(_ids, _amounts);
    emit ItemBurn(itemRecipient, burnOrder.nonce, burnOrder.itemIDsPurchased);

    // Return success
    return IERC1155TokenReceiver.onERC1155BatchReceived.selector;
  }

  /**
   * @notice Send ERC-20 balance to recipient
   * @param _recipient Address where the currency will be sent to
   * @param _erc20     Address of ERC-20 token to transfer out
   */
  function withdrawERC20(address _recipient, address _erc20) external onlyOwner() {
    require(_recipient != address(0x0), "ItemPurchaseProxy#withdrawERC20: INVALID_RECIPIENT");
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