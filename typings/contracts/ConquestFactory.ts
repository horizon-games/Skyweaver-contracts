/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { BigNumberish } from "ethers/utils";

import { TransactionOverrides } from ".";
import { Conquest } from "./Conquest";

export class ConquestFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _skyweaverAssetsAddress: string,
    _conquestEntryAddress: string,
    _conquestEntryTokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<Conquest> {
    return super.deploy(
      _skyweaverAssetsAddress,
      _conquestEntryAddress,
      _conquestEntryTokenId,
      overrides
    ) as Promise<Conquest>;
  }
  getDeployTransaction(
    _skyweaverAssetsAddress: string,
    _conquestEntryAddress: string,
    _conquestEntryTokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): UnsignedTransaction {
    return super.getDeployTransaction(
      _skyweaverAssetsAddress,
      _conquestEntryAddress,
      _conquestEntryTokenId,
      overrides
    );
  }
  attach(address: string): Conquest {
    return super.attach(address) as Conquest;
  }
  connect(signer: Signer): ConquestFactory {
    return super.connect(signer) as ConquestFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Conquest {
    return new Contract(address, _abi, signerOrProvider) as Conquest;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_skyweaverAssetsAddress",
        type: "address"
      },
      {
        internalType: "address",
        name: "_conquestEntryAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_conquestEntryTokenId",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nConquests",
        type: "uint256"
      }
    ],
    name: "ConquestEntered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    stateMutability: "nonpayable",
    type: "fallback"
  },
  {
    inputs: [],
    name: "MAX_REWARD_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "TIME_BETWEEN_CONQUESTS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "conquestEntryAddress",
    outputs: [
      {
        internalType: "contract IERC1155",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "conquestEntryID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "conquestsEntered",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      }
    ],
    name: "exitConquest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "isActiveConquest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "nextConquestTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "skyweaverAssets",
    outputs: [
      {
        internalType: "contract ISkyweaverAssets",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const _bytecode =
  "0x60e060405234801561001057600080fd5b50604051620011e6380380620011e6833981016040819052610031916100ff565b600080546001600160a01b03191633178082556040516001600160a01b039190911691907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a36001600160a01b0383161580159061009a57506001600160a01b03821615155b6100bf5760405162461bcd60e51b81526004016100b69061013c565b60405180910390fd5b6001600160601b0319606093841b81166080529190921b1660a05260c05261017f565b80516001600160a01b03811681146100f957600080fd5b92915050565b600080600060608486031215610113578283fd5b61011d85856100e2565b925061012c85602086016100e2565b9150604084015190509250925092565b60208082526023908201527f436f6e717565737423636f6e7374727563746f723a20494e56414c49445f494e60408201526214155560ea1b606082015260800190565b60805160601c60a05160601c60c051611025620001c16000398061024b528061036f5250806102bf52806102ee525080610275528061062252506110256000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063b60806651161008c578063cdd28b0d11610066578063cdd28b0d146101c4578063e048aef6146101d9578063f23a6e61146101ec578063f2fde38b146101ff576100ea565b8063b608066514610189578063bc197c8114610191578063bc7cce60146101b1576100ea565b806384f4076e116100c857806384f4076e14610151578063893d20e814610166578063a04f6b4b1461016e578063a0cf655814610176576100ea565b806301ffc9a71461010b57806317119df5146101345780631cb0a02814610149575b60405162461bcd60e51b815260040161010290610cf1565b60405180910390fd5b61011e610119366004610b30565b610212565b60405161012b9190610c0c565b60405180910390f35b61013c610249565b60405161012b9190610fa7565b61013c61026d565b610159610273565b60405161012b9190610b8c565b610159610297565b61013c6102a6565b61013c610184366004610987565b6102ab565b6101596102bd565b6101a461019f3660046109a2565b6102e1565b60405161012b9190610c17565b61011e6101bf366004610987565b61053e565b6101d76101d2366004610ab1565b610553565b005b61013c6101e7366004610987565b61069b565b6101a46101fa366004610a4c565b6106ad565b6101d761020d366004610987565b61074c565b60006001600160e01b031982166301ffc9a760e01b148061024357506001600160e01b03198216630271189760e51b145b92915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b61012c81565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b031690565b60c881565b60026020526000908152604090205481565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461032b5760405162461bcd60e51b815260040161010290610d28565b835160011461034c5760405162461bcd60e51b815260040161010290610c72565b825160011461036d5760405162461bcd60e51b815260040161010290610f5b565b7f00000000000000000000000000000000000000000000000000000000000000008460008151811061039b57fe5b6020026020010151146103c05760405162461bcd60e51b815260040161010290610d73565b826000815181106103cd57fe5b60200260200101516001146103f45760405162461bcd60e51b815260040161010290610e9b565b6001600160a01b03851660009081526001602052604090205460ff161561042d5760405162461bcd60e51b815260040161010290610e51565b6001600160a01b0385166000908152600360205260409020544210156104655760405162461bcd60e51b815260040161010290610c2c565b6001600160a01b0385166000908152600160208181526040808420805460ff1916841790556002909152909120546104a29163ffffffff6107ea16565b6001600160a01b0386166000908152600260205260409020556104cd4261012c63ffffffff6107ea16565b6001600160a01b038616600090815260036020908152604080832093909355600290528190205490517fcfc6e20f951fff57781db2894b809461f33221319f91c415940263667ae9a6e79161052491889190610bf3565b60405180910390a15063bc197c8160e01b95945050505050565b60016020526000908152604090205460ff1681565b6000546001600160a01b0316331461057d5760405162461bcd60e51b815260040161010290610ee5565b6001600160a01b03851660009081526001602052604090205460ff166105b55760405162461bcd60e51b815260040161010290610e03565b60c860005b848110156105f1576105e78484838181106105d157fe5b905060200201358361081690919063ffffffff16565b91506001016105ba565b506001600160a01b0380871660009081526001602052604090819020805460ff1916905551635a455c5b60e11b81527f00000000000000000000000000000000000000000000000000000000000000009091169063b48ab8b6906106619089908990899089908990600401610ba0565b600060405180830381600087803b15801561067b57600080fd5b505af115801561068f573d6000803e3d6000fd5b50505050505050505050565b60036020526000908152604090205481565b60408051600180825281830190925260009160609190602080830190803683375050604080516001808252818301909252929350606092915060208083019080368337019050509050858260008151811061070457fe5b602002602001018181525050848160008151811061071e57fe5b60200260200101818152505061073788888484886102e1565b5063f23a6e6160e01b98975050505050505050565b6000546001600160a01b031633146107765760405162461bcd60e51b815260040161010290610ee5565b6001600160a01b03811661079c5760405162461bcd60e51b815260040161010290610db9565b600080546001600160a01b0319166001600160a01b0383811691821780845560405192939116917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a350565b60008282018381101561080f5760405162461bcd60e51b815260040161010290610f2b565b9392505050565b6000828211156108385760405162461bcd60e51b815260040161010290610cba565b50900390565b80356001600160a01b038116811461024357600080fd5b60008083601f840112610866578182fd5b50813567ffffffffffffffff81111561087d578182fd5b602083019150836020808302850101111561089757600080fd5b9250929050565b600082601f8301126108ae578081fd5b813567ffffffffffffffff8111156108c4578182fd5b60208082026108d4828201610fb0565b838152935081840185830182870184018810156108f057600080fd5b600092505b848310156109135780358252600192909201919083019083016108f5565b505050505092915050565b600082601f83011261092e578081fd5b813567ffffffffffffffff811115610944578182fd5b610957601f8201601f1916602001610fb0565b915080825283602082850101111561096e57600080fd5b8060208401602084013760009082016020015292915050565b600060208284031215610998578081fd5b61080f838361083e565b600080600080600060a086880312156109b9578081fd5b85356109c481610fd7565b945060208601356109d481610fd7565b9350604086013567ffffffffffffffff808211156109f0578283fd5b6109fc89838a0161089e565b94506060880135915080821115610a11578283fd5b610a1d89838a0161089e565b93506080880135915080821115610a32578283fd5b50610a3f8882890161091e565b9150509295509295909350565b600080600080600060a08688031215610a63578081fd5b610a6d878761083e565b9450610a7c876020880161083e565b93506040860135925060608601359150608086013567ffffffffffffffff811115610aa5578182fd5b610a3f8882890161091e565b600080600080600060608688031215610ac8578081fd5b610ad2878761083e565b9450602086013567ffffffffffffffff80821115610aee578283fd5b610afa89838a01610855565b90965094506040880135915080821115610b12578283fd5b50610b1f88828901610855565b969995985093965092949392505050565b600060208284031215610b41578081fd5b81356001600160e01b03198116811461080f578182fd5b81835260006001600160fb1b03831115610b70578081fd5b6020830280836020870137939093016020019283525090919050565b6001600160a01b0391909116815260200190565b6001600160a01b0386168152608060208201819052600090610bc59083018688610b58565b8281036040840152610bd8818587610b58565b83810360609094019390935250815260200195945050505050565b6001600160a01b03929092168252602082015260400190565b901515815260200190565b6001600160e01b031991909116815260200190565b60208082526026908201527f436f6e717565737423656e7472793a204e45575f434f4e51554553545f544f4f6040820152655f4541524c5960d01b606082015260800190565b60208082526028908201527f436f6e717565737423656e7472793a20494e56414c49445f4944535f415252416040820152670b2be988a9c8ea8960c31b606082015260800190565b60208082526017908201527f536166654d617468237375623a20554e444552464c4f57000000000000000000604082015260600190565b6020808252601e908201527f436f6e7175657374235f3a20554e535550504f525445445f4d4554484f440000604082015260600190565b6020808252602b908201527f436f6e717565737423656e7472793a20494e56414c49445f454e5452595f544f60408201526a4b454e5f4144445245535360a81b606082015260800190565b60208082526026908201527f436f6e717565737423656e7472793a20494e56414c49445f454e5452595f544f60408201526512d15397d25160d21b606082015260800190565b6020808252602a908201527f4f776e61626c65237472616e736665724f776e6572736869703a20494e56414c60408201526949445f4144445245535360b01b606082015260800190565b6020808252602e908201527f436f6e71756573742365786974436f6e71756573743a20555345525f49535f4e60408201526d13d517d25397d0d3d394555154d560921b606082015260800190565b6020808252602a908201527f436f6e717565737423656e7472793a20504c415945525f414c52454144595f496040820152691397d0d3d394555154d560b21b606082015260800190565b6020808252602a908201527f436f6e717565737423656e7472793a20494e56414c49445f454e5452595f544f60408201526912d15397d05353d5539560b21b606082015260800190565b60208082526026908201527f4f776e61626c65236f6e6c794f776e65723a2053454e4445525f49535f4e4f546040820152652fa7aba722a960d11b606082015260800190565b602080825260169082015275536166654d617468236164643a204f564552464c4f5760501b604082015260600190565b6020808252602c908201527f436f6e717565737423656e7472793a20494e56414c49445f414d4f554e54535f60408201526b082a4a482b2be988a9c8ea8960a31b606082015260800190565b90815260200190565b60405181810167ffffffffffffffff81118282101715610fcf57600080fd5b604052919050565b6001600160a01b0381168114610fec57600080fd5b5056fea264697066735822122071ed83c3a821befff61c68a647fbc9841896db2044ecf16f80f148d775c90b4d64736f6c63430006080033";
