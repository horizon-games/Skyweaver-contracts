"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ExclusiveRewardFactory__factory = void 0;
var ethers_1 = require("ethers");
var ExclusiveRewardFactory__factory = /** @class */ (function (_super) {
    __extends(ExclusiveRewardFactory__factory, _super);
    function ExclusiveRewardFactory__factory(signer) {
        return _super.call(this, _abi, _bytecode, signer) || this;
    }
    ExclusiveRewardFactory__factory.prototype.deploy = function (_firstOwner, _assetsAddr, _periodLength, _periodMintLimit, _whitelistOnly, overrides) {
        return _super.prototype.deploy.call(this, _firstOwner, _assetsAddr, _periodLength, _periodMintLimit, _whitelistOnly, overrides || {});
    };
    ExclusiveRewardFactory__factory.prototype.getDeployTransaction = function (_firstOwner, _assetsAddr, _periodLength, _periodMintLimit, _whitelistOnly, overrides) {
        return _super.prototype.getDeployTransaction.call(this, _firstOwner, _assetsAddr, _periodLength, _periodMintLimit, _whitelistOnly, overrides || {});
    };
    ExclusiveRewardFactory__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    ExclusiveRewardFactory__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    ExclusiveRewardFactory__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    return ExclusiveRewardFactory__factory;
}(ethers_1.ContractFactory));
exports.ExclusiveRewardFactory__factory = ExclusiveRewardFactory__factory;
var _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_firstOwner",
                type: "address"
            },
            {
                internalType: "address",
                name: "_assetsAddr",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_periodLength",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "_periodMintLimit",
                type: "uint256"
            },
            {
                internalType: "bool",
                name: "_whitelistOnly",
                type: "bool"
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256[]",
                name: "disabledIds",
                type: "uint256[]"
            },
        ],
        name: "AssetsDisabled",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256[]",
                name: "enabledIds",
                type: "uint256[]"
            },
        ],
        name: "AssetsEnabled",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address"
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "previousTier",
                type: "uint256"
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "newTier",
                type: "uint256"
            },
        ],
        name: "OwnershipGranted",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "oldMintingLimit",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newMintingLimit",
                type: "uint256"
            },
        ],
        name: "PeriodMintLimitChanged",
        type: "event"
    },
    {
        stateMutability: "nonpayable",
        type: "fallback"
    },
    {
        inputs: [],
        name: "PERIOD_LENGTH",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_address",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_tier",
                type: "uint256"
            },
        ],
        name: "assignOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
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
            },
        ],
        name: "batchMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "_disabledIds",
                type: "uint256[]"
            },
        ],
        name: "disableMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "_enabledIds",
                type: "uint256[]"
            },
        ],
        name: "enableMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "getAvailableSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
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
        ],
        name: "getOwnerTier",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256"
            },
        ],
        name: "isMinted",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "livePeriod",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        name: "mintWhitelist",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "periodMintLimit",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "view",
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
            },
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
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "pure",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_newPeriodMintLimit",
                type: "uint256"
            },
        ],
        name: "updatePeriodMintLimit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var _bytecode = "0x60e060405234801561001057600080fd5b506040516114e73803806114e7833981810160405260a081101561003357600080fd5b5080516020820151604083015160608401516080909401519293919290919084848484848473ffffffffffffffffffffffffffffffffffffffff81166100c4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611491602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a45073ffffffffffffffffffffffffffffffffffffffff84161580159061015f5750600083115b801561016b5750600082115b6101c0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806114bf6028913960400191505060405180910390fd5b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606085901b1660805260a083905280151560f81b60c05282428161020157fe5b046001556002829055600382905560408051600081526020810184905281517fdc39d5ec34d8ece158f93c14cfb036acb3e58e254416fe92f43b3a0acd3c4d3d929181900390910190a15050505050505050505060805160601c60a05160c05160f81c61120061029160003980610dd4525080610c665280610cb45250806107335280610e8c52506112006000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063c167d1cd1161008c578063df6824b411610066578063df6824b414610414578063e7a891b914610484578063e8f35d5a1461048c578063f6869803146104bf576100ea565b8063c167d1cd1461037f578063c56cecd114610387578063cca4cdfc146103a4576100ea565b80634618163e116100c85780634618163e146101c55780635d511a11146101e257806384f4076e1461021d578063b48ab8b61461024e576100ea565b806301ffc9a71461013b57806333c41a901461018e5780633c1e1422146101ab575b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260238152602001806111176023913960400191505060405180910390fd5b61017a6004803603602081101561015157600080fd5b50357fffffffff00000000000000000000000000000000000000000000000000000000166104c7565b604080519115158252519081900360200190f35b61017a600480360360208110156101a457600080fd5b5035610511565b6101b3610537565b60408051918252519081900360200190f35b61017a600480360360208110156101db57600080fd5b503561053d565b61021b600480360360408110156101f857600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610552565b005b610225610731565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b61021b6004803603608081101561026457600080fd5b73ffffffffffffffffffffffffffffffffffffffff823516919081019060408101602082013564010000000081111561029c57600080fd5b8201836020820111156102ae57600080fd5b803590602001918460208302840111640100000000831117156102d057600080fd5b9193909290916020810190356401000000008111156102ee57600080fd5b82018360208201111561030057600080fd5b8035906020019184602083028401116401000000008311171561032257600080fd5b91939092909160208101903564010000000081111561034057600080fd5b82018360208201111561035257600080fd5b8035906020019184600183028401116401000000008311171561037457600080fd5b509092509050610755565b6101b361086c565b61021b6004803603602081101561039d57600080fd5b503561088f565b61021b600480360360208110156103ba57600080fd5b8101906020810181356401000000008111156103d557600080fd5b8201836020820111156103e757600080fd5b8035906020019184602083028401116401000000008311171561040957600080fd5b50909250905061096c565b61021b6004803603602081101561042a57600080fd5b81019060208101813564010000000081111561044557600080fd5b82018360208201111561045757600080fd5b8035906020019184602083028401116401000000008311171561047957600080fd5b509092509050610ae8565b6101b3610c64565b6101b3600480360360208110156104a257600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610c88565b6101b3610cb0565b7fffffffff0000000000000000000000000000000000000000000000000000000081167f01ffc9a70000000000000000000000000000000000000000000000000000000014919050565b6101008104600090815260056020526040902054600160ff9092169190911b9081161490565b60035481565b60046020526000908152604090205460ff1681565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff908111156105dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806111686032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316610648576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e81526020018061107f602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff841614156106b7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603181526020018061119a6031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b7f000000000000000000000000000000000000000000000000000000000000000081565b60005b8581101561085357600087878381811061076e57fe5b90506020020135905061078081610511565b156107d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001806110e46033913960400191505060405180910390fd5b8585838181106107e257fe5b90506020020135600114610841576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260378152602001806110ad6037913960400191505060405180910390fd5b61084a81610ce1565b50600101610758565b5061086387878787878787610d08565b50505050505050565b6000600154610879610cb0565b146108865760035461088a565b6002545b905090565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610919576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806111686032913960400191505060405180910390fd5b8160025411156109295760028290555b600354604080519182526020820184905280517fdc39d5ec34d8ece158f93c14cfb036acb3e58e254416fe92f43b3a0acd3c4d3d9281900390910190a150600355565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff908111156109f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806111686032913960400191505060405180910390fd5b60005b82811015610a6157600060046000868685818110610a1357fe5b6020908102929092013583525081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169115159190911790556001016109f9565b507f2572cac41bd79d41fcba7693c8f4c8b20b669d5932703f71ad98fdd2fe6283ad838360405180806020018281038252848482818152602001925060200280828437600083820152604051601f9091017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169092018290039550909350505050a1505050565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610b72576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806111686032913960400191505060405180910390fd5b60005b82811015610bdd57600160046000868685818110610b8f57fe5b6020908102929092013583525081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055600101610b75565b507ff2c92ec4d8bfbc2b83f758c1b47b68bfc2c27078d395e1897ca280cc5b028c27838360405180806020018281038252848482818152602001925060200280828437600083820152604051601f9091017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169092018290039550909350505050a1505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b60007f00000000000000000000000000000000000000000000000000000000000000004281610cdb57fe5b04905090565b610100810460009081526005602052604090208054600160ff9093169290921b9091179055565b33600090815260208190526040902054600190811115610d73576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806111686032913960400191505060405180910390fd5b6000610d7d610cb0565b600154909150600081831415610d965750600254610da0565b5060035460018390555b60005b89811015610e8257610dd0898983818110610dba57fe5b905060200201358361100790919063ffffffff16565b91507f000000000000000000000000000000000000000000000000000000000000000015610e7a57600460008c8c84818110610e0857fe5b602090810292909201358352508101919091526040016000205460ff16610e7a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e81526020018061113a602e913960400191505060405180910390fd5b600101610da3565b50806002819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663b48ab8b68c8c8c8c8c8c8c6040518863ffffffff1660e01b8152600401808873ffffffffffffffffffffffffffffffffffffffff16815260200180602001806020018060200184810384528a8a82818152602001925060200280828437600083820152601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169091018581038452888152602090810191508990890280828437600083820152601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01690910185810383528681526020019050868680828437600081840152601f19601f8201169050808301925050509a5050505050505050505050600060405180830381600087803b158015610fe257600080fd5b505af1158015610ff6573d6000803e3d6000fd5b505050505050505050505050505050565b60008282111561107857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f536166654d617468237375623a20554e444552464c4f57000000000000000000604482015290519081900360640190fd5b5090039056fe5469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f414444524553534578636c7573697665526577617264466163746f72792362617463684d696e743a204e4f4e5f4558434c55534956455f4d494e54494e474578636c7573697665526577617264466163746f72792362617463684d696e743a2049445f414c52454144595f4d494e544544526577617264466163746f7279235f3a20554e535550504f525445445f4d4554484f44526577617264466163746f72792362617463684d696e743a2049445f49535f4e4f545f57484954454c49535445445469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f575469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552a26469706673582212204ee9460b6ff946907b8438e2086804917e6ce519d025c3bf3fbac4b0fe0d8edd64736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552526577617264466163746f727923636f6e7374727563746f723a20494e56414c49445f494e505554";
