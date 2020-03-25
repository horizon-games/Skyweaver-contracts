import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  AssetRange,
  BuyCardsObj,
  getBuyCardsData
} from './utils'

import * as utils from './utils'
import { SkyweaverCurrencies } from 'typings/contracts/SkyweaverCurrencies'
import { WeaveFactory } from 'typings/contracts/WeaveFactory'
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

contract('WeaveFactory', (accounts: string[]) => {
  let ownerAddress: string
  let userAddress: string
  let operatorAddress: string
  let skyweaverCurrenciesAbstract: AbstractContract
  let arcadeumCoinAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverCurrenciesContract: SkyweaverCurrencies
  let factoryContract: WeaveFactory

  // Factory manager
  let userFactoryContract: WeaveFactory

  // Base Token Param
  const weaveID = new BigNumber(1);

  // ~1m weave per week, 18 decimals
  const weekInSeconds = new BigNumber(60).mul(60).mul(24).mul(7)
  const weavePerSecond = new BigNumber(1000000).mul(new BigNumber(10).pow(18)).div(weekInSeconds)

  // Range values 
  const minRange = weaveID;
  const maxRange = weaveID;

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    skyweaverCurrenciesAbstract = await AbstractContract.fromArtifactName('SkyweaverCurrencies')
    arcadeumCoinAbstract = await AbstractContract.fromArtifactName('ArcadeumCoin')
    factoryAbstract = await AbstractContract.fromArtifactName('WeaveFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Skyweaver Currency Contract
    skyweaverCurrenciesContract = await skyweaverCurrenciesAbstract.deploy(ownerWallet) as SkyweaverCurrencies

    // Deploy weave factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverCurrenciesContract.address,
      weavePerSecond,
      weaveID
    ]) as WeaveFactory
    userFactoryContract = await factoryContract.connect(userSigner) as WeaveFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverCurrenciesContract.functions.activateFactory(factory);
    await skyweaverCurrenciesContract.functions.addMintPermission(factory, minRange, maxRange);
  })

  describe('Getter functions', () => {
    describe('getFactoryManager() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.functions.getFactoryManager()
        expect(manager).to.be.eql(skyweaverCurrenciesContract.address)
      })
    })

    describe('getWeavePerSecond() function', () => {
      it('should return the correct weave per second amount', async () => {
        const weave_per_seconds = await factoryContract.functions.getWeavePerSecond()
        expect(weave_per_seconds).to.be.eql(weavePerSecond)
      })
    })

    describe('getWeaveID() function', () => {
      it('should return correct weave ID', async () => {
        const token_id = await factoryContract.functions.getWeaveID()
        expect(token_id).to.be.eql(weaveID)
      })
    })

    describe('getLastHarvest() function', () => {
      it('should return correct card price', async () => {
        const initial_havest = await factoryContract.functions.getLastHarvest()
        const receipt = await factoryContract.deployTransaction.wait(1)
        let block = await ownerProvider.getBlock(receipt.blockNumber!)
        expect(initial_havest).to.be.eql(new BigNumber(block.timestamp))
      })
    })

    describe('getAvailableWeave() function', () => {
      it('should return weave amount', async () => {
        const receipt = await factoryContract.deployTransaction.wait(1)
        let block = await ownerProvider.getBlock(receipt.blockNumber!)

        // Go to next block and increase time by 100
        await ownerProvider.send("evm_increaseTime", [100])
        await ownerProvider.send("evm_mine", [])
        let block2 = await ownerProvider.getBlock(await ownerProvider.getBlockNumber())
        
        let available_weave = await factoryContract.functions.getAvailableWeave()
        let time_since_last_harvest = new BigNumber(block2.timestamp).sub(block.timestamp)
        let expected_Weave = time_since_last_harvest.mul(weavePerSecond)
        expect(available_weave).to.be.eql(expected_Weave)
      })
    })

    
  })

  describe('harvestWeave() function', () => {
  
    context('When time has elapsed', () => {
      let snapshot;
      let deploy_block;

      beforeEach(async () => {
        const receipt = await factoryContract.deployTransaction.wait(1)
        deploy_block = await ownerProvider.getBlock(receipt.blockNumber!)

        snapshot = await ownerProvider.send('evm_snapshot', [])
        await ownerProvider.send("evm_increaseTime", [weekInSeconds.toNumber()])
        await ownerProvider.send("evm_mine", [])
      })
      afterEach(async () => {
        await ownerProvider.send("evm_revert", [snapshot])
      })

      it('should PASS if called by owner', async () => {
        let tx = factoryContract.functions.harvestWeave(ownerAddress, [], {gasLimit: 2000000})
        await expect(tx).to.be.fulfilled;
      })

      it('should REVERT if called by non-owner', async () => {
        let tx = userFactoryContract.functions.harvestWeave(ownerAddress, [], {gasLimit: 2000000})
        await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"));
      })

      it('should update recipient balance correctly', async () => {
        let status = await skyweaverCurrenciesContract.functions.getFactoryStatus(factoryContract.address)
        expect(status).to.be.eql(true)
        await factoryContract.functions.harvestWeave(ownerAddress, [], {gasLimit: 2000000})
        let owner_balance = await skyweaverCurrenciesContract.functions.balanceOf(ownerAddress, weaveID)
        let current_block = await ownerProvider.getBlock(await ownerProvider.getBlockNumber())
        let time_elapsed = new BigNumber(current_block.timestamp).sub(deploy_block.timestamp)
        expect(owner_balance).to.be.eql(weavePerSecond.mul(time_elapsed))
      })

      it('should update lastHavest correctly', async () => {
        await factoryContract.functions.harvestWeave(ownerAddress, [], {gasLimit: 2000000})
        let post_harvest = await factoryContract.functions.getLastHarvest()
        let current_block = await ownerProvider.getBlock(await ownerProvider.getBlockNumber())
        expect(post_harvest.toNumber()).to.be.eql(current_block.timestamp)
      })

      it('should have at most ~1m weave mintable a week', async () => {
        let available_weave = await factoryContract.functions.getAvailableWeave()
        expect(available_weave.div(new BigNumber(10).pow(18)).toNumber()).to.be.at.most(1000010)
      })

      context('When weave was harvested', () => {
        let logs;
        let args;
        beforeEach(async () => {
          await factoryContract.functions.harvestWeave(ownerAddress, [], {gasLimit: 2000000})
          let filter = factoryContract.filters.WeaveHarvested(null, null);
          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filter.fromBlock = 0;
          logs = await operatorProvider.getLogs(filter);
          args = factoryContract.interface.events.WeaveHarvested.decode(logs[0].data, logs[0].topics)
        })

        it('should emit WeaveHarvested event', async () => {
          expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.WeaveHarvested.topic)
        })

        it('should have owner address as `recipient` field', async () => {  
          expect(args.recipient).to.be.eql(ownerAddress)
        })

        it('should have token ids as `tokensBoughtIds` field', async () => {  
          let current_block = await ownerProvider.getBlock(await ownerProvider.getBlockNumber())
          let time_elapsed = new BigNumber(current_block.timestamp).sub(deploy_block.timestamp)
          expect(args.amount).to.be.eql(weavePerSecond.mul(time_elapsed))
        })

      })



    })

  })
  
})