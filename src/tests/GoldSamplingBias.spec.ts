import * as ethers from 'ethers'
ethers.errors.setLogLevel("error")

import { 
  AbstractContract
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from 'typings/contracts/SkyweaverAssets'
import { SkyweaverCurrencies } from 'typings/contracts/SkyweaverCurrencies'
import { FactoryMock } from 'typings/contracts/FactoryMock'
import { GoldCardsFactory } from 'typings/contracts/GoldCardsFactory'
import { TxnAggregator } from 'typings/contracts/TxnAggregator'
import { BigNumber } from 'ethers/utils';

// init test wallets from package.json mnemonic
const web3 = (global as any).web3

const {
  wallet: ownerWallet,
  provider: ownerProvider,
  signer: ownerSigner
} = utils.createTestWallet(web3, 0)

const {
  wallet: userWallet,
  provider: userProvider,
  signer: userSigner
} = utils.createTestWallet(web3, 2)

const {
  wallet: operatorWallet,
  provider: operatorProvider,
  signer: operatorSigner
} = utils.createTestWallet(web3, 4)

const {
  wallet: randomWallet,
  provider: randomProvider,
  signer: randomSigner
} = utils.createTestWallet(web3, 5)

const getBig = (id: number) => new BigNumber(id);

contract('GoldCardsFactory', (accounts: string[]) => {
  let ownerAddress: string
  let userAddress: string
  let operatorAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let weaveAbstract: AbstractContract
  let factoryAbstract: AbstractContract
  let weaveFactoryAbstract:AbstractContract
  let txnAggregatorAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let weaveContract: SkyweaverCurrencies
  let weaveFactoryContract: FactoryMock
  let factoryContract: GoldCardsFactory

  // Arcadeum Coins
  let userWeaveContract: SkyweaverCurrencies

  // Factory manager
  let userFactoryContract: GoldCardsFactory

  // Utils
  let txnAggregatorContract: TxnAggregator

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const totalNTokensTypes = 91
  const n_samples = 50
  const sample_size = 2000

  // Base Token Param
  const weaveID = new BigNumber(1);
  const price = new BigNumber(500).mul(new BigNumber(10).pow(18))
  const refund = new BigNumber(250).mul(new BigNumber(10).pow(18))
  const delay = new BigNumber(15);

  // Arrays
  const ids = new Array(totalNTokensTypes).fill('').map((a, i) => getBig(i+1))

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    operatorAddress = await operatorWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    weaveAbstract = await AbstractContract.fromArtifactName('SkyweaverCurrencies')
    factoryAbstract = await AbstractContract.fromArtifactName('GoldCardsFactory')
    weaveFactoryAbstract = await AbstractContract.fromArtifactName('FactoryMock')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Weave contract and supply manager
    weaveContract = await weaveAbstract.deploy(ownerWallet) as SkyweaverCurrencies
    userWeaveContract = await weaveContract.connect(userSigner) as SkyweaverCurrencies

    weaveFactoryContract = await weaveFactoryAbstract.deploy(ownerWallet, [
      weaveContract.address,
    ]) as FactoryMock

    await weaveContract.functions.activateFactory(weaveFactoryContract.address);
    await weaveContract.functions.addMintPermission(weaveFactoryContract.address, weaveID, weaveID);

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      weaveContract.address,
      weaveID,
      price,
      refund,
      delay, 
      {gasLimit: 25000000}
    ]) as GoldCardsFactory
    userFactoryContract = await factoryContract.connect(userSigner) as GoldCardsFactory
  })

  describe('Gold Sampling Biais', () => {
    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids, {gasLimit: 25000000})
    })

    it.skip('should have low sampling bias', async () => {
      let random_cards: number[] = []
      for (let i = 0; i < n_samples; i++) {
        let seed = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(new Date().getTime().toString()))
        let sample = await factoryContract.functions.getRandomCards(seed, sample_size)
        random_cards.push(...sample.map(bn => bn.toNumber()))
      }

      let counts: number[] = []
      for (let i = 0; i < ids.length; i++) {
        let hits = random_cards.filter(id => id === ids[i].toNumber())
        counts.push(hits.length)
        console.log(hits.length)
      }

      let mean = counts.reduce((previous, current) => current += previous) / counts.length
      let max = Math.max(...counts);
      let min = Math.min(...counts)
      console.log('Mean: ', mean)
      console.log('Max (#',  counts.indexOf(max), "): ", max)
      console.log('Min (#',  counts.indexOf(min), "): ", min)
    })
  })
})