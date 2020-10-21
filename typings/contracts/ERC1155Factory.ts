/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { TransactionOverrides } from ".";
import { ERC1155 } from "./ERC1155";

export class ERC1155Factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: TransactionOverrides): Promise<ERC1155> {
    return super.deploy(overrides) as Promise<ERC1155>;
  }
  getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction {
    return super.getDeployTransaction(overrides);
  }
  attach(address: string): ERC1155 {
    return super.attach(address) as ERC1155;
  }
  connect(signer: Signer): ERC1155Factory {
    return super.connect(signer) as ERC1155Factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155 {
    return new Contract(address, _abi, signerOrProvider) as ERC1155;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      }
    ],
    name: "TransferBatch",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "TransferSingle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "_amount",
        type: "string"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "URI",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "balanceOf",
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
        internalType: "address[]",
        name: "_owners",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      }
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "isOperator",
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
        name: "_from",
        type: "address"
      },
      {
        internalType: "address",
        name: "_to",
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
        name: "_data",
        type: "bytes"
      }
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "address",
        name: "_to",
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
    name: "safeTransferFrom",
    outputs: [],
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
        internalType: "bool",
        name: "_approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceID",
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
  }
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506112bc806100206000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80634e1273f41161005b5780634e1273f4146102bd578063a22cb46514610430578063e985e9c51461045e578063f242432a1461048c5761007c565b8062fdd58e1461008157806301ffc9a7146100bf5780632eb2c2d6146100fa575b600080fd5b6100ad6004803603604081101561009757600080fd5b506001600160a01b038135169060200135610555565b60408051918252519081900360200190f35b6100e6600480360360208110156100d557600080fd5b50356001600160e01b03191661057b565b604080519115158252519081900360200190f35b6102bb600480360360a081101561011057600080fd5b6001600160a01b038235811692602081013590911691810190606081016040820135600160201b81111561014357600080fd5b82018360208201111561015557600080fd5b803590602001918460208302840111600160201b8311171561017657600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b8111156101c557600080fd5b8201836020820111156101d757600080fd5b803590602001918460208302840111600160201b831117156101f857600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561024757600080fd5b82018360208201111561025957600080fd5b803590602001918460018302840111600160201b8311171561027a57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506105c2945050505050565b005b6103e0600480360360408110156102d357600080fd5b810190602081018135600160201b8111156102ed57600080fd5b8201836020820111156102ff57600080fd5b803590602001918460208302840111600160201b8311171561032057600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561036f57600080fd5b82018360208201111561038157600080fd5b803590602001918460208302840111600160201b831117156103a257600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092955061067f945050505050565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561041c578181015183820152602001610404565b505050509050019250505060405180910390f35b6102bb6004803603604081101561044657600080fd5b506001600160a01b0381351690602001351515610797565b6100e66004803603604081101561047457600080fd5b506001600160a01b0381358116916020013516610805565b6102bb600480360360a08110156104a257600080fd5b6001600160a01b03823581169260208101359091169160408201359160608101359181019060a081016080820135600160201b8111156104e157600080fd5b8201836020820111156104f357600080fd5b803590602001918460018302840111600160201b8311171561051457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610833945050505050565b6001600160a01b0391909116600090815260208181526040808320938352929052205490565b60006001600160e01b031982166301ffc9a760e01b14806105ac57506001600160e01b03198216636cdb3d1360e11b145b156105b9575060016105bd565b5060005b919050565b336001600160a01b03861614806105de57506105de8533610805565b6106195760405162461bcd60e51b815260040180806020018281038252602f8152602001806111df602f913960400191505060405180910390fd5b6001600160a01b03841661065e5760405162461bcd60e51b81526004018080602001828103825260308152602001806111836030913960400191505060405180910390fd5b61066a858585856108e9565b610678858585855a86610b94565b5050505050565b606081518351146106c15760405162461bcd60e51b815260040180806020018281038252602c8152602001806111b3602c913960400191505060405180910390fd5b6060835167ffffffffffffffff811180156106db57600080fd5b50604051908082528060200260200182016040528015610705578160200160208202803683370190505b50905060005b845181101561078f5760008086838151811061072357fe5b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020600085838151811061075957fe5b602002602001015181526020019081526020016000205482828151811061077c57fe5b602090810291909101015260010161070b565b509392505050565b3360008181526001602090815260408083206001600160a01b03871680855290835292819020805460ff1916861515908117909155815190815290519293927f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31929181900390910190a35050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b336001600160a01b038616148061084f575061084f8533610805565b61088a5760405162461bcd60e51b815260040180806020018281038252602a815260200180611124602a913960400191505060405180910390fd5b6001600160a01b0384166108cf5760405162461bcd60e51b815260040180806020018281038252602b8152602001806110f9602b913960400191505060405180910390fd5b6108db85858585610d9e565b610678858585855a86610e86565b80518251146109295760405162461bcd60e51b815260040180806020018281038252603581526020018061114e6035913960400191505060405180910390fd5b815160005b81811015610ab3576109a483828151811061094557fe5b6020026020010151600080896001600160a01b03166001600160a01b03168152602001908152602001600020600087858151811061097f57fe5b602002602001015181526020019081526020016000205461100a90919063ffffffff16565b600080886001600160a01b03166001600160a01b0316815260200190815260200160002060008684815181106109d657fe5b6020026020010151815260200190815260200160002081905550610a5e8382815181106109ff57fe5b6020026020010151600080886001600160a01b03166001600160a01b031681526020019081526020016000206000878581518110610a3957fe5b602002602001015181526020019081526020016000205461106790919063ffffffff16565b600080876001600160a01b03166001600160a01b031681526020019081526020016000206000868481518110610a9057fe5b60209081029190910181015182528101919091526040016000205560010161092e565b50836001600160a01b0316856001600160a01b0316336001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b83811015610b39578181015183820152602001610b21565b50505050905001838103825284818151815260200191508051906020019060200280838360005b83811015610b78578181015183820152602001610b60565b5050505090500194505050505060405180910390a45050505050565b610ba6856001600160a01b03166110c1565b15610d96576000856001600160a01b031663bc197c8184338a8989886040518763ffffffff1660e01b815260040180866001600160a01b03166001600160a01b03168152602001856001600160a01b03166001600160a01b03168152602001806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b83811015610c49578181015183820152602001610c31565b50505050905001848103835286818151815260200191508051906020019060200280838360005b83811015610c88578181015183820152602001610c70565b50505050905001848103825285818151815260200191508051906020019080838360005b83811015610cc4578181015183820152602001610cac565b50505050905090810190601f168015610cf15780820380516001836020036101000a031916815260200191505b5098505050505050505050602060405180830381600088803b158015610d1657600080fd5b5087f1158015610d2a573d6000803e3d6000fd5b50505050506040513d6020811015610d4157600080fd5b505190506001600160e01b0319811663bc197c8160e01b14610d945760405162461bcd60e51b815260040180806020018281038252603f81526020018061120e603f913960400191505060405180910390fd5b505b505050505050565b6001600160a01b038416600090815260208181526040808320858452909152902054610dd0908263ffffffff61100a16565b6001600160a01b0380861660009081526020818152604080832087845282528083209490945591861681528082528281208582529091522054610e19908263ffffffff61106716565b6001600160a01b03808516600081815260208181526040808320888452825291829020949094558051868152938401859052805191939288169233927fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62929181900390910190a450505050565b610e98856001600160a01b03166110c1565b15610d96576000856001600160a01b031663f23a6e6184338a8989886040518763ffffffff1660e01b815260040180866001600160a01b03166001600160a01b03168152602001856001600160a01b03166001600160a01b0316815260200184815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610f3c578181015183820152602001610f24565b50505050905090810190601f168015610f695780820380516001836020036101000a031916815260200191505b509650505050505050602060405180830381600088803b158015610f8c57600080fd5b5087f1158015610fa0573d6000803e3d6000fd5b50505050506040513d6020811015610fb757600080fd5b505190506001600160e01b0319811663f23a6e6160e01b14610d945760405162461bcd60e51b815260040180806020018281038252603a81526020018061124d603a913960400191505060405180910390fd5b600082821115611061576040805162461bcd60e51b815260206004820152601760248201527f536166654d617468237375623a20554e444552464c4f57000000000000000000604482015290519081900360640190fd5b50900390565b6000828201838110156110ba576040805162461bcd60e51b8152602060048201526016602482015275536166654d617468236164643a204f564552464c4f5760501b604482015290519081900360640190fd5b9392505050565b6000813f80158015906110ba57507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47014159291505056fe4552433131353523736166655472616e7366657246726f6d3a20494e56414c49445f524543495049454e544552433131353523736166655472616e7366657246726f6d3a20494e56414c49445f4f50455241544f5245524331313535235f7361666542617463685472616e7366657246726f6d3a20494e56414c49445f4152524159535f4c454e47544845524331313535237361666542617463685472616e7366657246726f6d3a20494e56414c49445f524543495049454e54455243313135352362616c616e63654f6642617463683a20494e56414c49445f41525241595f4c454e47544845524331313535237361666542617463685472616e7366657246726f6d3a20494e56414c49445f4f50455241544f5245524331313535235f63616c6c6f6e45524331313535426174636852656365697665643a20494e56414c49445f4f4e5f524543454956455f4d45535341474545524331313535235f63616c6c6f6e4552433131353552656365697665643a20494e56414c49445f4f4e5f524543454956455f4d455353414745a2646970667358221220466b97e969777ba02fa49b279163f0c3bd1171318a000d48f899324312b76f9e64736f6c63430006080033";
