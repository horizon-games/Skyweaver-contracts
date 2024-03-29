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
exports.FreemintFactory__factory = void 0;
var ethers_1 = require("ethers");
var FreemintFactory__factory = /** @class */ (function (_super) {
    __extends(FreemintFactory__factory, _super);
    function FreemintFactory__factory(signer) {
        return _super.call(this, _abi, _bytecode, signer) || this;
    }
    FreemintFactory__factory.prototype.deploy = function (_firstOwner, _assetsAddr, overrides) {
        return _super.prototype.deploy.call(this, _firstOwner, _assetsAddr, overrides || {});
    };
    FreemintFactory__factory.prototype.getDeployTransaction = function (_firstOwner, _assetsAddr, overrides) {
        return _super.prototype.getDeployTransaction.call(this, _firstOwner, _assetsAddr, overrides || {});
    };
    FreemintFactory__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    FreemintFactory__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    FreemintFactory__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    return FreemintFactory__factory;
}(ethers_1.ContractFactory));
exports.FreemintFactory__factory = FreemintFactory__factory;
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
        inputs: [
            {
                internalType: "address[]",
                name: "_recipients",
                type: "address[]"
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
        ],
        name: "batchMint",
        outputs: [],
        stateMutability: "nonpayable",
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
        inputs: [],
        name: "getSkyweaverAssets",
        outputs: [
            {
                internalType: "address",
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
];
var _bytecode = "0x608060405234801561001057600080fd5b50604051610a31380380610a318339818101604052604081101561003357600080fd5b5080516020909101518173ffffffffffffffffffffffffffffffffffffffff81166100a9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806109d9602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a45073ffffffffffffffffffffffffffffffffffffffff811661018b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a815260200180610a07602a913960400191505060405180910390fd5b600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055506107f9806101e06000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c806365d9c8ad1161005057806365d9c8ad14610146578063d559f05b14610177578063e8f35d5a1461028b57610067565b806301ffc9a7146100b85780635d511a111461010b575b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061076e6025913960400191505060405180910390fd5b6100f7600480360360208110156100ce57600080fd5b50357fffffffff00000000000000000000000000000000000000000000000000000000166102d0565b604080519115158252519081900360200190f35b6101446004803603604081101561012157600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813516906020013561031a565b005b61014e6104f9565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101446004803603606081101561018d57600080fd5b8101906020810181356401000000008111156101a857600080fd5b8201836020820111156101ba57600080fd5b803590602001918460208302840111640100000000831117156101dc57600080fd5b9193909290916020810190356401000000008111156101fa57600080fd5b82018360208201111561020c57600080fd5b8035906020019184602083028401116401000000008311171561022e57600080fd5b91939092909160208101903564010000000081111561024c57600080fd5b82018360208201111561025e57600080fd5b8035906020019184602083028401116401000000008311171561028057600080fd5b509092509050610515565b6102be600480360360208110156102a157600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166106e5565b60408051918252519081900360200190f35b7fffffffff0000000000000000000000000000000000000000000000000000000081167f01ffc9a70000000000000000000000000000000000000000000000000000000014919050565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff908111156103a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603281526020018061073c6032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316610410576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e81526020018061070e602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff8416141561047f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806107936031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b60015473ffffffffffffffffffffffffffffffffffffffff1690565b33600090815260208190526040902054600190811115610580576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603281526020018061073c6032913960400191505060405180910390fd5b60005b868110156106db5760015473ffffffffffffffffffffffffffffffffffffffff1663b48ab8b68989848181106105b557fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff16888888886040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001806020018481038452888882818152602001925060200280828437600083820152601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169091018581038452868152602090810191508790870280828437600081840152601f19601f82011690508083019250505084810382526000815260200160200198505050505050505050600060405180830381600087803b1580156106b757600080fd5b505af11580156106cb573d6000803e3d6000fd5b5050600190920191506105839050565b5050505050505050565b73ffffffffffffffffffffffffffffffffffffffff166000908152602081905260409020549056fe5469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f414444524553535469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f57467265656d696e74466163746f7279235f3a20554e535550504f525445445f4d4554484f445469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552a2646970667358221220627e0b1c82743d3c8b762818d02d7e08e56cf9689802ba05d0a09d24e4fba50264736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552467265656d696e74466163746f727923636f6e7374727563746f723a20494e56414c49445f494e505554";
