import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface BondingCurveFactoryInterface extends utils.Interface {
    functions: {
        "assignOwnership(address,uint256)": FunctionFragment;
        "getMintingCost(uint256[],uint256[])": FunctionFragment;
        "getMintingTotalCost(uint256[],uint256[])": FunctionFragment;
        "getOwnerTier(address)": FunctionFragment;
        "mintedAmounts(uint256)": FunctionFragment;
        "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)": FunctionFragment;
        "onERC1155Received(address,address,uint256,uint256,bytes)": FunctionFragment;
        "skyweaverAssets()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "usdc()": FunctionFragment;
        "usdcCost(uint256,uint256)": FunctionFragment;
        "usdcCurve(uint256)": FunctionFragment;
        "usdcTotalCost(uint256[],uint256[])": FunctionFragment;
        "withdrawERC20(address,address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "assignOwnership" | "getMintingCost" | "getMintingTotalCost" | "getOwnerTier" | "mintedAmounts" | "onERC1155BatchReceived" | "onERC1155Received" | "skyweaverAssets" | "supportsInterface" | "usdc" | "usdcCost" | "usdcCurve" | "usdcTotalCost" | "withdrawERC20"): FunctionFragment;
    encodeFunctionData(functionFragment: "assignOwnership", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getMintingCost", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getMintingTotalCost", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getOwnerTier", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "mintedAmounts", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "onERC1155BatchReceived", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "onERC1155Received", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "skyweaverAssets", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "usdc", values?: undefined): string;
    encodeFunctionData(functionFragment: "usdcCost", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "usdcCurve", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "usdcTotalCost", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "withdrawERC20", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "assignOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMintingCost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMintingTotalCost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwnerTier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintedAmounts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155BatchReceived", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "skyweaverAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usdc", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usdcCost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usdcCurve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usdcTotalCost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawERC20", data: BytesLike): Result;
    events: {
        "OwnershipGranted(address,uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipGranted"): EventFragment;
}
export interface OwnershipGrantedEventObject {
    owner: string;
    previousTier: BigNumber;
    newTier: BigNumber;
}
export declare type OwnershipGrantedEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], OwnershipGrantedEventObject>;
export declare type OwnershipGrantedEventFilter = TypedEventFilter<OwnershipGrantedEvent>;
export interface BondingCurveFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: BondingCurveFactoryInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getMintingCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[], BigNumber[]]>;
        getMintingTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            nItems: BigNumber;
            nUSDC: BigNumber;
        }>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        mintedAmounts(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        skyweaverAssets(overrides?: CallOverrides): Promise<[string]>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        usdc(overrides?: CallOverrides): Promise<[string]>;
        usdcCost(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber] & {
            nUSDC: BigNumber;
        }>;
        usdcCurve(_x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber] & {
            nUsdc: BigNumber;
        }>;
        usdcTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber] & {
            nUSDC: BigNumber;
        }>;
        withdrawERC20(_recipient: PromiseOrValue<string>, _erc20: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getMintingCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[], BigNumber[]]>;
    getMintingTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
        nItems: BigNumber;
        nUSDC: BigNumber;
    }>;
    getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    mintedAmounts(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    skyweaverAssets(overrides?: CallOverrides): Promise<string>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    usdc(overrides?: CallOverrides): Promise<string>;
    usdcCost(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    usdcCurve(_x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    usdcTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
    withdrawERC20(_recipient: PromiseOrValue<string>, _erc20: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getMintingCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[], BigNumber[]]>;
        getMintingTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            nItems: BigNumber;
            nUSDC: BigNumber;
        }>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mintedAmounts(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        skyweaverAssets(overrides?: CallOverrides): Promise<string>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        usdc(overrides?: CallOverrides): Promise<string>;
        usdcCost(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        usdcCurve(_x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        usdcTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        withdrawERC20(_recipient: PromiseOrValue<string>, _erc20: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "OwnershipGranted(address,uint256,uint256)"(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
        OwnershipGranted(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
    };
    estimateGas: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getMintingCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getMintingTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mintedAmounts(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        skyweaverAssets(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        usdc(overrides?: CallOverrides): Promise<BigNumber>;
        usdcCost(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        usdcCurve(_x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        usdcTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        withdrawERC20(_recipient: PromiseOrValue<string>, _erc20: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getMintingCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getMintingTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mintedAmounts(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        skyweaverAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        usdc(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        usdcCost(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        usdcCurve(_x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        usdcTotalCost(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawERC20(_recipient: PromiseOrValue<string>, _erc20: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
