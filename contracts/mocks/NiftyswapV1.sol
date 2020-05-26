pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "niftyswap/contracts/exchange/NiftyswapExchange.sol";

contract NiftyswapV1 is NiftyswapExchange {
  constructor(address _tokenAddr, address _baseTokenAddr, uint256 _baseTokenID) public NiftyswapExchange(_tokenAddr, _baseTokenAddr, _baseTokenID) {}
}