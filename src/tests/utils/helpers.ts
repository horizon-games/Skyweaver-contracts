import * as ethers from 'ethers'
import { BigNumber } from 'ethers/utils';
import { GoldCardsFactory } from 'typings/contracts/GoldCardsFactory';

export const UNIT_ETH = ethers.utils.parseEther('1')
export const HIGH_GAS_LIMIT = { gasLimit: 6e9 }
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export type AssetRange = {
  minID: BigNumber;
  maxID: BigNumber;
}

export const BuyCardsType = `tuple(
  address recipient,
  uint256[] tokensBoughtIDs,
  uint256[] tokensBoughtAmounts
)`

export const BuyHeroesType = `tuple(
  address recipient,
  uint256[] tokensBoughtIDs,
  uint256[] tokensBoughtAmounts,
  uint256[] expectedTiers
)`

export const BuyGoldCardype = `tuple(
  address cardRecipient,
  address feeRecipient,
  uint256 cardAmount,
  uint256 feeAmount,
  uint256 rngBlock
)`

export type BuyCardsObj = {
  recipient: string;
  tokensBoughtIDs: number[] | string[] | BigNumber[];
  tokensBoughtAmounts: number[] | string[] | BigNumber[];
}

export type BuyHeroesObj = {
  recipient: string;
  tokensBoughtIDs: number[] | string[] | BigNumber[];
  tokensBoughtAmounts: number[] | string[] | BigNumber[];
  expectedTiers: number[] | string[] | BigNumber[];
}

export type GoldOrder = {
  cardRecipient: string;
  feeRecipient: string;
  cardAmount: BigNumber;
  feeAmount: BigNumber;
  rngBlock: BigNumber;
}

export const getBuyCardsData = (
  recipient: string,
  ids: ethers.utils.BigNumber[] | number[], 
  tokensAmountsToBuy: ethers.utils.BigNumber[] | number[] 
) => {
  const buyCardsObj = {
    recipient: recipient,
    tokensBoughtIDs: ids,
    tokensBoughtAmounts: tokensAmountsToBuy
  } as BuyCardsObj
  return ethers.utils.defaultAbiCoder.encode([BuyCardsType], [buyCardsObj])
}

export const getBuyHeroesData = (
  recipient: string,
  ids: ethers.utils.BigNumber[] | number[], 
  tokensAmountsToBuy: ethers.utils.BigNumber[] | number[],
  expectedTiers: ethers.utils.BigNumber[] | number[] 
) => {
  const buyHeroesObj = {
    recipient: recipient,
    tokensBoughtIDs: ids,
    tokensBoughtAmounts: tokensAmountsToBuy,
    expectedTiers: expectedTiers
  } as BuyHeroesObj
  return ethers.utils.defaultAbiCoder.encode([BuyHeroesType], [buyHeroesObj])
}

// Gold Cards Factory

export const getBuyGoldCardsData = (obj: GoldOrder) => {
  return ethers.utils.defaultAbiCoder.encode([BuyGoldCardype], [obj])
}

export const getGoldCommitHash = (
  cardRecipient: string,
  blockNumber: BigNumber
) => {
  let encoded_data = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256'], 
    [cardRecipient, blockNumber]
  )
  return ethers.utils.keccak256(encoded_data);
}

export const getGoldMintObjHash = (obj: GoldOrder) => {
  let encoded_data = getBuyGoldCardsData(obj)
  return ethers.utils.keccak256(encoded_data);
}

// Will return sorted ids array (no duplicates) with index order array
 export async function getRandomGoldCards(factory: GoldCardsFactory, rngSeed: string, amount: number | BigNumber) {
  // Unsorted gold cards, with duplicate ids
  let gold_cards = await factory.functions.getRandomCards(rngSeed, amount)
  let gold_cards_num = gold_cards.map(bn => bn.toNumber())

  // Sorted gold cards, with duplicate ids (if any)
  let sorted_cards = gold_cards_num.slice(0).sort((n1 ,n2) => n1 - n2); 

  // Sorted cards, no duplicates
  let ids_mint_array = [...new Set(sorted_cards)]

  // Order in which ids are discovered, referencing to sorted 
  let sorted_indexes = gold_cards_num.map(val => ids_mint_array.indexOf(val))
  
  return {ids_mint_array, sorted_indexes}
}

// createTestWallet creates a new wallet
export const createTestWallet = (web3: any, addressIndex: number = 0) => {
  const provider = new Web3DebugProvider(web3.currentProvider)

  const wallet = ethers.Wallet
    .fromMnemonic(process.env.npm_package_config_mnemonic!, `m/44'/60'/0'/0/${addressIndex}`)
    .connect(provider)

  const signer = provider.getSigner(addressIndex)

  return { wallet, provider, signer }
}

// Check if tx was Reverted with specified message
export function RevertError(errorMessage?: string) {
  let prefix = 'VM Exception while processing transaction: revert'
  return errorMessage ? RegExp(`^${prefix + ' ' + errorMessage}$`) : RegExp(`^${prefix}$`)
}

export interface JSONRPCRequest {
  jsonrpc: string
  id: number
  method: any
  params: any
}

export class Web3DebugProvider extends ethers.providers.JsonRpcProvider {

  public reqCounter = 0
  public reqLog: JSONRPCRequest[] = []

  readonly _web3Provider: ethers.providers.AsyncSendable
  private _sendAsync: (request: any, callback: (error: any, response: any) => void) => void

  constructor(web3Provider: ethers.providers.AsyncSendable, network?: ethers.utils.Networkish) {
      // HTTP has a host; IPC has a path.
      super(web3Provider.host || web3Provider.path || '', network)

      if (web3Provider) {
        if (web3Provider.sendAsync) {
          this._sendAsync = web3Provider.sendAsync.bind(web3Provider)
        } else if (web3Provider.send) {
          this._sendAsync = web3Provider.send.bind(web3Provider)
        }
      }

      if (!web3Provider || !this._sendAsync) {
        ethers.errors.throwError(
          'invalid web3Provider',
          ethers.errors.INVALID_ARGUMENT,
          { arg: 'web3Provider', value: web3Provider }
        )
      }

      ethers.utils.defineReadOnly(this, '_web3Provider', web3Provider)
  }

  send(method: string, params: any): Promise<any> {

    this.reqCounter++

    return new Promise((resolve, reject) => {
      let request = {
        method: method,
        params: params,
        id: this.reqCounter,
        jsonrpc: '2.0'
      } as JSONRPCRequest
      this.reqLog.push(request)

      this._sendAsync(request, function(error, result) {
        if (error) {
          reject(error)
          return
        }

        if (result.error) {
          // @TODO: not any
          let error: any = new Error(result.error.message)
          error.code = result.error.code
          error.data = result.error.data
          reject(error)
          return
        }

        resolve(result.result)
      })
    })
  }

  getPastRequest(reverseIndex: number = 0): JSONRPCRequest {
    if (this.reqLog.length === 0) {
      return { jsonrpc: '2.0', id: 0, method: null, params: null }
    }
    return this.reqLog[this.reqLog.length-reverseIndex-1]
  }

}
