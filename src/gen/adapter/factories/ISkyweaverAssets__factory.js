"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.__esModule = true;
exports.ISkyweaverAssets__factory = void 0;
var ethers_1 = require("ethers");
var ISkyweaverAssets__factory = /** @class */ (function () {
    function ISkyweaverAssets__factory() {
    }
    ISkyweaverAssets__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    return ISkyweaverAssets__factory;
}());
exports.ISkyweaverAssets__factory = ISkyweaverAssets__factory;
var _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "factory",
                type: "address"
            },
        ],
        name: "FactoryActivation",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "factory",
                type: "address"
            },
        ],
        name: "FactoryShutdown",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "factory",
                type: "address"
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "minID",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256",
                        name: "maxID",
                        type: "uint256"
                    },
                ],
                indexed: false,
                internalType: "struct ISkyweaverAssets.AssetRange",
                name: "new_range",
                type: "tuple"
            },
        ],
        name: "MintPermissionAdded",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "factory",
                type: "address"
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "minID",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256",
                        name: "maxID",
                        type: "uint256"
                    },
                ],
                indexed: false,
                internalType: "struct ISkyweaverAssets.AssetRange",
                name: "deleted_range",
                type: "tuple"
            },
        ],
        name: "MintPermissionRemoved",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address"
            },
        ],
        name: "activateFactory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address"
            },
            {
                internalType: "uint64",
                name: "_minRange",
                type: "uint64"
            },
            {
                internalType: "uint64",
                name: "_maxRange",
                type: "uint64"
            },
            {
                internalType: "uint64",
                name: "_startTime",
                type: "uint64"
            },
            {
                internalType: "uint64",
                name: "_endTime",
                type: "uint64"
            },
        ],
        name: "addMintPermission",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
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
        name: "batchBurn",
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
                internalType: "uint256",
                name: "_id",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256"
            },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "_ids",
                type: "uint256[]"
            },
        ],
        name: "getCurrentIssuances",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address"
            },
        ],
        name: "getFactoryAccessRanges",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "minID",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256",
                        name: "maxID",
                        type: "uint256"
                    },
                ],
                internalType: "struct ISkyweaverAssets.AssetRange[]",
                name: "",
                type: "tuple[]"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address"
            },
        ],
        name: "getFactoryStatus",
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
        inputs: [
            {
                internalType: "uint256[]",
                name: "_ids",
                type: "uint256[]"
            },
        ],
        name: "getMaxIssuances",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "minID",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256",
                        name: "maxID",
                        type: "uint256"
                    },
                ],
                internalType: "struct ISkyweaverAssets.AssetRange",
                name: "_range",
                type: "tuple"
            },
        ],
        name: "lockRangeMintPermissions",
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
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_rangeIndex",
                type: "uint256"
            },
        ],
        name: "removeMintPermission",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "_ids",
                type: "uint256[]"
            },
            {
                internalType: "uint256[]",
                name: "_newMaxIssuances",
                type: "uint256[]"
            },
        ],
        name: "setMaxIssuances",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address"
            },
        ],
        name: "shutdownFactory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
