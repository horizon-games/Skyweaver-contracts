import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { TieredOwnable, TieredOwnableInterface } from "../../utils/TieredOwnable";
declare type TieredOwnableConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TieredOwnable__factory extends ContractFactory {
    constructor(...args: TieredOwnableConstructorParams);
    deploy(_firstOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TieredOwnable>;
    getDeployTransaction(_firstOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TieredOwnable;
    connect(signer: Signer): TieredOwnable__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506040516104dd3803806104dd8339818101604052602081101561003357600080fd5b505173ffffffffffffffffffffffffffffffffffffffff81166100a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806104af602e913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000818152602081905260408082207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081905590519092907fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e908390a450610389806101266000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635d511a111461003b578063e8f35d5a14610076575b600080fd5b6100746004803603604081101561005157600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356100bb565b005b6100a96004803603602081101561008c57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661029a565b60408051918252519081900360200190f35b336000908152602081905260409020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90811115610145576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806102f16032913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff83166101b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001806102c3602e913960400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff84161415610220576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806103236031913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316600081815260208190526040808220549051859391927fa4e9b194bafb51369051927f4c07278de72aa1ee689f375215ea3a16dfef618e91a45073ffffffffffffffffffffffffffffffffffffffff909116600090815260208190526040902055565b73ffffffffffffffffffffffffffffffffffffffff166000908152602081905260409020549056fe5469657265644f776e61626c652361737369676e4f776e6572736869703a20494e56414c49445f414444524553535469657265644f776e61626c65236f6e6c794f776e6572546965723a204f574e45525f544945525f49535f544f4f5f4c4f575469657265644f776e61626c652361737369676e4f776e6572736869703a205550444154494e475f53454c465f54494552a2646970667358221220afb491b745fa62190f3e2d5bf4a189af11486af484141f5837ff712b8b8a6d6564736f6c634300070400335469657265644f776e61626c6523636f6e7374727563746f723a20494e56414c49445f46495253545f4f574e4552";
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
    static createInterface(): TieredOwnableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TieredOwnable;
}
export {};
