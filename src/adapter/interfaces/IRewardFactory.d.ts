import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface IRewardFactoryInterface extends utils.Interface {
    functions: {
        "batchMint(address,uint256[],uint256[],bytes)": FunctionFragment;
        "getAvailableSupply()": FunctionFragment;
        "livePeriod()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "updatePeriodMintLimit(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "batchMint" | "getAvailableSupply" | "livePeriod" | "supportsInterface" | "updatePeriodMintLimit"): FunctionFragment;
    encodeFunctionData(functionFragment: "batchMint", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "getAvailableSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "livePeriod", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "updatePeriodMintLimit", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAvailableSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "livePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updatePeriodMintLimit", data: BytesLike): Result;
    events: {
        "PeriodMintLimitChanged(uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "PeriodMintLimitChanged"): EventFragment;
}
export interface PeriodMintLimitChangedEventObject {
    oldMintingLimit: BigNumber;
    newMintingLimit: BigNumber;
}
export declare type PeriodMintLimitChangedEvent = TypedEvent<[
    BigNumber,
    BigNumber
], PeriodMintLimitChangedEventObject>;
export declare type PeriodMintLimitChangedEventFilter = TypedEventFilter<PeriodMintLimitChangedEvent>;
export interface IRewardFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IRewardFactoryInterface;
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
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getAvailableSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        livePeriod(overrides?: CallOverrides): Promise<[BigNumber]>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;
    livePeriod(overrides?: CallOverrides): Promise<BigNumber>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;
        livePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "PeriodMintLimitChanged(uint256,uint256)"(oldMintingLimit?: null, newMintingLimit?: null): PeriodMintLimitChangedEventFilter;
        PeriodMintLimitChanged(oldMintingLimit?: null, newMintingLimit?: null): PeriodMintLimitChangedEventFilter;
    };
    estimateGas: {
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;
        livePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getAvailableSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        livePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        updatePeriodMintLimit(_newPeriodMintLimit: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
