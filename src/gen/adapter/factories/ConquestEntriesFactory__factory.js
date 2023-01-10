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
exports.ConquestEntriesFactory__factory = void 0;
var ethers_1 = require("ethers");
var ConquestEntriesFactory__factory = /** @class */ (function (_super) {
    __extends(ConquestEntriesFactory__factory, _super);
    function ConquestEntriesFactory__factory(signer) {
        return _super.call(this, _abi, _bytecode, signer) || this;
    }
    ConquestEntriesFactory__factory.prototype.deploy = function (_firstOwner, _skyweaverAssetsAddress, _wDaiAddress, _wDaiID, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides) {
        return _super.prototype.deploy.call(this, _firstOwner, _skyweaverAssetsAddress, _wDaiAddress, _wDaiID, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides || {});
    };
    ConquestEntriesFactory__factory.prototype.getDeployTransaction = function (_firstOwner, _skyweaverAssetsAddress, _wDaiAddress, _wDaiID, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides) {
        return _super.prototype.getDeployTransaction.call(this, _firstOwner, _skyweaverAssetsAddress, _wDaiAddress, _wDaiID, _conquestEntryTokenId, _silverRangeMin, _silverRangeMax, overrides || {});
    };
    ConquestEntriesFactory__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    ConquestEntriesFactory__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    ConquestEntriesFactory__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    return ConquestEntriesFactory__factory;
}(ethers_1.ContractFactory));
exports.ConquestEntriesFactory__factory = ConquestEntriesFactory__factory;
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
                internalType: "address",
                name: "_wDaiAddress",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_wDaiID",
                type: "uint256"
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
        inputs: [],
        name: "wDaiID",
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
                name: "_recipient",
                type: "address"
            },
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes"
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var _bytecode = "0x61014060405234801561001157600080fd5b5060405161182b38038061182b833981810160405260e081101561003457600080fd5b508051602082015160408301516060840151608085015160a086015160c09096015194959394929391929091908673ffffffffffffffffffffffffffffffffffffffff81166100ce576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806117cc602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a45073ffffffffffffffffffffffffffffffffffffffff86161580159061017e575073ffffffffffffffffffffffffffffffffffffffff851615155b801561018957508082105b6101de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806117fa6031913960400191505060405180910390fd5b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606096871b81166080529490951b90931660a05260c0919091526101205260e052610100525060805160601c60a05160601c60c05160e05161010051610120516115216102ab600039806106115280610fee5250806106355280610c05525080610bdb52806110be52508061077b528061087a5280610b565280610e7c5250806107bb52806108bc5280610dfa525080610b325280610b935280610cd0528061103252506115216000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c806384f4076e11610081578063dcab988d1161005b578063dcab988d14610499578063e8f35d5a146104a1578063f23a6e61146104d4576100c9565b806384f4076e1461025757806397fc69a614610288578063bc197c8114610290576100c9565b80633f911bae116100b25780633f911bae146101875780634bb78b141461018f5780635d511a111461021e576100c9565b806301ffc9a71461011a57806317119df51461016d575b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602c81526020018061144b602c913960400191505060405180910390fd5b6101596004803603602081101561013057600080fd5b50357fffffffff0000000000000000000000000000000000000000000000000000000016610576565b604080519115158252519081900360200190f35b61017561060f565b60408051918252519081900360200190f35b610175610633565b61021c600480360360408110156101a557600080fd5b73ffffffffffffffffffffffffffffffffffffffff82351691908101906040810160208201356401000000008111156101dd57600080fd5b8201836020820111156101ef57600080fd5b8035906020019184600183028401116401000000008311171561021157600080fd5b509092509050610657565b005b61021c6004803603604081101561023457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610951565b61025f610b30565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b610175610b54565b610464600480360360a08110156102a657600080fd5b73ffffffffffffffffffffffffffffffffffffffff82358116926020810135909116918101906060810160408201356401000000008111156102e757600080fd5b8201836020820111156102f957600080fd5b8035906020019184602083028401116401000000008311171561031b57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561036b57600080fd5b82018360208201111561037d57600080fd5b8035906020019184602083028401116401000000008311171561039f57600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092959493602081019350359150506401000000008111156103ef57600080fd5b82018360208201111561040157600080fd5b8035906020019184600183028401116401000000008311171561042357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610b78945050505050565b604080517fffffffff000000000000000000000000000000000000000000000000000000009092168252519081900360200190f35b6101756110bc565b610175600480360360208110156104b757600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166110e0565b610464600480360360a08110156104ea57600080fd5b73ffffffffffffffffffffffffffffffffffffffff823581169260208101359091169160408201359160608101359181019060a08101608082013564010000000081111561053757600080fd5b82018360208201111561054957600080fd5b8035906020019184600183028401116401000000008311171561056b57600080fd5b509092509050611108565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000148061060957507fffffffff0000000000000000000000000000000000000000000000000000000082167f4e2312e000000000000000000000000000000000000000000000000000000000145b92915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff908111156106e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806114196032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff841661074d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806113e76032913960400191505060405180910390fd5b604080517efdd58e0000000000000000000000000000000000000000000000000000000081523060048201527f00000000000000000000000000000000000000000000000000000000000000006024820152905160009173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169162fdd58e91604480820192602092909190829003018186803b15801561080157600080fd5b505afa158015610815573d6000803e3d6000fd5b505050506040513d602081101561082b57600080fd5b50516040517ff242432a000000000000000000000000000000000000000000000000000000008152306004820181815273ffffffffffffffffffffffffffffffffffffffff89811660248501527f0000000000000000000000000000000000000000000000000000000000000000604485018190526064850186905260a06084860190815260a486018a90529596507f00000000000000000000000000000000000000000000000000000000000000009091169463f242432a948b9388928c928c92919060c401848480828437600081840152601f19601f820116905080830192505050975050505050505050600060405180830381600087803b15801561093257600080fd5b505af1158015610946573d6000803e3d6000fd5b505050505050505050565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff908111156109db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806114196032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316610a47576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611335602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff84161415610ab6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806114bb6031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000803373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000161415610de25760005b8551811015610cc057858181518110610bd157fe5b60200260200101517f000000000000000000000000000000000000000000000000000000000000000011158015610c3b57507f0000000000000000000000000000000000000000000000000000000000000000868281518110610c3057fe5b602002602001015111155b610c90576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260418152602001806113636041913960600191505060405180910390fd5b610cb6858281518110610c9f57fe5b6020026020010151836111f790919063ffffffff16565b9150600101610bbc565b50610ccc816064611272565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166320ec271b86866040518363ffffffff1660e01b8152600401808060200180602001838103835285818151815260200191508051906020019060200280838360005b83811015610d5f578181015183820152602001610d47565b50505050905001838103825284818151815260200191508051906020019060200280838360005b83811015610d9e578181015183820152602001610d86565b50505050905001945050505050600060405180830381600087803b158015610dc557600080fd5b505af1158015610dd9573d6000803e3d6000fd5b50505050610f80565b3373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000161415610f2f578451600114610e7a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260438152602001806113a46043913960600191505060405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000085600081518110610ea857fe5b602002602001015114610f06576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603e8152602001806112f7603e913960400191505060405180910390fd5b83516216e360908590600090610f1857fe5b602002602001015181610f2757fe5b049050610f80565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260448152602001806114776044913960600191505060405180910390fd5b600080845111610f905786610fa8565b838060200190516020811015610fa557600080fd5b50515b604080517f731133e900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff80841660048301527f000000000000000000000000000000000000000000000000000000000000000060248301526064868102604484015260809083015260006084830181905292519394507f0000000000000000000000000000000000000000000000000000000000000000169263731133e99260c48084019391929182900301818387803b15801561107757600080fd5b505af115801561108b573d6000803e3d6000fd5b507fbc197c81000000000000000000000000000000000000000000000000000000009b9a5050505050505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b60408051600180825281830190925260009160609190602080830190803683375050604080516001808252818301909252929350606092915060208083019080368337019050509050868260008151811061115f57fe5b602002602001018181525050858160008151811061117957fe5b6020026020010181815250506111c88989848489898080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610b7892505050565b507ff23a6e61000000000000000000000000000000000000000000000000000000009998505050505050505050565b60008282018381101561126b57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f536166654d617468236164643a204f564552464c4f5700000000000000000000604482015290519081900360640190fd5b9392505050565b60008082116112e257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f536166654d617468236469763a204449564953494f4e5f42595f5a45524f0000604482015290519081900360640190fd5b60008284816112ed57fe5b0494935050505056fe436f6e7175657374456e7472696573466163746f7279236f6e45524331313535426174636852656365697665643a20494e56414c49445f774441495f49445469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f41444452455353436f6e7175657374456e7472696573466163746f7279236f6e45524331313535426174636852656365697665643a2049445f49535f4f55545f4f465f52414e4745436f6e7175657374456e7472696573466163746f7279236f6e45524331313535426174636852656365697665643a20494e56414c49445f41525241595f4c454e475448436f6e7175657374456e7472696573466163746f72792377697468647261773a20494e56414c49445f524543495049454e545469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f57436f6e7175657374456e7472696573466163746f7279235f3a20554e535550504f525445445f4d4554484f44436f6e7175657374456e7472696573466163746f7279236f6e45524331313535426174636852656365697665643a20494e56414c49445f544f4b454e5f414444524553535469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552a26469706673582212203fe87dcad6cc13024bb20b1fd44fa8aeb157ece80c9711f3e14e15fbfa0145b264736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552436f6e7175657374456e7472696573466163746f727923636f6e7374727563746f723a20494e56414c49445f494e505554";