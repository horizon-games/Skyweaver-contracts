/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { utils, Contract, ContractFactory } from "ethers";
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
        stateMutability: "nonpayable",
        type: "fallback",
    },
    {
        inputs: [],
        name: "call_anyone",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "call_onlyOwner",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "call_throw",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
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
const _bytecode = "0x608060405234801561001057600080fd5b5060405161050138038061050183398101604081905261002f916100a3565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff831690811782556040518392907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a350506100de565b6000602082840312156100b4578081fd5b815173ffffffffffffffffffffffffffffffffffffffff811681146100d7578182fd5b9392505050565b610414806100ed6000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063893d20e811610050578063893d20e81461008f578063914cec99146100a4578063f2fde38b146100ac57610067565b806310f28194146100695780633fe9038014610087575b005b6100716100bf565b60405161007e91906102e2565b60405180910390f35b6100716100c4565b610097610101565b60405161007e91906102c1565b61007161011d565b6100676100ba366004610286565b610175565b600190565b60006040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100f89061034a565b60405180910390fd5b60005473ffffffffffffffffffffffffffffffffffffffff1690565b6000805473ffffffffffffffffffffffffffffffffffffffff16331461016f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100f890610381565b50600190565b60005473ffffffffffffffffffffffffffffffffffffffff1633146101c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100f890610381565b73ffffffffffffffffffffffffffffffffffffffff8116610213576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100f8906102ed565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83811691821780845560405192939116917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a350565b600060208284031215610297578081fd5b813573ffffffffffffffffffffffffffffffffffffffff811681146102ba578182fd5b9392505050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b901515815260200190565b6020808252602a908201527f4f776e61626c65237472616e736665724f776e6572736869703a20494e56414c60408201527f49445f4144445245535300000000000000000000000000000000000000000000606082015260800190565b60208082526002908201527f3a2f000000000000000000000000000000000000000000000000000000000000604082015260600190565b60208082526026908201527f4f776e61626c65236f6e6c794f776e65723a2053454e4445525f49535f4e4f5460408201527f5f4f574e4552000000000000000000000000000000000000000000000000000060608201526080019056fea2646970667358221220c188dacb62672a4a11e795b6900a49cb3fd0d348c2e3e67687e6768effe5b8eb64736f6c63430007040033";
const isSuperArgs = (xs) => xs.length > 1;
export class OwnableMock__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(_firstOwner, overrides) {
        return super.deploy(_firstOwner, overrides || {});
    }
    getDeployTransaction(_firstOwner, overrides) {
        return super.getDeployTransaction(_firstOwner, overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new Contract(address, _abi, signerOrProvider);
    }
}
OwnableMock__factory.bytecode = _bytecode;
OwnableMock__factory.abi = _abi;
