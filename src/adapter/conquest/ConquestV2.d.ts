import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface ConquestV2Interface extends utils.Interface {
    functions: {
        "assignOwnership(address,uint256)": FunctionFragment;
        "conquestEntryID()": FunctionFragment;
        "conquestsEntered(address)": FunctionFragment;
        "exitConquest(address,uint256,uint256[],uint256[])": FunctionFragment;
        "getOwnerTier(address)": FunctionFragment;
        "goldCardFactory()": FunctionFragment;
        "isActiveConquest(address)": FunctionFragment;
        "oldConquest()": FunctionFragment;
        "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)": FunctionFragment;
        "onERC1155Received(address,address,uint256,uint256,bytes)": FunctionFragment;
        "silverCardFactory()": FunctionFragment;
        "skyweaverAssets()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "assignOwnership" | "conquestEntryID" | "conquestsEntered" | "exitConquest" | "getOwnerTier" | "goldCardFactory" | "isActiveConquest" | "oldConquest" | "onERC1155BatchReceived" | "onERC1155Received" | "silverCardFactory" | "skyweaverAssets" | "supportsInterface"): FunctionFragment;
    encodeFunctionData(functionFragment: "assignOwnership", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "conquestEntryID", values?: undefined): string;
    encodeFunctionData(functionFragment: "conquestsEntered", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "exitConquest", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[]
    ]): string;
    encodeFunctionData(functionFragment: "getOwnerTier", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "goldCardFactory", values?: undefined): string;
    encodeFunctionData(functionFragment: "isActiveConquest", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "oldConquest", values?: undefined): string;
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
    encodeFunctionData(functionFragment: "silverCardFactory", values?: undefined): string;
    encodeFunctionData(functionFragment: "skyweaverAssets", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "assignOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "conquestEntryID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "conquestsEntered", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exitConquest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwnerTier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "goldCardFactory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isActiveConquest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oldConquest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155BatchReceived", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "silverCardFactory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "skyweaverAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    events: {
        "ConquestEntered(address,uint256)": EventFragment;
        "OwnershipGranted(address,uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "ConquestEntered"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipGranted"): EventFragment;
}
export interface ConquestEnteredEventObject {
    user: string;
    nConquests: BigNumber;
}
export declare type ConquestEnteredEvent = TypedEvent<[
    string,
    BigNumber
], ConquestEnteredEventObject>;
export declare type ConquestEnteredEventFilter = TypedEventFilter<ConquestEnteredEvent>;
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
export interface ConquestV2 extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ConquestV2Interface;
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
        conquestEntryID(overrides?: CallOverrides): Promise<[BigNumber]>;
        conquestsEntered(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        exitConquest(_user: PromiseOrValue<string>, _conquestNonce: PromiseOrValue<BigNumberish>, _silverIds: PromiseOrValue<BigNumberish>[], _goldIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        goldCardFactory(overrides?: CallOverrides): Promise<[string]>;
        isActiveConquest(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        oldConquest(overrides?: CallOverrides): Promise<[string]>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], arg4: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        silverCardFactory(overrides?: CallOverrides): Promise<[string]>;
        skyweaverAssets(overrides?: CallOverrides): Promise<[string]>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    conquestEntryID(overrides?: CallOverrides): Promise<BigNumber>;
    conquestsEntered(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    exitConquest(_user: PromiseOrValue<string>, _conquestNonce: PromiseOrValue<BigNumberish>, _silverIds: PromiseOrValue<BigNumberish>[], _goldIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    goldCardFactory(overrides?: CallOverrides): Promise<string>;
    isActiveConquest(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    oldConquest(overrides?: CallOverrides): Promise<string>;
    onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], arg4: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    silverCardFactory(overrides?: CallOverrides): Promise<string>;
    skyweaverAssets(overrides?: CallOverrides): Promise<string>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        conquestEntryID(overrides?: CallOverrides): Promise<BigNumber>;
        conquestsEntered(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        exitConquest(_user: PromiseOrValue<string>, _conquestNonce: PromiseOrValue<BigNumberish>, _silverIds: PromiseOrValue<BigNumberish>[], _goldIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        goldCardFactory(overrides?: CallOverrides): Promise<string>;
        isActiveConquest(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        oldConquest(overrides?: CallOverrides): Promise<string>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], arg4: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        silverCardFactory(overrides?: CallOverrides): Promise<string>;
        skyweaverAssets(overrides?: CallOverrides): Promise<string>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "ConquestEntered(address,uint256)"(user?: null, nConquests?: null): ConquestEnteredEventFilter;
        ConquestEntered(user?: null, nConquests?: null): ConquestEnteredEventFilter;
        "OwnershipGranted(address,uint256,uint256)"(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
        OwnershipGranted(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
    };
    estimateGas: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        conquestEntryID(overrides?: CallOverrides): Promise<BigNumber>;
        conquestsEntered(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        exitConquest(_user: PromiseOrValue<string>, _conquestNonce: PromiseOrValue<BigNumberish>, _silverIds: PromiseOrValue<BigNumberish>[], _goldIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        goldCardFactory(overrides?: CallOverrides): Promise<BigNumber>;
        isActiveConquest(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        oldConquest(overrides?: CallOverrides): Promise<BigNumber>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], arg4: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        silverCardFactory(overrides?: CallOverrides): Promise<BigNumber>;
        skyweaverAssets(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        conquestEntryID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        conquestsEntered(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        exitConquest(_user: PromiseOrValue<string>, _conquestNonce: PromiseOrValue<BigNumberish>, _silverIds: PromiseOrValue<BigNumberish>[], _goldIds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        goldCardFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isActiveConquest(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oldConquest(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        onERC1155BatchReceived(arg0: PromiseOrValue<string>, _from: PromiseOrValue<string>, _ids: PromiseOrValue<BigNumberish>[], _amounts: PromiseOrValue<BigNumberish>[], arg4: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        onERC1155Received(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _id: PromiseOrValue<BigNumberish>, _amount: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        silverCardFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        skyweaverAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
