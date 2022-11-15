import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IRewardFactory, IRewardFactoryInterface } from "../../interfaces/IRewardFactory";
export declare class IRewardFactory__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
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
    static createInterface(): IRewardFactoryInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IRewardFactory;
}
