/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface IRewardFactoryInterface extends Interface {
  functions: {
    batchMint: TypedFunctionDescription<{
      encode([_to, _ids, _amounts, _data]: [
        string,
        BigNumberish[],
        BigNumberish[],
        Arrayish
      ]): string;
    }>;

    getAvailableSupply: TypedFunctionDescription<{ encode([]: []): string }>;

    livePeriod: TypedFunctionDescription<{ encode([]: []): string }>;

    supportsInterface: TypedFunctionDescription<{
      encode([interfaceID]: [Arrayish]): string;
    }>;

    updatePeriodMintLimit: TypedFunctionDescription<{
      encode([_newPeriodMintLimit]: [BigNumberish]): string;
    }>;
  };

  events: {
    PeriodMintLimitChanged: TypedEventDescription<{
      encodeTopics([oldMintingLimit, newMintingLimit]: [null, null]): string[];
    }>;
  };
}

export class IRewardFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): IRewardFactory;
  attach(addressOrName: string): IRewardFactory;
  deployed(): Promise<IRewardFactory>;

  on(event: EventFilter | string, listener: Listener): IRewardFactory;
  once(event: EventFilter | string, listener: Listener): IRewardFactory;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): IRewardFactory;
  removeAllListeners(eventName: EventFilter | string): IRewardFactory;
  removeListener(eventName: any, listener: Listener): IRewardFactory;

  interface: IRewardFactoryInterface;

  functions: {
    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getAvailableSupply(): Promise<BigNumber>;

    livePeriod(): Promise<BigNumber>;

    supportsInterface(interfaceID: Arrayish): Promise<boolean>;

    updatePeriodMintLimit(
      _newPeriodMintLimit: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  batchMint(
    _to: string,
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    _data: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getAvailableSupply(): Promise<BigNumber>;

  livePeriod(): Promise<BigNumber>;

  supportsInterface(interfaceID: Arrayish): Promise<boolean>;

  updatePeriodMintLimit(
    _newPeriodMintLimit: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    PeriodMintLimitChanged(
      oldMintingLimit: null,
      newMintingLimit: null
    ): EventFilter;
  };

  estimate: {
    batchMint(
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: Arrayish
    ): Promise<BigNumber>;

    getAvailableSupply(): Promise<BigNumber>;

    livePeriod(): Promise<BigNumber>;

    supportsInterface(interfaceID: Arrayish): Promise<BigNumber>;

    updatePeriodMintLimit(
      _newPeriodMintLimit: BigNumberish
    ): Promise<BigNumber>;
  };
}