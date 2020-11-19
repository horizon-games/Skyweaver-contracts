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
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface IRewardFactoryInterface extends ethers.utils.Interface {
  functions: {
    "batchMint(address,uint256[],uint256[],bytes)": FunctionFragment;
    "getAvailableSupply()": FunctionFragment;
    "livePeriod()": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "updatePeriodMintLimit(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "batchMint",
    values: [string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "livePeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePeriodMintLimit",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "livePeriod", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePeriodMintLimit",
    data: BytesLike
  ): Result;

  events: {
    "PeriodMintLimitChanged(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PeriodMintLimitChanged"): EventFragment;
}

export class IRewardFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IRewardFactoryInterface;

  functions: {
    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getAvailableSupply(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getAvailableSupply()"(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    livePeriod(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "livePeriod()"(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    "supportsInterface(bytes4)"(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    updatePeriodMintLimit(
      _newPeriodMintLimit: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "updatePeriodMintLimit(uint256)"(
      _newPeriodMintLimit: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  batchMint(
    _to: string,
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    _data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "batchMint(address,uint256[],uint256[],bytes)"(
    _to: string,
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    _data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;

  "getAvailableSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

  livePeriod(overrides?: CallOverrides): Promise<BigNumber>;

  "livePeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "supportsInterface(bytes4)"(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  updatePeriodMintLimit(
    _newPeriodMintLimit: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "updatePeriodMintLimit(uint256)"(
    _newPeriodMintLimit: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
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

    getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "getAvailableSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    livePeriod(overrides?: CallOverrides): Promise<BigNumber>;

    "livePeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "supportsInterface(bytes4)"(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updatePeriodMintLimit(
      _newPeriodMintLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "updatePeriodMintLimit(uint256)"(
      _newPeriodMintLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    PeriodMintLimitChanged(
      oldMintingLimit: null,
      newMintingLimit: null
    ): EventFilter;
  };

  estimateGas: {
    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getAvailableSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "getAvailableSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    livePeriod(overrides?: CallOverrides): Promise<BigNumber>;

    "livePeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "supportsInterface(bytes4)"(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    updatePeriodMintLimit(
      _newPeriodMintLimit: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "updatePeriodMintLimit(uint256)"(
      _newPeriodMintLimit: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "batchMint(address,uint256[],uint256[],bytes)"(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getAvailableSupply(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAvailableSupply()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    livePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "livePeriod()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "supportsInterface(bytes4)"(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updatePeriodMintLimit(
      _newPeriodMintLimit: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "updatePeriodMintLimit(uint256)"(
      _newPeriodMintLimit: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
