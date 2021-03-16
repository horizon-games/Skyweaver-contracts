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
exports.TieredOwnableMock__factory = void 0;
var ethers_1 = require("ethers");
var TieredOwnableMock__factory = /** @class */ (function (_super) {
    __extends(TieredOwnableMock__factory, _super);
    function TieredOwnableMock__factory(signer) {
        return _super.call(this, _abi, _bytecode, signer) || this;
    }
    TieredOwnableMock__factory.prototype.deploy = function (_firstOwner, overrides) {
        return _super.prototype.deploy.call(this, _firstOwner, overrides || {});
    };
    TieredOwnableMock__factory.prototype.getDeployTransaction = function (_firstOwner, overrides) {
        return _super.prototype.getDeployTransaction.call(this, _firstOwner, overrides || {});
    };
    TieredOwnableMock__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    TieredOwnableMock__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    TieredOwnableMock__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    return TieredOwnableMock__factory;
}(ethers_1.ContractFactory));
exports.TieredOwnableMock__factory = TieredOwnableMock__factory;
var _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_firstOwner",
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
        inputs: [],
        name: "anyone",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "nonpayable",
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
        name: "onlyMaxTier",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "onlyTierFive",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "onlyTierZero",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var _bytecode = "0x608060405234801561001057600080fd5b506040516106d93803806106d983398101604081905261002f91610118565b8073ffffffffffffffffffffffffffffffffffffffff811661009c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806106ab602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a45050610153565b600060208284031215610129578081fd5b815173ffffffffffffffffffffffffffffffffffffffff8116811461014c578182fd5b9392505050565b610549806101626000396000f3fe608060405234801561001057600080fd5b50600436106100725760003560e01c8063dd9fb4f611610050578063dd9fb4f6146100b2578063e8f35d5a146100ba578063f9dd0818146100da57610072565b80635d511a1114610077578063785beeb91461008c578063a67c68e8146100aa575b600080fd5b61008a610085366004610445565b6100e2565b005b6100946102c1565b6040516100a1919061046e565b60405180910390f35b6100946102c6565b610094610339565b6100cd6100c8366004610424565b61034a565b6040516100a19190610479565b610094610376565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081111561016c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806104b16032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff83166101d8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180610483602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff84161415610247576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806104e36031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b600190565b33600090815260208190526040812054600590811115610331576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806104b16032913960400191505060405180910390fd5b600191505090565b336000908152602081905280610331565b73ffffffffffffffffffffffffffffffffffffffff81166000908152602081905260409020545b919050565b336000908152602081905260408120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610331576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806104b16032913960400191505060405180910390fd5b803573ffffffffffffffffffffffffffffffffffffffff8116811461037157600080fd5b600060208284031215610435578081fd5b61043e82610400565b9392505050565b60008060408385031215610457578081fd5b61046083610400565b946020939093013593505050565b901515815260200190565b9081526020019056fe5469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f414444524553535469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f575469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552a2646970667358221220d6d70ea9a0f24f2116dfa46f1b8e69ed8c179c3f707e7c6c312dae926d2abb4264736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552";
