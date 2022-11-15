import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface RewardFactoryInterface extends utils.Interface {
    functions: {
        "PERIOD_LENGTH()": FunctionFragment;
        "assignOwnership(address,uint256)": FunctionFragment;
        "batchMint(address,uint256[],uint256[],bytes)": FunctionFragment;
        "disableMint(uint256[])": FunctionFragment;
        "enableMint(uint256[])": FunctionFragment;
        "getAvailableSupply()": FunctionFragment;
        "getOwnerTier(address)": FunctionFragment;
        "livePeriod()": FunctionFragment;
        "mintWhitelist(uint256)": FunctionFragment;
        "periodMintLimit()": FunctionFragment;
        "skyweaverAssets()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "updatePeriodMintLimit(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "PERIOD_LENGTH" | "assignOwnership" | "batchMint" | "disableMint" | "enableMint" | "getAvailableSupply" | "getOwnerTier" | "livePeriod" | "mintWhitelist" | "periodMintLimit" | "skyweaverAssets" | "supportsInterface" | "updatePeriodMintLimit"): FunctionFragment;
    encodeFunctionData(functionFragment: "PERIOD_LENGTH", values?: undefined): string;
    encodeFunctionData(functionFragment: "assignOwnership", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "batchMint", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "disableMint", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "enableMint", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getAvailableSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "getOwnerTier", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "livePeriod", values?: undefined): string;
    encodeFunctionData(functionFragment: "mintWhitelist", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "periodMintLimit", values?: undefined): string;
    encodeFunctionData(functionFragment: "skyweaverAssets", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "updatePeriodMintLimit", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "PERIOD_LENGTH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assignOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "disableMint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "enableMint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAvailableSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwnerTier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "livePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintWhitelist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "periodMintLimit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "skyweaverAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updatePeriodMintLimit", data: BytesLike): Result;
    events: {
        "AssetsDisabled(uint256[])": EventFragment;
        "AssetsEnabled(uint256[])": EventFragment;
        "OwnershipGranted(address,uint256,uint256)": EventFragment;
        "PeriodMintLimitChanged(uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AssetsDisabled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "AssetsEnabled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipGranted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PeriodMintLimitChanged"): EventFragment;
}
export interface AssetsDisabledEventObject {
    disabledIds: BigNumber[];
}
export declare type AssetsDisabledEvent = TypedEvent<[
    BigNumber[]
], AssetsDisabledEventObject>;
export declare type AssetsDisabledEventFilter = TypedEventFilter<AssetsDisabledEvent>;
export interface AssetsEnabledEventObject {
    enabledIds: BigNumber[];
}
export declare type AssetsEnabledEvent = TypedEvent<[
    BigNumber[]
], AssetsEnabledEventObject>;
export declare type AssetsEnabledEventFilter = TypedEventFilter<AssetsEnabledEvent>;
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
export interface PeriodMintLimitChangedEventObject {
    oldMintingLimit: BigNumber;
    newMintingLimit: BigNumber;
}
export declare type PeriodMintLimitChangedEvent = TypedEvent<[
    BigNumber,
    BigNumber
], PeriodMintLimitChangedEventObject>;
export declare type PeriodMintLimitChangedEventFilter = TypedEventFilter<PeriodMintLimitChangedEvent>;
export interface RewardFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: RewardFactoryInterface;
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
        PERIOD_LENGTH(overrides?: CallOverrides): Promise<[BigNumber]>;
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        disableMint(_disabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        enableMint(_enabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getAvailableSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        livePeriod(overrides?: CallOverrides): Promise<[BigNumber]>;
        mintWhitelist(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        periodMintLimit(overrides?: CallOverrides): Promise<[BigNumber]>;
        skyweaverAssets(overrides?: CallOverrides): Promise<[string]>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    PERIOD_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;
    assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    disableMint(_disabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    enableMint(_enabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;
    getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    livePeriod(overrides?: CallOverrides): Promise<BigNumber>;
    mintWhitelist(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    periodMintLimit(overrides?: CallOverrides): Promise<BigNumber>;
    skyweaverAssets(overrides?: CallOverrides): Promise<string>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        PERIOD_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        disableMint(_disabledIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        enableMint(_enabledIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        livePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        mintWhitelist(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        periodMintLimit(overrides?: CallOverrides): Promise<BigNumber>;
        skyweaverAssets(overrides?: CallOverrides): Promise<string>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AssetsDisabled(uint256[])"(disabledIds?: null): AssetsDisabledEventFilter;
        AssetsDisabled(disabledIds?: null): AssetsDisabledEventFilter;
        "AssetsEnabled(uint256[])"(enabledIds?: null): AssetsEnabledEventFilter;
        AssetsEnabled(enabledIds?: null): AssetsEnabledEventFilter;
        "OwnershipGranted(address,uint256,uint256)"(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
        OwnershipGranted(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
        "PeriodMintLimitChanged(uint256,uint256)"(oldMintingLimit?: null, newMintingLimit?: null): PeriodMintLimitChangedEventFilter;
        PeriodMintLimitChanged(oldMintingLimit?: null, newMintingLimit?: null): PeriodMintLimitChangedEventFilter;
    };
    estimateGas: {
        PERIOD_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        disableMint(_disabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        enableMint(_enabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        livePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        mintWhitelist(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        periodMintLimit(overrides?: CallOverrides): Promise<BigNumber>;
        skyweaverAssets(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        PERIOD_LENGTH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        disableMint(_disabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        enableMint(_enabledIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getAvailableSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        livePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mintWhitelist(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        periodMintLimit(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        skyweaverAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
