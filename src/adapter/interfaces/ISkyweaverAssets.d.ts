import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export declare namespace ISkyweaverAssets {
    type AssetRangeStruct = {
        minID: PromiseOrValue<BigNumberish>;
        maxID: PromiseOrValue<BigNumberish>;
    };
    type AssetRangeStructOutput = [BigNumber, BigNumber] & {
        minID: BigNumber;
        maxID: BigNumber;
    };
}
export interface ISkyweaverAssetsInterface extends utils.Interface {
    functions: {
        "activateFactory(address)": FunctionFragment;
        "addMintPermission(address,uint64,uint64,uint64,uint64)": FunctionFragment;
        "batchBurn(uint256[],uint256[])": FunctionFragment;
        "batchMint(address,uint256[],uint256[],bytes)": FunctionFragment;
        "burn(uint256,uint256)": FunctionFragment;
        "getCurrentIssuances(uint256[])": FunctionFragment;
        "getFactoryAccessRanges(address)": FunctionFragment;
        "getFactoryStatus(address)": FunctionFragment;
        "getMaxIssuances(uint256[])": FunctionFragment;
        "lockRangeMintPermissions((uint256,uint256))": FunctionFragment;
        "mint(address,uint256,uint256,bytes)": FunctionFragment;
        "removeMintPermission(address,uint256)": FunctionFragment;
        "setMaxIssuances(uint256[],uint256[])": FunctionFragment;
        "shutdownFactory(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "activateFactory" | "addMintPermission" | "batchBurn" | "batchMint" | "burn" | "getCurrentIssuances" | "getFactoryAccessRanges" | "getFactoryStatus" | "getMaxIssuances" | "lockRangeMintPermissions" | "mint" | "removeMintPermission" | "setMaxIssuances" | "shutdownFactory"): FunctionFragment;
    encodeFunctionData(functionFragment: "activateFactory", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "addMintPermission", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "batchBurn", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "batchMint", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "burn", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getCurrentIssuances", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getFactoryAccessRanges", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getFactoryStatus", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getMaxIssuances", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "lockRangeMintPermissions", values: [ISkyweaverAssets.AssetRangeStruct]): string;
    encodeFunctionData(functionFragment: "mint", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "removeMintPermission", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setMaxIssuances", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "shutdownFactory", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "activateFactory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addMintPermission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "batchBurn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentIssuances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFactoryAccessRanges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFactoryStatus", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMaxIssuances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockRangeMintPermissions", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeMintPermission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaxIssuances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "shutdownFactory", data: BytesLike): Result;
    events: {
        "FactoryActivation(address)": EventFragment;
        "FactoryShutdown(address)": EventFragment;
        "MintPermissionAdded(address,tuple)": EventFragment;
        "MintPermissionRemoved(address,tuple)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "FactoryActivation"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FactoryShutdown"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MintPermissionAdded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MintPermissionRemoved"): EventFragment;
}
export interface FactoryActivationEventObject {
    factory: string;
}
export declare type FactoryActivationEvent = TypedEvent<[
    string
], FactoryActivationEventObject>;
export declare type FactoryActivationEventFilter = TypedEventFilter<FactoryActivationEvent>;
export interface FactoryShutdownEventObject {
    factory: string;
}
export declare type FactoryShutdownEvent = TypedEvent<[
    string
], FactoryShutdownEventObject>;
export declare type FactoryShutdownEventFilter = TypedEventFilter<FactoryShutdownEvent>;
export interface MintPermissionAddedEventObject {
    factory: string;
    new_range: ISkyweaverAssets.AssetRangeStructOutput;
}
export declare type MintPermissionAddedEvent = TypedEvent<[
    string,
    ISkyweaverAssets.AssetRangeStructOutput
], MintPermissionAddedEventObject>;
export declare type MintPermissionAddedEventFilter = TypedEventFilter<MintPermissionAddedEvent>;
export interface MintPermissionRemovedEventObject {
    factory: string;
    deleted_range: ISkyweaverAssets.AssetRangeStructOutput;
}
export declare type MintPermissionRemovedEvent = TypedEvent<[
    string,
    ISkyweaverAssets.AssetRangeStructOutput
], MintPermissionRemovedEventObject>;
export declare type MintPermissionRemovedEventFilter = TypedEventFilter<MintPermissionRemovedEvent>;
export interface ISkyweaverAssets extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ISkyweaverAssetsInterface;
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
        activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        batchBurn(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        burn(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getCurrentIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[]]>;
        getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[ISkyweaverAssets.AssetRangeStructOutput[]]>;
        getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[]]>;
        lockRangeMintPermissions(_range: ISkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    batchBurn(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    burn(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getCurrentIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
    getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<ISkyweaverAssets.AssetRangeStructOutput[]>;
    getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
    lockRangeMintPermissions(_range: ISkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        activateFactory(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        batchBurn(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        burn(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getCurrentIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
        getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<ISkyweaverAssets.AssetRangeStructOutput[]>;
        getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
        lockRangeMintPermissions(_range: ISkyweaverAssets.AssetRangeStruct, overrides?: CallOverrides): Promise<void>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "FactoryActivation(address)"(factory?: PromiseOrValue<string> | null): FactoryActivationEventFilter;
        FactoryActivation(factory?: PromiseOrValue<string> | null): FactoryActivationEventFilter;
        "FactoryShutdown(address)"(factory?: PromiseOrValue<string> | null): FactoryShutdownEventFilter;
        FactoryShutdown(factory?: PromiseOrValue<string> | null): FactoryShutdownEventFilter;
        "MintPermissionAdded(address,tuple)"(factory?: PromiseOrValue<string> | null, new_range?: null): MintPermissionAddedEventFilter;
        MintPermissionAdded(factory?: PromiseOrValue<string> | null, new_range?: null): MintPermissionAddedEventFilter;
        "MintPermissionRemoved(address,tuple)"(factory?: PromiseOrValue<string> | null, deleted_range?: null): MintPermissionRemovedEventFilter;
        MintPermissionRemoved(factory?: PromiseOrValue<string> | null, deleted_range?: null): MintPermissionRemovedEventFilter;
    };
    estimateGas: {
        activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        batchBurn(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        burn(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getCurrentIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        lockRangeMintPermissions(_range: ISkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        batchBurn(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        burn(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getCurrentIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lockRangeMintPermissions(_range: ISkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
