/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Ownable } from "../Ownable";

export class Ownable__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _firstOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Ownable> {
    return super.deploy(_firstOwner, overrides || {}) as Promise<Ownable>;
  }
  getDeployTransaction(
    _firstOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_firstOwner, overrides || {});
  }
  attach(address: string): Ownable {
    return super.attach(address) as Ownable;
  }
  connect(signer: Signer): Ownable__factory {
    return super.connect(signer) as Ownable__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Ownable {
    return new Contract(address, _abi, signerOrProvider) as Ownable;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_firstOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516103dc3803806103dc83398101604081905261002f916100a2565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff831690811782556040519091907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3506100dd565b6000602082840312156100b3578081fd5b815173ffffffffffffffffffffffffffffffffffffffff811681146100d6578182fd5b9392505050565b6102f0806100ec6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063893d20e81461003b578063f2fde38b14610059575b600080fd5b61004361006e565b60405161005091906101df565b60405180910390f35b61006c6100673660046101a4565b61008a565b005b60005473ffffffffffffffffffffffffffffffffffffffff1690565b60005473ffffffffffffffffffffffffffffffffffffffff1633146100e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100db9061025d565b60405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8116610131576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100db90610200565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83811691821780845560405192939116917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a350565b6000602082840312156101b5578081fd5b813573ffffffffffffffffffffffffffffffffffffffff811681146101d8578182fd5b9392505050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b6020808252602a908201527f4f776e61626c65237472616e736665724f776e6572736869703a20494e56414c60408201527f49445f4144445245535300000000000000000000000000000000000000000000606082015260800190565b60208082526026908201527f4f776e61626c65236f6e6c794f776e65723a2053454e4445525f49535f4e4f5460408201527f5f4f574e4552000000000000000000000000000000000000000000000000000060608201526080019056fea2646970667358221220f365856d40739653905d4ca74b040bc680393b5a5e45d2a58deca9a0a4c8aeb464736f6c63430007040033";