import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface TieredOwnableInterface extends utils.Interface {
    functions: {
        "assignOwnership(address,uint256)": FunctionFragment;
        "getOwnerTier(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "assignOwnership" | "getOwnerTier"): FunctionFragment;
    encodeFunctionData(functionFragment: "assignOwnership", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getOwnerTier", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "assignOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwnerTier", data: BytesLike): Result;
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
export interface TieredOwnable extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: TieredOwnableInterface;
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
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "OwnershipGranted(address,uint256,uint256)"(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
        OwnershipGranted(owner?: PromiseOrValue<string> | null, previousTier?: PromiseOrValue<BigNumberish> | null, newTier?: PromiseOrValue<BigNumberish> | null): OwnershipGrantedEventFilter;
    };
    estimateGas: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        assignOwnership(_address: PromiseOrValue<string>, _tier: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getOwnerTier(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}