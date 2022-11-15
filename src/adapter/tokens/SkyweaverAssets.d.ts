import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export declare namespace SkyweaverAssets {
    type AssetRangeStruct = {
        minID: PromiseOrValue<BigNumberish>;
        maxID: PromiseOrValue<BigNumberish>;
        startTime: PromiseOrValue<BigNumberish>;
        endTime: PromiseOrValue<BigNumberish>;
    };
    type AssetRangeStructOutput = [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        minID: BigNumber;
        maxID: BigNumber;
        startTime: BigNumber;
        endTime: BigNumber;
    };
}
export interface SkyweaverAssetsInterface extends utils.Interface {
    functions: {
        "activateFactory(address)": FunctionFragment;
        "addMintPermission(address,uint64,uint64,uint64,uint64)": FunctionFragment;
        "balanceOf(address,uint256)": FunctionFragment;
        "balanceOfBatch(address[],uint256[])": FunctionFragment;
        "baseURI()": FunctionFragment;
        "batchBurn(uint256[],uint256[])": FunctionFragment;
        "batchMint(address,uint256[],uint256[],bytes)": FunctionFragment;
        "burn(uint256,uint256)": FunctionFragment;
        "getCurrentIssuances(uint256[])": FunctionFragment;
        "getFactoryAccessRanges(address)": FunctionFragment;
        "getFactoryStatus(address)": FunctionFragment;
        "getIDBinIndex(uint256)": FunctionFragment;
        "getLockedRanges()": FunctionFragment;
        "getMaxIssuances(uint256[])": FunctionFragment;
        "getOwner()": FunctionFragment;
        "getValueInBin(uint256,uint256)": FunctionFragment;
        "globalRoyaltyInfo()": FunctionFragment;
        "isApprovedForAll(address,address)": FunctionFragment;
        "lockRangeMintPermissions((uint64,uint64,uint64,uint64))": FunctionFragment;
        "logURIs(uint256[])": FunctionFragment;
        "mint(address,uint256,uint256,bytes)": FunctionFragment;
        "name()": FunctionFragment;
        "removeMintPermission(address,uint256)": FunctionFragment;
        "royaltyInfo(uint256,uint256)": FunctionFragment;
        "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": FunctionFragment;
        "safeTransferFrom(address,address,uint256,uint256,bytes)": FunctionFragment;
        "setApprovalForAll(address,bool)": FunctionFragment;
        "setBaseMetadataURI(string)": FunctionFragment;
        "setGlobalRoyaltyInfo(address,uint256)": FunctionFragment;
        "setMaxIssuances(uint256[],uint256[])": FunctionFragment;
        "shutdownFactory(address)": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "uri(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "activateFactory" | "addMintPermission" | "balanceOf" | "balanceOfBatch" | "baseURI" | "batchBurn" | "batchMint" | "burn" | "getCurrentIssuances" | "getFactoryAccessRanges" | "getFactoryStatus" | "getIDBinIndex" | "getLockedRanges" | "getMaxIssuances" | "getOwner" | "getValueInBin" | "globalRoyaltyInfo" | "isApprovedForAll" | "lockRangeMintPermissions" | "logURIs" | "mint" | "name" | "removeMintPermission" | "royaltyInfo" | "safeBatchTransferFrom" | "safeTransferFrom" | "setApprovalForAll" | "setBaseMetadataURI" | "setGlobalRoyaltyInfo" | "setMaxIssuances" | "shutdownFactory" | "supportsInterface" | "transferOwnership" | "uri"): FunctionFragment;
    encodeFunctionData(functionFragment: "activateFactory", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "addMintPermission", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "balanceOfBatch", values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "baseURI", values?: undefined): string;
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
    encodeFunctionData(functionFragment: "getIDBinIndex", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getLockedRanges", values?: undefined): string;
    encodeFunctionData(functionFragment: "getMaxIssuances", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "getValueInBin", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "globalRoyaltyInfo", values?: undefined): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "lockRangeMintPermissions", values: [SkyweaverAssets.AssetRangeStruct]): string;
    encodeFunctionData(functionFragment: "logURIs", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "mint", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeMintPermission", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "royaltyInfo", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "safeBatchTransferFrom", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setApprovalForAll", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setBaseMetadataURI", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setGlobalRoyaltyInfo", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setMaxIssuances", values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "shutdownFactory", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "uri", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "activateFactory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addMintPermission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOfBatch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "baseURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "batchBurn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentIssuances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFactoryAccessRanges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFactoryStatus", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getIDBinIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLockedRanges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMaxIssuances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getValueInBin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "globalRoyaltyInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockRangeMintPermissions", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "logURIs", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeMintPermission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeBatchTransferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBaseMetadataURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setGlobalRoyaltyInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaxIssuances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "shutdownFactory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uri", data: BytesLike): Result;
    events: {
        "ApprovalForAll(address,address,bool)": EventFragment;
        "FactoryActivation(address)": EventFragment;
        "FactoryShutdown(address)": EventFragment;
        "MaxIssuancesChanged(uint256[],uint256[])": EventFragment;
        "MintPermissionAdded(address,tuple)": EventFragment;
        "MintPermissionRemoved(address,tuple)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "RangeLocked(tuple)": EventFragment;
        "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
        "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
        "URI(string,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FactoryActivation"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FactoryShutdown"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MaxIssuancesChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MintPermissionAdded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MintPermissionRemoved"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RangeLocked"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}
export interface ApprovalForAllEventObject {
    _owner: string;
    _operator: string;
    _approved: boolean;
}
export declare type ApprovalForAllEvent = TypedEvent<[
    string,
    string,
    boolean
], ApprovalForAllEventObject>;
export declare type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
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
export interface MaxIssuancesChangedEventObject {
    ids: BigNumber[];
    newMaxIssuances: BigNumber[];
}
export declare type MaxIssuancesChangedEvent = TypedEvent<[
    BigNumber[],
    BigNumber[]
], MaxIssuancesChangedEventObject>;
export declare type MaxIssuancesChangedEventFilter = TypedEventFilter<MaxIssuancesChangedEvent>;
export interface MintPermissionAddedEventObject {
    factory: string;
    new_range: SkyweaverAssets.AssetRangeStructOutput;
}
export declare type MintPermissionAddedEvent = TypedEvent<[
    string,
    SkyweaverAssets.AssetRangeStructOutput
], MintPermissionAddedEventObject>;
export declare type MintPermissionAddedEventFilter = TypedEventFilter<MintPermissionAddedEvent>;
export interface MintPermissionRemovedEventObject {
    factory: string;
    deleted_range: SkyweaverAssets.AssetRangeStructOutput;
}
export declare type MintPermissionRemovedEvent = TypedEvent<[
    string,
    SkyweaverAssets.AssetRangeStructOutput
], MintPermissionRemovedEventObject>;
export declare type MintPermissionRemovedEventFilter = TypedEventFilter<MintPermissionRemovedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export declare type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface RangeLockedEventObject {
    locked_range: SkyweaverAssets.AssetRangeStructOutput;
}
export declare type RangeLockedEvent = TypedEvent<[
    SkyweaverAssets.AssetRangeStructOutput
], RangeLockedEventObject>;
export declare type RangeLockedEventFilter = TypedEventFilter<RangeLockedEvent>;
export interface TransferBatchEventObject {
    _operator: string;
    _from: string;
    _to: string;
    _ids: BigNumber[];
    _amounts: BigNumber[];
}
export declare type TransferBatchEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber[],
    BigNumber[]
], TransferBatchEventObject>;
export declare type TransferBatchEventFilter = TypedEventFilter<TransferBatchEvent>;
export interface TransferSingleEventObject {
    _operator: string;
    _from: string;
    _to: string;
    _id: BigNumber;
    _amount: BigNumber;
}
export declare type TransferSingleEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber
], TransferSingleEventObject>;
export declare type TransferSingleEventFilter = TypedEventFilter<TransferSingleEvent>;
export interface URIEventObject {
    _uri: string;
    _id: BigNumber;
}
export declare type URIEvent = TypedEvent<[string, BigNumber], URIEventObject>;
export declare type URIEventFilter = TypedEventFilter<URIEvent>;
export interface SkyweaverAssets extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SkyweaverAssetsInterface;
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
        balanceOf(_owner: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        balanceOfBatch(_owners: PromiseOrValue<string>[], _ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[]]>;
        baseURI(overrides?: CallOverrides): Promise<[string]>;
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
        getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[SkyweaverAssets.AssetRangeStructOutput[]]>;
        getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        getIDBinIndex(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
            bin: BigNumber;
            index: BigNumber;
        }>;
        getLockedRanges(overrides?: CallOverrides): Promise<[SkyweaverAssets.AssetRangeStructOutput[]]>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[]]>;
        getOwner(overrides?: CallOverrides): Promise<[string]>;
        getValueInBin(_binValues: PromiseOrValue<BigNumberish>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        globalRoyaltyInfo(overrides?: CallOverrides): Promise<[
            string,
            BigNumber
        ] & {
            receiver: string;
            feeBasisPoints: BigNumber;
        }>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean] & {
            isOperator: boolean;
        }>;
        lockRangeMintPermissions(_range: SkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        logURIs(_tokenIDs: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        name(overrides?: CallOverrides): Promise<[string]>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        royaltyInfo(arg0: PromiseOrValue<BigNumberish>, _saleCost: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber
        ] & {
            receiver: string;
            royaltyAmount: BigNumber;
        }>;
        safeBatchTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        safeTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setBaseMetadataURI(_newBaseMetadataURI: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setGlobalRoyaltyInfo(_receiver: PromiseOrValue<string>, _royaltyBasisPoints: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        supportsInterface(_interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        uri(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    balanceOf(_owner: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    balanceOfBatch(_owners: PromiseOrValue<string>[], _ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
    baseURI(overrides?: CallOverrides): Promise<string>;
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
    getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<SkyweaverAssets.AssetRangeStructOutput[]>;
    getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    getIDBinIndex(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
        bin: BigNumber;
        index: BigNumber;
    }>;
    getLockedRanges(overrides?: CallOverrides): Promise<SkyweaverAssets.AssetRangeStructOutput[]>;
    getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
    getOwner(overrides?: CallOverrides): Promise<string>;
    getValueInBin(_binValues: PromiseOrValue<BigNumberish>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    globalRoyaltyInfo(overrides?: CallOverrides): Promise<[
        string,
        BigNumber
    ] & {
        receiver: string;
        feeBasisPoints: BigNumber;
    }>;
    isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    lockRangeMintPermissions(_range: SkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    logURIs(_tokenIDs: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<string>;
    removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    royaltyInfo(arg0: PromiseOrValue<BigNumberish>, _saleCost: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        BigNumber
    ] & {
        receiver: string;
        royaltyAmount: BigNumber;
    }>;
    safeBatchTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    safeTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setBaseMetadataURI(_newBaseMetadataURI: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setGlobalRoyaltyInfo(_receiver: PromiseOrValue<string>, _royaltyBasisPoints: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(_interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    uri(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        activateFactory(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        balanceOf(_owner: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOfBatch(_owners: PromiseOrValue<string>[], _ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
        baseURI(overrides?: CallOverrides): Promise<string>;
        batchBurn(_ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        batchMint(_to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        burn(_id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getCurrentIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
        getFactoryAccessRanges(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<SkyweaverAssets.AssetRangeStructOutput[]>;
        getFactoryStatus(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        getIDBinIndex(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
            bin: BigNumber;
            index: BigNumber;
        }>;
        getLockedRanges(overrides?: CallOverrides): Promise<SkyweaverAssets.AssetRangeStructOutput[]>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
        getOwner(overrides?: CallOverrides): Promise<string>;
        getValueInBin(_binValues: PromiseOrValue<BigNumberish>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        globalRoyaltyInfo(overrides?: CallOverrides): Promise<[
            string,
            BigNumber
        ] & {
            receiver: string;
            feeBasisPoints: BigNumber;
        }>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        lockRangeMintPermissions(_range: SkyweaverAssets.AssetRangeStruct, overrides?: CallOverrides): Promise<void>;
        logURIs(_tokenIDs: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        name(overrides?: CallOverrides): Promise<string>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        royaltyInfo(arg0: PromiseOrValue<BigNumberish>, _saleCost: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber
        ] & {
            receiver: string;
            royaltyAmount: BigNumber;
        }>;
        safeBatchTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        safeTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setBaseMetadataURI(_newBaseMetadataURI: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setGlobalRoyaltyInfo(_receiver: PromiseOrValue<string>, _royaltyBasisPoints: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        supportsInterface(_interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        uri(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "ApprovalForAll(address,address,bool)"(_owner?: PromiseOrValue<string> | null, _operator?: PromiseOrValue<string> | null, _approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(_owner?: PromiseOrValue<string> | null, _operator?: PromiseOrValue<string> | null, _approved?: null): ApprovalForAllEventFilter;
        "FactoryActivation(address)"(factory?: PromiseOrValue<string> | null): FactoryActivationEventFilter;
        FactoryActivation(factory?: PromiseOrValue<string> | null): FactoryActivationEventFilter;
        "FactoryShutdown(address)"(factory?: PromiseOrValue<string> | null): FactoryShutdownEventFilter;
        FactoryShutdown(factory?: PromiseOrValue<string> | null): FactoryShutdownEventFilter;
        "MaxIssuancesChanged(uint256[],uint256[])"(ids?: null, newMaxIssuances?: null): MaxIssuancesChangedEventFilter;
        MaxIssuancesChanged(ids?: null, newMaxIssuances?: null): MaxIssuancesChangedEventFilter;
        "MintPermissionAdded(address,tuple)"(factory?: PromiseOrValue<string> | null, new_range?: null): MintPermissionAddedEventFilter;
        MintPermissionAdded(factory?: PromiseOrValue<string> | null, new_range?: null): MintPermissionAddedEventFilter;
        "MintPermissionRemoved(address,tuple)"(factory?: PromiseOrValue<string> | null, deleted_range?: null): MintPermissionRemovedEventFilter;
        MintPermissionRemoved(factory?: PromiseOrValue<string> | null, deleted_range?: null): MintPermissionRemovedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "RangeLocked(tuple)"(locked_range?: null): RangeLockedEventFilter;
        RangeLocked(locked_range?: null): RangeLockedEventFilter;
        "TransferBatch(address,address,address,uint256[],uint256[])"(_operator?: PromiseOrValue<string> | null, _from?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _ids?: null, _amounts?: null): TransferBatchEventFilter;
        TransferBatch(_operator?: PromiseOrValue<string> | null, _from?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _ids?: null, _amounts?: null): TransferBatchEventFilter;
        "TransferSingle(address,address,address,uint256,uint256)"(_operator?: PromiseOrValue<string> | null, _from?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _id?: null, _amount?: null): TransferSingleEventFilter;
        TransferSingle(_operator?: PromiseOrValue<string> | null, _from?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _id?: null, _amount?: null): TransferSingleEventFilter;
        "URI(string,uint256)"(_uri?: null, _id?: PromiseOrValue<BigNumberish> | null): URIEventFilter;
        URI(_uri?: null, _id?: PromiseOrValue<BigNumberish> | null): URIEventFilter;
    };
    estimateGas: {
        activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        balanceOf(_owner: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOfBatch(_owners: PromiseOrValue<string>[], _ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        baseURI(overrides?: CallOverrides): Promise<BigNumber>;
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
        getIDBinIndex(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getLockedRanges(overrides?: CallOverrides): Promise<BigNumber>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getOwner(overrides?: CallOverrides): Promise<BigNumber>;
        getValueInBin(_binValues: PromiseOrValue<BigNumberish>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        globalRoyaltyInfo(overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        lockRangeMintPermissions(_range: SkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        logURIs(_tokenIDs: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        royaltyInfo(arg0: PromiseOrValue<BigNumberish>, _saleCost: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        safeBatchTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        safeTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setBaseMetadataURI(_newBaseMetadataURI: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setGlobalRoyaltyInfo(_receiver: PromiseOrValue<string>, _royaltyBasisPoints: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        supportsInterface(_interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        uri(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        activateFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addMintPermission(_factory: PromiseOrValue<string>, _minRange: PromiseOrValue<BigNumberish>, _maxRange: PromiseOrValue<BigNumberish>, _startTime: PromiseOrValue<BigNumberish>, _endTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        balanceOf(_owner: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOfBatch(_owners: PromiseOrValue<string>[], _ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        baseURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;
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
        getIDBinIndex(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLockedRanges(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getValueInBin(_binValues: PromiseOrValue<BigNumberish>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        globalRoyaltyInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lockRangeMintPermissions(_range: SkyweaverAssets.AssetRangeStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        logURIs(_tokenIDs: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mint(_to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        removeMintPermission(_factory: PromiseOrValue<string>, _rangeIndex: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        royaltyInfo(arg0: PromiseOrValue<BigNumberish>, _saleCost: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        safeBatchTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        safeTransferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setBaseMetadataURI(_newBaseMetadataURI: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setGlobalRoyaltyInfo(_receiver: PromiseOrValue<string>, _royaltyBasisPoints: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMaxIssuances(_ids: PromiseOrValue<BigNumberish>[], _newMaxIssuances: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        shutdownFactory(_factory: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        supportsInterface(_interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        uri(_id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
