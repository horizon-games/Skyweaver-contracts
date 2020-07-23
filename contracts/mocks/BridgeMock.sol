pragma solidity ^0.6.8;
import "../factories/BridgeFactory.sol";

contract BridgeMock {
  BridgeFactory internal bridge;

  constructor(address _bridgeAddress) public {
    bridge = BridgeFactory(_bridgeAddress);
  }

  function batchMint(
    address _to,
    uint256[] calldata _ids,
    uint256[] calldata _amounts) external
  {
    bool value = bridge.batchMint(_to, _ids, _amounts);
    require(value, "BATCH_MINT_ERROR");
  }
}