/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ISkyweaverAssetsInterface extends ethers.utils.Interface {
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
    "lockRangeMintPermissions(tuple)": FunctionFragment;
    "mint(address,uint256,uint256,bytes)": FunctionFragment;
    "removeMintPermission(address,uint256)": FunctionFragment;
    "setMaxIssuances(uint256[],uint256[])": FunctionFragment;
    "shutdownFactory(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "activateFactory",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "addMintPermission",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "batchBurn",
    values: [BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchMint",
    values: [string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentIssuances",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getFactoryAccessRanges",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getFactoryStatus",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getMaxIssuances",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "lockRangeMintPermissions",
    values: [{ minID: BigNumberish; maxID: BigNumberish }]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeMintPermission",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxIssuances",
    values: [BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "shutdownFactory",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "activateFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addMintPermission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "batchBurn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentIssuances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFactoryAccessRanges",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFactoryStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMaxIssuances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockRangeMintPermissions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeMintPermission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxIssuances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "shutdownFactory",
    data: BytesLike
  ): Result;

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

export class ISkyweaverAssets extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ISkyweaverAssetsInterface;

  functions: {
    activateFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "activateFactory(address)"(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addMintPermission(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "addMintPermission(address,uint64,uint64,uint64,uint64)"(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    batchBurn(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "batchBurn(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    burn(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "burn(uint256,uint256)"(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCurrentIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    "getCurrentIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getFactoryAccessRanges(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<
      [([BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber })[]]
    >;

    "getFactoryAccessRanges(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<
      [([BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber })[]]
    >;

    getFactoryStatus(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "getFactoryStatus(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getMaxIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    "getMaxIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    lockRangeMintPermissions(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "lockRangeMintPermissions((uint256,uint256))"(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mint(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "mint(address,uint256,uint256,bytes)"(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeMintPermission(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "removeMintPermission(address,uint256)"(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxIssuances(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setMaxIssuances(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    shutdownFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "shutdownFactory(address)"(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  activateFactory(
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "activateFactory(address)"(
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addMintPermission(
    _factory: string,
    _minRange: BigNumberish,
    _maxRange: BigNumberish,
    _startTime: BigNumberish,
    _endTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "addMintPermission(address,uint64,uint64,uint64,uint64)"(
    _factory: string,
    _minRange: BigNumberish,
    _maxRange: BigNumberish,
    _startTime: BigNumberish,
    _endTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  batchBurn(
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "batchBurn(uint256[],uint256[])"(
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  batchMint(
    _to: string,
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "batchMint(address,uint256[],uint256[],bytes)"(
    _to: string,
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  burn(
    _id: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "burn(uint256,uint256)"(
    _id: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCurrentIssuances(
    _ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  "getCurrentIssuances(uint256[])"(
    _ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getFactoryAccessRanges(
    _factory: string,
    overrides?: CallOverrides
  ): Promise<
    ([BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber })[]
  >;

  "getFactoryAccessRanges(address)"(
    _factory: string,
    overrides?: CallOverrides
  ): Promise<
    ([BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber })[]
  >;

  getFactoryStatus(
    _factory: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "getFactoryStatus(address)"(
    _factory: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getMaxIssuances(
    _ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  "getMaxIssuances(uint256[])"(
    _ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  lockRangeMintPermissions(
    _range: { minID: BigNumberish; maxID: BigNumberish },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "lockRangeMintPermissions((uint256,uint256))"(
    _range: { minID: BigNumberish; maxID: BigNumberish },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mint(
    _to: string,
    _id: BigNumberish,
    _amount: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "mint(address,uint256,uint256,bytes)"(
    _to: string,
    _id: BigNumberish,
    _amount: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeMintPermission(
    _factory: string,
    _rangeIndex: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "removeMintPermission(address,uint256)"(
    _factory: string,
    _rangeIndex: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxIssuances(
    _ids: BigNumberish[],
    _newMaxIssuances: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setMaxIssuances(uint256[],uint256[])"(
    _ids: BigNumberish[],
    _newMaxIssuances: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  shutdownFactory(
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "shutdownFactory(address)"(
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    activateFactory(_factory: string, overrides?: CallOverrides): Promise<void>;

    "activateFactory(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<void>;

    addMintPermission(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "addMintPermission(address,uint64,uint64,uint64,uint64)"(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    batchBurn(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    "batchBurn(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    burn(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "burn(uint256,uint256)"(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getCurrentIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    "getCurrentIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getFactoryAccessRanges(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<
      ([BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber })[]
    >;

    "getFactoryAccessRanges(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<
      ([BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber })[]
    >;

    getFactoryStatus(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "getFactoryStatus(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getMaxIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    "getMaxIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    lockRangeMintPermissions(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: CallOverrides
    ): Promise<void>;

    "lockRangeMintPermissions((uint256,uint256))"(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: CallOverrides
    ): Promise<void>;

    mint(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "mint(address,uint256,uint256,bytes)"(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    removeMintPermission(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "removeMintPermission(address,uint256)"(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxIssuances(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    "setMaxIssuances(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    shutdownFactory(_factory: string, overrides?: CallOverrides): Promise<void>;

    "shutdownFactory(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    FactoryActivation(
      factory: string | null
    ): TypedEventFilter<[string], { factory: string }>;

    FactoryShutdown(
      factory: string | null
    ): TypedEventFilter<[string], { factory: string }>;

    MintPermissionAdded(
      factory: string | null,
      new_range: null
    ): TypedEventFilter<
      [string, [BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber }],
      {
        factory: string;
        new_range: [BigNumber, BigNumber] & {
          minID: BigNumber;
          maxID: BigNumber;
        };
      }
    >;

    MintPermissionRemoved(
      factory: string | null,
      deleted_range: null
    ): TypedEventFilter<
      [string, [BigNumber, BigNumber] & { minID: BigNumber; maxID: BigNumber }],
      {
        factory: string;
        deleted_range: [BigNumber, BigNumber] & {
          minID: BigNumber;
          maxID: BigNumber;
        };
      }
    >;
  };

  estimateGas: {
    activateFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "activateFactory(address)"(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addMintPermission(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "addMintPermission(address,uint64,uint64,uint64,uint64)"(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    batchBurn(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "batchBurn(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    burn(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "burn(uint256,uint256)"(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCurrentIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCurrentIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFactoryAccessRanges(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getFactoryAccessRanges(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFactoryStatus(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getFactoryStatus(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMaxIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMaxIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lockRangeMintPermissions(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "lockRangeMintPermissions((uint256,uint256))"(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mint(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "mint(address,uint256,uint256,bytes)"(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeMintPermission(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "removeMintPermission(address,uint256)"(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxIssuances(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setMaxIssuances(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    shutdownFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "shutdownFactory(address)"(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    activateFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "activateFactory(address)"(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addMintPermission(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "addMintPermission(address,uint64,uint64,uint64,uint64)"(
      _factory: string,
      _minRange: BigNumberish,
      _maxRange: BigNumberish,
      _startTime: BigNumberish,
      _endTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    batchBurn(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "batchBurn(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    burn(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "burn(uint256,uint256)"(
      _id: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCurrentIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCurrentIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFactoryAccessRanges(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getFactoryAccessRanges(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFactoryStatus(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getFactoryStatus(address)"(
      _factory: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMaxIssuances(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getMaxIssuances(uint256[])"(
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockRangeMintPermissions(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "lockRangeMintPermissions((uint256,uint256))"(
      _range: { minID: BigNumberish; maxID: BigNumberish },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mint(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "mint(address,uint256,uint256,bytes)"(
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeMintPermission(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "removeMintPermission(address,uint256)"(
      _factory: string,
      _rangeIndex: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxIssuances(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setMaxIssuances(uint256[],uint256[])"(
      _ids: BigNumberish[],
      _newMaxIssuances: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    shutdownFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "shutdownFactory(address)"(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
