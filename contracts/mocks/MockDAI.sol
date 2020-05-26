pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "erc20-meta-token/contracts/mocks/ERC20Mock.sol";
import "../utils/Ownable.sol";

contract MockDAI is ERC20Mock, Ownable {
}