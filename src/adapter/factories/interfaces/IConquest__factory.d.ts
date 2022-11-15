import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IConquest, IConquestInterface } from "../../interfaces/IConquest";
export declare class IConquest__factory {
    static readonly abi: {
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
    }[];
    static createInterface(): IConquestInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IConquest;
}
