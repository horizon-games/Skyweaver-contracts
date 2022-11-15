import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { RewardFactory, RewardFactoryInterface } from "../../factories/RewardFactory";
declare type RewardFactoryConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class RewardFactory__factory extends ContractFactory {
    constructor(...args: RewardFactoryConstructorParams);
    deploy(_firstOwner: PromiseOrValue<string>, _assetsAddr: PromiseOrValue<string>, _periodLength: PromiseOrValue<BigNumberish>, _periodMintLimit: PromiseOrValue<BigNumberish>, _whitelistOnly: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<RewardFactory>;
    getDeployTransaction(_firstOwner: PromiseOrValue<string>, _assetsAddr: PromiseOrValue<string>, _periodLength: PromiseOrValue<BigNumberish>, _periodMintLimit: PromiseOrValue<BigNumberish>, _whitelistOnly: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): RewardFactory;
    connect(signer: Signer): RewardFactory__factory;
    static readonly bytecode = "0x60e060405234801561001057600080fd5b506040516112e73803806112e7833981810160405260a081101561003357600080fd5b508051602082015160408301516060840151608090940151929391929091908473ffffffffffffffffffffffffffffffffffffffff81166100bf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611291602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a45073ffffffffffffffffffffffffffffffffffffffff84161580159061015a5750600083115b80156101665750600082115b6101bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806112bf6028913960400191505060405180910390fd5b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606085901b1660805260a083905280151560f81b60c0528242816101fc57fe5b046001556002829055600382905560408051600081526020810184905281517fdc39d5ec34d8ece158f93c14cfb036acb3e58e254416fe92f43b3a0acd3c4d3d929181900390910190a1505050505060805160601c60a05160c05160f81c61100a610287600039806107d3525080610e005280610e4e5250806106e5528061088b525061100a6000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c8063c167d1cd1161008c578063df6824b411610066578063df6824b4146103ec578063e7a891b91461045c578063e8f35d5a14610464578063f686980314610497576100df565b8063c167d1cd14610357578063c56cecd11461035f578063cca4cdfc1461037c576100df565b80635d511a11116100bd5780635d511a11146101ba57806384f4076e146101f5578063b48ab8b614610226576100df565b806301ffc9a7146101305780633c1e1422146101835780634618163e1461019d575b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180610f216023913960400191505060405180910390fd5b61016f6004803603602081101561014657600080fd5b50357fffffffff000000000000000000000000000000000000000000000000000000001661049f565b604080519115158252519081900360200190f35b61018b6104e9565b60408051918252519081900360200190f35b61016f600480360360208110156101b357600080fd5b50356104ef565b6101f3600480360360408110156101d057600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610504565b005b6101fd6106e3565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101f36004803603608081101561023c57600080fd5b73ffffffffffffffffffffffffffffffffffffffff823516919081019060408101602082013564010000000081111561027457600080fd5b82018360208201111561028657600080fd5b803590602001918460208302840111640100000000831117156102a857600080fd5b9193909290916020810190356401000000008111156102c657600080fd5b8201836020820111156102d857600080fd5b803590602001918460208302840111640100000000831117156102fa57600080fd5b91939092909160208101903564010000000081111561031857600080fd5b82018360208201111561032a57600080fd5b8035906020019184600183028401116401000000008311171561034c57600080fd5b509092509050610707565b61018b610a06565b6101f36004803603602081101561037557600080fd5b5035610a29565b6101f36004803603602081101561039257600080fd5b8101906020810181356401000000008111156103ad57600080fd5b8201836020820111156103bf57600080fd5b803590602001918460208302840111640100000000831117156103e157600080fd5b509092509050610b06565b6101f36004803603602081101561040257600080fd5b81019060208101813564010000000081111561041d57600080fd5b82018360208201111561042f57600080fd5b8035906020019184602083028401116401000000008311171561045157600080fd5b509092509050610c82565b61018b610dfe565b61018b6004803603602081101561047a57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610e22565b61018b610e4a565b7fffffffff0000000000000000000000000000000000000000000000000000000081167f01ffc9a70000000000000000000000000000000000000000000000000000000014919050565b60035481565b60046020526000908152604090205460ff1681565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081111561058e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f726032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff83166105fa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180610ef3602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff84161415610669576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526031815260200180610fa46031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b7f000000000000000000000000000000000000000000000000000000000000000081565b33600090815260208190526040902054600190811115610772576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f726032913960400191505060405180910390fd5b600061077c610e4a565b600154909150600081831415610795575060025461079f565b5060035460018390555b60005b89811015610881576107cf8989838181106107b957fe5b9050602002013583610e7b90919063ffffffff16565b91507f00000000000000000000000000000000000000000000000000000000000000001561087957600460008c8c8481811061080757fe5b602090810292909201358352508101919091526040016000205460ff16610879576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180610f44602e913960400191505060405180910390fd5b6001016107a2565b50806002819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663b48ab8b68c8c8c8c8c8c8c6040518863ffffffff1660e01b8152600401808873ffffffffffffffffffffffffffffffffffffffff16815260200180602001806020018060200184810384528a8a82818152602001925060200280828437600083820152601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169091018581038452888152602090810191508990890280828437600083820152601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01690910185810383528681526020019050868680828437600081840152601f19601f8201169050808301925050509a5050505050505050505050600060405180830381600087803b1580156109e157600080fd5b505af11580156109f5573d6000803e3d6000fd5b505050505050505050505050505050565b6000600154610a13610e4a565b14610a2057600354610a24565b6002545b905090565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610ab3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f726032913960400191505060405180910390fd5b816002541115610ac35760028290555b600354604080519182526020820184905280517fdc39d5ec34d8ece158f93c14cfb036acb3e58e254416fe92f43b3a0acd3c4d3d9281900390910190a150600355565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610b90576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f726032913960400191505060405180910390fd5b60005b82811015610bfb57600060046000868685818110610bad57fe5b6020908102929092013583525081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055600101610b93565b507f2572cac41bd79d41fcba7693c8f4c8b20b669d5932703f71ad98fdd2fe6283ad838360405180806020018281038252848482818152602001925060200280828437600083820152604051601f9091017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169092018290039550909350505050a1505050565b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610d0c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526032815260200180610f726032913960400191505060405180910390fd5b60005b82811015610d7757600160046000868685818110610d2957fe5b6020908102929092013583525081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055600101610d0f565b507ff2c92ec4d8bfbc2b83f758c1b47b68bfc2c27078d395e1897ca280cc5b028c27838360405180806020018281038252848482818152602001925060200280828437600083820152604051601f9091017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169092018290039550909350505050a1505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b60007f00000000000000000000000000000000000000000000000000000000000000004281610e7557fe5b04905090565b600082821115610eec57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f536166654d617468237375623a20554e444552464c4f57000000000000000000604482015290519081900360640190fd5b5090039056fe5469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f41444452455353526577617264466163746f7279235f3a20554e535550504f525445445f4d4554484f44526577617264466163746f72792362617463684d696e743a2049445f49535f4e4f545f57484954454c49535445445469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f575469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552a26469706673582212205de3804f224025bfa62a07b4b4c17bb1bc7cb4a4a46bb05ed8f87ad2aa442c4664736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552526577617264466163746f727923636f6e7374727563746f723a20494e56414c49445f494e505554";
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        stateMutability: string;
        type: string;
        inputs?: undefined;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): RewardFactoryInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RewardFactory;
}
export {};