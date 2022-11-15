import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export declare namespace DelayedOwner {
    type TransactionStruct = {
        status: PromiseOrValue<BigNumberish>;
        triggerTime: PromiseOrValue<BigNumberish>;
        target: PromiseOrValue<string>;
        id: PromiseOrValue<BigNumberish>;
        data: PromiseOrValue<BytesLike>;
    };
    type TransactionStructOutput = [
        number,
        BigNumber,
        string,
        BigNumber,
        string
    ] & {
        status: number;
        triggerTime: BigNumber;
        target: string;
        id: BigNumber;
        data: string;
    };
}
export interface DelayedOwnerInterface extends utils.Interface {
    functions: {
        "cancel((uint8,uint256,address,uint256,bytes))": FunctionFragment;
        "execute((uint8,uint256,address,uint256,bytes))": FunctionFragment;
        "getOwner()": FunctionFragment;
        "isValidWitness((uint8,uint256,address,uint256,bytes))": FunctionFragment;
        "register((uint8,uint256,address,uint256,bytes))": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "txHashes(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "cancel" | "execute" | "getOwner" | "isValidWitness" | "register" | "transferOwnership" | "txHashes"): FunctionFragment;
    encodeFunctionData(functionFragment: "cancel", values: [DelayedOwner.TransactionStruct]): string;
    encodeFunctionData(functionFragment: "execute", values: [DelayedOwner.TransactionStruct]): string;
    encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "isValidWitness", values: [DelayedOwner.TransactionStruct]): string;
    encodeFunctionData(functionFragment: "register", values: [DelayedOwner.TransactionStruct]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "txHashes", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isValidWitness", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "txHashes", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
        "TransactionCancelled(tuple)": EventFragment;
        "TransactionExecuted(tuple)": EventFragment;
        "TransactionRegistered(tuple)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransactionCancelled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransactionExecuted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransactionRegistered"): EventFragment;
}
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export declare type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface TransactionCancelledEventObject {
    transaction: DelayedOwner.TransactionStructOutput;
}
export declare type TransactionCancelledEvent = TypedEvent<[
    DelayedOwner.TransactionStructOutput
], TransactionCancelledEventObject>;
export declare type TransactionCancelledEventFilter = TypedEventFilter<TransactionCancelledEvent>;
export interface TransactionExecutedEventObject {
    transaction: DelayedOwner.TransactionStructOutput;
}
export declare type TransactionExecutedEvent = TypedEvent<[
    DelayedOwner.TransactionStructOutput
], TransactionExecutedEventObject>;
export declare type TransactionExecutedEventFilter = TypedEventFilter<TransactionExecutedEvent>;
export interface TransactionRegisteredEventObject {
    transaction: DelayedOwner.TransactionStructOutput;
}
export declare type TransactionRegisteredEvent = TypedEvent<[
    DelayedOwner.TransactionStructOutput
], TransactionRegisteredEventObject>;
export declare type TransactionRegisteredEventFilter = TypedEventFilter<TransactionRegisteredEvent>;
export interface DelayedOwner extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DelayedOwnerInterface;
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
        cancel(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        execute(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getOwner(overrides?: CallOverrides): Promise<[string]>;
        isValidWitness(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<[boolean] & {
            isValid: boolean;
        }>;
        register(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        txHashes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    cancel(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    execute(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getOwner(overrides?: CallOverrides): Promise<string>;
    isValidWitness(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<boolean>;
    register(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    txHashes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        cancel(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<void>;
        execute(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<void>;
        getOwner(overrides?: CallOverrides): Promise<string>;
        isValidWitness(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<boolean>;
        register(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<void>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        txHashes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "TransactionCancelled(tuple)"(transaction?: null): TransactionCancelledEventFilter;
        TransactionCancelled(transaction?: null): TransactionCancelledEventFilter;
        "TransactionExecuted(tuple)"(transaction?: null): TransactionExecutedEventFilter;
        TransactionExecuted(transaction?: null): TransactionExecutedEventFilter;
        "TransactionRegistered(tuple)"(transaction?: null): TransactionRegisteredEventFilter;
        TransactionRegistered(transaction?: null): TransactionRegisteredEventFilter;
    };
    estimateGas: {
        cancel(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        execute(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getOwner(overrides?: CallOverrides): Promise<BigNumber>;
        isValidWitness(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<BigNumber>;
        register(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        txHashes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        cancel(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        execute(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isValidWitness(_tx: DelayedOwner.TransactionStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        register(_tx: DelayedOwner.TransactionStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(_newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        txHashes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
