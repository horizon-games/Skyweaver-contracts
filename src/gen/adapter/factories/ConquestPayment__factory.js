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
exports.ConquestPayment__factory = void 0;
var ethers_1 = require("ethers");
var ConquestPayment__factory = /** @class */ (function (_super) {
    __extends(ConquestPayment__factory, _super);
    function ConquestPayment__factory(signer) {
        return _super.call(this, _abi, _bytecode, signer) || this;
    }
    ConquestPayment__factory.prototype.deploy = function (_firstOwner, _skyweaverAssetsAddress, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides) {
        return _super.prototype.deploy.call(this, _firstOwner, _skyweaverAssetsAddress, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides || {});
    };
    ConquestPayment__factory.prototype.getDeployTransaction = function (_firstOwner, _skyweaverAssetsAddress, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides) {
        return _super.prototype.getDeployTransaction.call(this, _firstOwner, _skyweaverAssetsAddress, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides || {});
    };
    ConquestPayment__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    ConquestPayment__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    ConquestPayment__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    return ConquestPayment__factory;
}(ethers_1.ContractFactory));
exports.ConquestPayment__factory = ConquestPayment__factory;
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
                name: "_skyweaverAssetsAddress",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_conquestEntryTokenId",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "_silverRangeMin",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "_silverRangeMax",
                type: "uint256"
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor"
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
        stateMutability: "nonpayable",
        type: "fallback"
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
        inputs: [],
        name: "conquestEntryID",
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
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "address",
                name: "",
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
        name: "onERC1155BatchReceived",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4"
            },
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
            },
        ],
        name: "onERC1155Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4"
            },
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "silverRangeMax",
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
        name: "silverRangeMin",
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
                internalType: "address",
                name: "_recipient",
                type: "address"
            },
            {
                internalType: "address",
                name: "_erc20",
                type: "address"
            },
        ],
        name: "withdrawERC20",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var _bytecode = "0x61010060405234801561001157600080fd5b5060405161129b38038061129b833981810160405260a081101561003457600080fd5b508051602082015160408301516060840151608090940151929391929091908473ffffffffffffffffffffffffffffffffffffffff81166100c0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611243602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a45073ffffffffffffffffffffffffffffffffffffffff84161580159061015a57508082105b6101af576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a815260200180611271602a913960400191505060405180910390fd5b606084901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660805260a083905260c082905260e081905273ffffffffffffffffffffffffffffffffffffffff90931693509091610ffd610246600039806105d05280610aba525080610a905280610d365250806105ac5280610af85250806107d35280610a485280610bd95250610ffd6000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c80639456fbcc11610076578063dcab988d1161005b578063dcab988d14610434578063e8f35d5a1461043c578063f23a6e611461046f576100be565b80639456fbcc146101f0578063bc197c811461022b576100be565b80633f911bae116100a75780633f911bae1461017c5780635d511a111461018457806384f4076e146101bf576100be565b806301ffc9a71461010f57806317119df514610162575b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526025815260200180610fa36025913960400191505060405180910390fd5b61014e6004803603602081101561012557600080fd5b50357fffffffff0000000000000000000000000000000000000000000000000000000016610511565b604080519115158252519081900360200190f35b61016a6105aa565b60408051918252519081900360200190f35b61016a6105ce565b6101bd6004803603604081101561019a57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356105f2565b005b6101c76107d1565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101bd6004803603604081101561020657600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160200135166107f5565b6103ff600480360360a081101561024157600080fd5b73ffffffffffffffffffffffffffffffffffffffff823581169260208101359091169181019060608101604082013564010000000081111561028257600080fd5b82018360208201111561029457600080fd5b803590602001918460208302840111640100000000831117156102b657600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561030657600080fd5b82018360208201111561031857600080fd5b8035906020019184602083028401116401000000008311171561033a57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561038a57600080fd5b82018360208201111561039c57600080fd5b803590602001918460018302840111640100000000831117156103be57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610a2e945050505050565b604080517fffffffff000000000000000000000000000000000000000000000000000000009092168252519081900360200190f35b61016a610d34565b61016a6004803603602081101561045257600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610d58565b6103ff600480360360a081101561048557600080fd5b73ffffffffffffffffffffffffffffffffffffffff823581169260208101359091169160408201359160608101359181019060a0810160808201356401000000008111156104d257600080fd5b8201836020820111156104e457600080fd5b8035906020019184600183028401116401000000008311171561050657600080fd5b509092509050610d80565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a70000000000000000000000000000000000000000000000000000000014806105a457507fffffffff0000000000000000000000000000000000000000000000000000000082167f4e2312e000000000000000000000000000000000000000000000000000000000145b92915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081111561067c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f106032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff83166106e8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180610e70602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff84161415610757576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526031815260200180610f726031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b7f000000000000000000000000000000000000000000000000000000000000000081565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081111561087f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f106032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff83166108eb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526030815260200180610f426030913960400191505060405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561095457600080fd5b505afa158015610968573d6000803e3d6000fd5b505050506040513d602081101561097e57600080fd5b5051604080517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff87811660048301526024820184905291519293509085169163a9059cbb916044808201926020929091908290030181600087803b1580156109fc57600080fd5b505af1158015610a10573d6000803e3d6000fd5b505050506040513d6020811015610a2657600080fd5b505050505050565b60003373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000161415610cb85760005b8451811015610b8a57848181518110610a8657fe5b60200260200101517f000000000000000000000000000000000000000000000000000000000000000011158015610af057507f0000000000000000000000000000000000000000000000000000000000000000858281518110610ae557fe5b602002602001015111155b80610b2d57507f0000000000000000000000000000000000000000000000000000000000000000858281518110610b2357fe5b6020026020010151145b610b82576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526035815260200180610edb6035913960400191505060405180910390fd5b600101610a71565b50604080517f20ec271b0000000000000000000000000000000000000000000000000000000081526004810191825285516044820152855173ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016926320ec271b92889288929182916024820191606401906020808801910280838360005b83811015610c35578181015183820152602001610c1d565b50505050905001838103825284818151815260200191508051906020019060200280838360005b83811015610c74578181015183820152602001610c5c565b50505050905001945050505050600060405180830381600087803b158015610c9b57600080fd5b505af1158015610caf573d6000803e3d6000fd5b50505050610d09565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603d815260200180610e9e603d913960400191505060405180910390fd5b507fbc197c810000000000000000000000000000000000000000000000000000000095945050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b604080516001808252818301909252600091606091906020808301908036833750506040805160018082528183019092529293506060929150602080830190803683370190505090508682600081518110610dd757fe5b6020026020010181815250508581600081518110610df157fe5b602002602001018181525050610e408989848489898080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610a2e92505050565b507ff23a6e6100000000000000000000000000000000000000000000000000000000999850505050505050505056fe5469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f41444452455353436f6e71756573745061796d656e74236f6e45524331313535426174636852656365697665643a20494e56414c49445f544f4b454e5f41444452455353436f6e71756573745061796d656e74236f6e45524331313535426174636852656365697665643a2049445f49535f494e56414c49445469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f57436f6e71756573745061796d656e7423776974686472617745524332303a20494e56414c49445f524543495049454e545469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552436f6e71756573745061796d656e74235f3a20554e535550504f525445445f4d4554484f44a2646970667358221220ab467541e0a7f550fbb17e9af5b05d1bb8cd85a90693d983091bd64e7f232b2064736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552436f6e71756573745061796d656e7423636f6e7374727563746f723a20494e56414c49445f494e505554";
