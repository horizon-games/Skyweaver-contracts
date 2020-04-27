import * as ethers from 'ethers'
ethers.errors.setLogLevel("error")

import { 
  AbstractContract, 
  expect,
  RevertError,
  getBuyGoldCardsData,
  getGoldCommitHash,
  getGoldMintObjHash,
  GoldOrder,
  getRandomGoldCards,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from 'typings/contracts/SkyweaverAssets'
import { SkyweaverCurrencies } from 'typings/contracts/SkyweaverCurrencies'
import { FactoryMock } from 'typings/contracts/FactoryMock'
import { GoldCardsFactory } from 'typings/contracts/GoldCardsFactory'
import { TxnAggregator } from 'typings/contracts/TxnAggregator'
import { BigNumber } from 'ethers/utils';
import { Zero } from 'ethers/constants'

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
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let weaveAbstract: AbstractContract
  let factoryAbstract: AbstractContract
  let weaveFactoryAbstract:AbstractContract
  let txnAggregatorAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetsContract: SkyweaverAssets
  let weaveContract: SkyweaverCurrencies
  let weaveFactoryContract: FactoryMock
  let factoryContract: GoldCardsFactory

  // Arcadeum Coins
  let userWeaveContract: SkyweaverCurrencies

  // Factory manager
  let userFactoryContract: GoldCardsFactory
  let operatorFactoryContract: GoldCardsFactory
  let randomFactoryContract: GoldCardsFactory

  // Utils
  let txnAggregatorContract: TxnAggregator

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const decimals = 2
  const totalNTokensTypes = 500
  const nGoldsBuy         = new BigNumber(30)
  const nTokenTypes       = 30 

  // Range values 
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(501);

  // Base Token Param
  const weaveID = new BigNumber(1);
  const baseTokenAmount = new BigNumber(10000000).mul(new BigNumber(10).pow(18))
  const price = new BigNumber(500).mul(new BigNumber(10).pow(18))
  const refund = new BigNumber(250).mul(new BigNumber(10).pow(18))
  const limit = new BigNumber(400);
  const delay = new BigNumber(15);

  // Arrays
  const ids = new Array(totalNTokensTypes).fill('').map((a, i) => getBig(i+1))
  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    operatorAddress = await operatorWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    weaveAbstract = await AbstractContract.fromArtifactName('SkyweaverCurrencies')
    factoryAbstract = await AbstractContract.fromArtifactName('GoldCardsFactory')
    weaveFactoryAbstract = await AbstractContract.fromArtifactName('FactoryMock')
    txnAggregatorAbstract = await AbstractContract.fromArtifactName('TxnAggregator')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {

    // Deploy txn aggregator
    txnAggregatorContract = await txnAggregatorAbstract.deploy(ownerWallet) as TxnAggregator

    // Deploy Weave contract
    weaveContract = await weaveAbstract.deploy(ownerWallet) as SkyweaverCurrencies
    userWeaveContract = await weaveContract.connect(userSigner) as SkyweaverCurrencies
    weaveFactoryContract = await weaveFactoryAbstract.deploy(ownerWallet, [
      weaveContract.address,
    ]) as FactoryMock

    await weaveContract.functions.activateFactory(weaveFactoryContract.address);
    await weaveContract.functions.addMintPermission(weaveFactoryContract.address, weaveID, weaveID);

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets
    userSkyweaverAssetsContract = await skyweaverAssetsContract.connect(userSigner) as SkyweaverAssets

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      weaveContract.address,
      weaveID,
      price,
      refund,
      limit,
      delay, 
      {gasLimit: 7000000}
    ]) as GoldCardsFactory
    userFactoryContract = await factoryContract.connect(userSigner) as GoldCardsFactory
    operatorFactoryContract = await factoryContract.connect(operatorSigner) as GoldCardsFactory
    randomFactoryContract = await factoryContract.connect(randomSigner) as GoldCardsFactory

    // Assigning vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, minRange, maxRange);

    // Mint Arcadeum coins to owner and user
    await weaveFactoryContract.functions.mint(ownerAddress, weaveID, baseTokenAmount, [])
    await weaveFactoryContract.functions.mint(userAddress, weaveID, baseTokenAmount, [])
  })

  describe('Getter functions', () => {
    describe('getSkyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.functions.getSkyweaverAssets()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
      })
    })

    describe('getWeave() function', () => {
      it('should return arcadeum coin contract contract address', async () => {
        const token_address = await factoryContract.functions.getWeave()
        expect(token_address).to.be.eql(weaveContract.address)
      })
    })

    describe('getWeaveID() function', () => {
      it('should return correct arcadeum coin ID', async () => {
        const token_id = await factoryContract.functions.getWeaveID()
        expect(token_id).to.be.eql(weaveID)
      })
    })

    describe('getGoldPrice() function', () => {
      it('should return correct card price', async () => {
        const card_price = await factoryContract.functions.getGoldPrice()
        expect(card_price).to.be.eql(price)
      })
    })

    describe('getGoldRefund() function', () => {
      it('should return correct value', async () => {
        const value = await factoryContract.functions.getGoldRefund()
        expect(value).to.be.eql(refund)
      })
    })

    describe('getOrderSizeLimit() function', () => {
      it('should return correct value', async () => {
        const value = await factoryContract.functions.getOrderSizeLimit()
        expect(value).to.be.eql(limit)
      })
    })

    describe('getRNGDelay() function', () => {
      it('should return correct value', async () => {
        const value = await factoryContract.functions.getRNGDelay()
        expect(value).to.be.eql(new BigNumber(delay))
      })
    })

    describe('getPurchasableStatus() function', () => {
      beforeEach(async () => {
        await factoryContract.functions.registerIDs(ids)
      })

      it('should PASS if caller is owner', async () => {
        const values = await factoryContract.functions.getPurchasableStatus(ids)
        for (let i = 0; i < values.length; i++) {
          expect(values[i]).to.be.eql(true)
        } 
      })
    })

    describe('getCardPool() function', () => {
      beforeEach(async () => {
        await factoryContract.functions.registerIDs(ids)
      })

      it('should PASS if caller is owner', async () => {
        const values = await factoryContract.functions.getCardPool()
        expect(values.length).to.be.eql(ids.length)
        for (let i = 0; i < values.length; i++) {
          expect(values[i]).to.be.eql(ids[i])
        } 
      })
    })

    describe('supportsInterface()', () => {
      it('should return true for 0x01ffc9a7 (ERC165)', async () => {
        const support = await factoryContract.functions.supportsInterface('0x01ffc9a7')
        expect(support).to.be.eql(true)
      })

      it('should return true for 0x4e2312e0 (ERC1155Receiver)', async () => {
        const support = await factoryContract.functions.supportsInterface('0x4e2312e0')
        expect(support).to.be.eql(true)
      })
    })
  })

  describe('registerIDs() function', () => {
    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.registerIDs(ids)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.registerIDs(ids)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When tokens were registered', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.registerIDs(ids)
      })

      it('should set token ids to registered', async () => {
        let statuses = await factoryContract.functions.getPurchasableStatus(ids);
        for (let i = 0; i < statuses.length; i++){
          expect(statuses[i]).to.be.eql(true)
        }
      })

      it('should add ids to card pool', async () => {
        const values = await factoryContract.functions.getCardPool()
        expect(values.length).to.be.eql(ids.length)
        for (let i = 0; i < values.length; i++) {
          expect(values[i]).to.be.eql(ids[i])
        }
      })

      it('should REVERT if id is already registered', async () => {
        const tx = factoryContract.functions.registerIDs([ids[totalNTokensTypes - 1]])
        await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#registerIDs: ID_ALREADY_REGISTERED"))
      })

      it('should emit IDsRegistration event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.IDsRegistration(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.IDsRegistration.topic)
      })
      
      describe('IDsRegistration Event', () => {
        it('should have token ids as `ids` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.ids.length).to.be.eql(ids.length)
        })
      })
    })
  })

  describe('deregisterIDs() function', () => {
    let start = ids.length - nTokenTypes
    const ids_inv = ids.slice(start)
    const idx_inv = new Array(nTokenTypes).fill('').map((a, i) => getBig(start + i))
    ids_inv.reverse()
    idx_inv.reverse()

    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids)
    })

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.deregisterIDs(ids_inv, idx_inv)
      await expect(tx).to.be.fulfilled
      const values = await factoryContract.functions.getCardPool()
      expect(values.length).to.be.eql(start)
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.deregisterIDs(ids_inv, idx_inv)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if ID is not registered', async () => {
      const tx = factoryContract.functions.deregisterIDs([totalNTokensTypes+2], [totalNTokensTypes + 1])
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#deregisterIDs: ID_NOT_REGISTERED"))
    })

    it('should REVERT if index of id is incorrect', async () => {
      let indexes = idx_inv.slice()
      indexes[0] = indexes[0].sub(1)
      const tx = factoryContract.functions.deregisterIDs(ids_inv, indexes)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#deregisterIDs: INVALID_CARD_POOL_INDEX"))

      indexes = idx_inv.slice()
      indexes[0] = new BigNumber(totalNTokensTypes)
      const tx2 = factoryContract.functions.deregisterIDs(ids_inv, indexes)
      await expect(tx2).to.be.rejected
    })

    it('should remove correct id at correct index', async () => {
      const indexes = new Array(nTokenTypes).fill('').map((a, i) => getBig(i))
      const tx = factoryContract.functions.deregisterIDs([ids[4]], [indexes[4]])
      await expect(tx).to.be.fulfilled

      const values = await factoryContract.functions.getCardPool()
      expect(values.length).to.be.eql(ids.length - 1)

      for (let i = 0; i < values.length; i++) {
        // last id was moved
        if (i == 4) {
          expect(values[i]).to.be.eql(ids[ids.length-1])
        } else {
          expect(values[i]).to.be.eql(ids[i])
        }
      }
    })

    context('When tokens were deRegistered', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.deregisterIDs(ids_inv, idx_inv)
      })

      it('should set token ids to not registered', async () => {
        let statuses = await factoryContract.functions.getPurchasableStatus(ids_inv);
        for (let i = 0; i < statuses.length; i++){
          expect(statuses[i]).to.be.eql(false)
        }
      })

      it('should remove ids to card pool', async () => {
        const values = await factoryContract.functions.getCardPool()
        expect(values.length).to.be.eql(totalNTokensTypes-nTokenTypes)
      })

      it('should allow removed id to be added again', async () => {
        let tx2 = factoryContract.functions.registerIDs(ids_inv)
        await expect(tx2).to.be.fulfilled;
      })

      it('should emit IDsDeregistration event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.IDsDeregistration(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.IDsDeregistration.topic)
      })
      
      describe('IDsDeregistration Event', () => {
        it('should have token ids as `ids` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.ids.length).to.be.eql(ids_inv.length)
        })
      })
    })
  })

  describe('updateGoldPrice() function', () => {
    let newPrice = price.mul(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateGoldPrice(newPrice)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateGoldPrice(newPrice)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if new price is too low', async () => {
      const tx = factoryContract.functions.updateGoldPrice(10000000)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#updateGoldPrice: INVALID_PRICE"))
    })
    it('should REVERT if new price is lower than refund', async () => {
      const tx = factoryContract.functions.updateGoldPrice(refund.sub(1))
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#updateGoldPrice: REFUND_HIGHER_THAN_PRICE"))
    })

    context('When price was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateGoldPrice(newPrice)
      })

      it('should set price to new price', async () => {
        let returned_price = await factoryContract.functions.getGoldPrice();
        expect(returned_price).to.be.eql(newPrice)
      })

      it('should emit GoldPriceChanged event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.GoldPriceChanged(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.GoldPriceChanged.topic)
      })
      
      describe('GoldPriceChanged Event', () => {
        it('should have old price as `oldPrice` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldPrice).to.be.eql(price)
        })
        it('should have new price as `newPrice` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newPrice).to.be.eql(newPrice)
        })
      })
    })
  })

  describe('updateGoldRefund() function', () => {
    let newRefund = refund.mul(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateGoldRefund(newRefund)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateGoldRefund(newRefund)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if new refund is larget than gold price', async () => {
      const tx = factoryContract.functions.updateGoldRefund(price.add(1))
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#updateGoldRefund: REFUND_HIGHER_THAN_PRICE"))
    })

    context('When refund was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateGoldRefund(newRefund)
      })

      it('should set refund to new refund', async () => {
        let returned_refund = await factoryContract.functions.getGoldRefund();
        expect(returned_refund).to.be.eql(newRefund)
      })

      it('should emit GoldRefundChanged event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.GoldRefundChanged(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.GoldRefundChanged.topic)
      })
      
      describe('GoldRefundChanged Event', () => {
        it('should have old refund as `oldRefund` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldRefund).to.be.eql(refund)
        })
        it('should have new refund as `newRefund` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newRefund).to.be.eql(newRefund)
        })
      })
    })
  })

  describe('updateOrderSizeLimit() function', () => {
    let newLimit = limit.mul(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateOrderSizeLimit(newLimit)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if new limit is zero (halt)', async () => {
      const tx = factoryContract.functions.updateOrderSizeLimit(0)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateOrderSizeLimit(newLimit)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When limit was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateOrderSizeLimit(newLimit)
      })

      it('should set limit to new limit', async () => {
        let returned_limit = await factoryContract.functions.getOrderSizeLimit();
        expect(returned_limit).to.be.eql(newLimit)
      })

      it('should emit OrderSizeLimitChanged event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.OrderSizeLimitChanged(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.OrderSizeLimitChanged.topic)
      })
      
      describe('OrderSizeLimitChanged Event', () => {
        it('should have old limit as `oldLimit` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldLimit).to.be.eql(limit)
        })
        it('should have new limit as `newLimit` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newLimit).to.be.eql(newLimit)
        })
      })
    })
  })

  describe('updateRNGDelay() function', () => {
    let newDelay = delay.mul(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateRNGDelay(newDelay)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateRNGDelay(newDelay)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if delay is 0', async () => {
      const tx = factoryContract.functions.updateRNGDelay(0)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#updateRNGDelay: INVALID_DELAY"))
    })

    context('When delay was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateRNGDelay(newDelay)
      })

      it('should set delay to new delay', async () => {
        let returned_delay= await factoryContract.functions.getRNGDelay();
        expect(returned_delay).to.be.eql(newDelay)
      })

      it('should emit RNGDelayChanged event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.RNGDelayChanged(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.RNGDelayChanged.topic)
      })
      
      describe('RNGDelayChanged Event', () => {
        it('should have old delay as `oldDelay` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldDelay).to.be.eql(delay)
        })
        it('should have new delay as `newDelay` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newDelay).to.be.eql(newDelay)
        })
      })
    })
  })

  describe('_commit() function', () => {
    let feeAmount = new BigNumber(500)
    let cost = nGoldsBuy.mul(price).add(feeAmount)
    let buyCardsData;
    let order: GoldOrder;

    beforeEach(async () => {
      order = {
        cardRecipient: userAddress,
        feeRecipient: operatorAddress,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }
      buyCardsData = getBuyGoldCardsData(order)
      await factoryContract.functions.registerIDs(ids)
    })

    it('should PASS if caller sends enough weaver', async () => {
      const tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if caller sends enough weaver (via batchTx)', async () => {
      const tx = userWeaveContract.functions.safeBatchTransferFrom(userAddress, factory, [weaveID], [cost], buyCardsData, TX_PARAM)
      await expect(tx).to.be.fulfilled
    }) 

    it('should REVERT arrays are more than length 1', async () => {
      const tx = userWeaveContract.functions.safeBatchTransferFrom(userAddress, factory, [weaveID, weaveID.add(1)], [cost, 0], buyCardsData, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#onERC1155BatchReceived: INVALID_ARRAYS"))
    }) 

    it('should REVERT if caller tries to commit twice in same block', async () => {
      let iface = new ethers.utils.Interface(weaveAbstract.abi)
      let txn1_data = iface.functions.safeTransferFrom.encode([userAddress, factory, weaveID, cost, buyCardsData])

      // Send cards to operator
      let goldObject2 = {
        cardRecipient: operatorAddress,
        feeRecipient: operatorAddress,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      } as GoldOrder
      let buyCardsData2 = getBuyGoldCardsData(goldObject2)
      let txn2_data = iface.functions.safeTransferFrom.encode([userAddress, factory, weaveID, cost, buyCardsData2])

      // FOLLOWING LINE IS VERY INSECURE BUT FINE FOR TESTING THAT CONDITION
      await userWeaveContract.functions.setApprovalForAll(txnAggregatorContract.address, true)
      // VERY INSECURE ^^^^

      const tx = txnAggregatorContract.functions.singleContract_executeTxns(weaveContract.address, [txn1_data], true)
      await expect(tx).to.be.fulfilled

      const tx2 = txnAggregatorContract.functions.singleContract_executeTxns(weaveContract.address, [txn1_data, txn2_data], true)
      await expect(tx2).to.be.fulfilled

      const tx3 = txnAggregatorContract.functions.singleContract_executeTxns(weaveContract.address, [txn2_data, txn1_data], true)
      await expect(tx3).to.be.fulfilled

      // Substring error matching
      const tx4 = txnAggregatorContract.functions.singleContract_executeTxns(weaveContract.address, [txn1_data, txn1_data], true)
      await expect(tx4).to.be.rejectedWith("GoldCardsFactory#_commit: ORDER_HASH_ALREADY_USED");

      const tx5 = txnAggregatorContract.functions.singleContract_executeTxns(weaveContract.address, [txn2_data, txn2_data], true)
      await expect(tx5).to.be.rejectedWith("GoldCardsFactory#_commit: ORDER_HASH_ALREADY_USED")
    })

    it('should send refund if too many weave was sent', async () => {
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, baseTokenAmount, buyCardsData, TX_PARAM)
      let factory_balance = await weaveContract.functions.balanceOf(factory, weaveID)
      let user_balance = await weaveContract.functions.balanceOf(userAddress, weaveID)
      expect(factory_balance).to.be.eql(refund.mul(nGoldsBuy).add(feeAmount));
      expect(user_balance).to.be.eql(baseTokenAmount.sub(cost));
    })

    it('should REVERT if caller does not send enough weave', async () => {
      const tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost.sub(1), buyCardsData, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
    })

    it('should REVERT if asset sent is not weave ID', async () => {
      await weaveContract.functions.addMintPermission(weaveFactoryContract.address, weaveID.add(1), weaveID.add(1));
      await weaveFactoryContract.functions.mint(userAddress, weaveID.add(1), baseTokenAmount, [])
      const tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID.add(1), cost, buyCardsData, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#onERC1155BatchReceived: INVALID_WEAVE_ID"))
    })

    it('should REVERT if asset sent is not weave contract', async () => {
      // Deploy Weave contract
      let weaveContract2 = await weaveAbstract.deploy(ownerWallet) as SkyweaverCurrencies
      let userWeaveContract2 = await weaveContract2.connect(userSigner) as SkyweaverCurrencies
      let weaveFactoryContract2 = await weaveFactoryAbstract.deploy(ownerWallet, [
        weaveContract2.address,
      ]) as FactoryMock

      await weaveContract2.functions.activateFactory(weaveFactoryContract2.address);
      await weaveContract2.functions.addMintPermission(weaveFactoryContract2.address, weaveID, weaveID);
      
      await weaveFactoryContract2.functions.mint(userAddress, weaveID, baseTokenAmount, [])
      const tx = userWeaveContract2.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#onERC1155BatchReceived: INVALID_TOKEN"))
    })

    it('should REVERT if caller tries to overflow the total cost to buy', async () => {
      let max_val = new BigNumber(2).pow(256)
      let overflow_cost_amount = max_val.div(price).add(1)
      order.cardAmount = overflow_cost_amount
      order.feeAmount = Zero
      let data = getBuyGoldCardsData(order)
      const tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, data, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("SafeMath#mul: OVERFLOW"))
    })

    it('should REVERT if order at rng_block already exists', async () => {
      // 1. Create order with 3 delay
      await factoryContract.functions.updateRNGDelay(3);
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      let order1_rng_block = await ownerProvider.getBlockNumber() + 3

      // 2. Create order with 1 delay
      await factoryContract.functions.updateRNGDelay(1);
      expect(await ownerProvider.getBlockNumber()).to.be.equal(order1_rng_block-2)
      let tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#_commit: ORDER_HASH_ALREADY_USED"))
    })

    it('should REVERT if order size exceeds limit', async () => {
      let n_gold_buy_excess = limit.add(1)
      let cost_excess = n_gold_buy_excess.mul(price).add(feeAmount)
      let order_excess: GoldOrder = {
        cardRecipient: userAddress,
        feeRecipient: operatorAddress,
        cardAmount: n_gold_buy_excess,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }

      let buy_card_data_excess = getBuyGoldCardsData(order_excess)
      const tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost_excess, buy_card_data_excess, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#_commit: CARD_AMOUNT_EXCEEDS_LIMIT"))
    })

    it('should pass if order size is equal to the limit', async () => {
      let n_gold_buy_limit = limit
      let cost_limit = n_gold_buy_limit.mul(price).add(feeAmount)
      let order_limit: GoldOrder = {
        cardRecipient: userAddress,
        feeRecipient: operatorAddress,
        cardAmount: n_gold_buy_limit,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }

      let buy_card_data_limit = getBuyGoldCardsData(order_limit)
  
      const tx = userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost_limit, buy_card_data_limit, TX_PARAM)
      await expect(tx).to.be.fulfilled
    })


    context('When purchase was comitted', () => {
      let logs;
      let tx;
      let blockNumber;
      beforeEach(async () => {
        tx = await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
        
        // Get block #
        let receipt = await tx.wait(1)
        blockNumber = receipt.blockNumber;

        let filter = factoryContract.filters.OrderCommited(null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filter.fromBlock = userProvider.getBlockNumber();
        logs = await operatorProvider.getLogs(filter);
        order.rngBlock = delay.add(blockNumber)
      })

      it('should update factory weave balance', async () => {
        let factory_balance = await weaveContract.functions.balanceOf(factory, weaveID)
        expect(factory_balance).to.be.eql(refund.mul(nGoldsBuy).add(feeAmount));
      })

      it('should update user weave balance', async () => {
        let user_balance = await weaveContract.functions.balanceOf(userAddress, weaveID)
        expect(user_balance).to.be.eql(baseTokenAmount.sub(cost));
      })

      it('should update the order status', async () => {
        let order_hash = getGoldMintObjHash(order)
        let order_status = (await factoryContract.functions.getOrderStatuses([order_hash]))[0]
        expect(order_status).to.be.eql(true);
      })

      it('should emit OrderCommited event', async () => {
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.OrderCommited.topic)
      })
      
      describe('OrderCommited Event', () => {
        let args;

        beforeEach(async () => {
          args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics)
        })

        it('should have user address as `cardRecipient` field', async () => {  
          expect(args.order[0]).to.be.eql(userAddress)
        })

        it('should have operator address as `feeRecipient` field', async () => {  
          expect(args.order[1]).to.be.eql(operatorAddress)
        })

        it('should have amount of gold as `cardAmount` field', async () => {  
          expect(args.order[2]).to.be.eql(nGoldsBuy)
        })

        it('should have fee amount as `feeAmount` field', async () => {  
          expect(args.order[3]).to.be.eql(feeAmount)
        })

        it('should have rng block as `rngBlock` field', async () => {  
          expect(args.order[4]).to.be.eql(order.rngBlock)
        })

      })
    })
  })

  describe('recommit() function', () => {
    let feeAmount = new BigNumber(500)
    let cost = nGoldsBuy.mul(price).add(feeAmount)
    let buyCardsData;
    let order: GoldOrder;
    let rng_block;

    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids)

      order = {
        cardRecipient: userAddress,
        feeRecipient: operatorAddress,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }

      buyCardsData = getBuyGoldCardsData(order)
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)

      let filter = factoryContract.filters.OrderCommited(null);
      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filter.fromBlock = (await ownerProvider.getBlockNumber())-1;
      let logs = await operatorProvider.getLogs(filter);
      let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

      // Update rng_block to correct
      rng_block = args[4]
      order.rngBlock = rng_block
    })

    it('should REVERT if order does not exist', async () => {
      order.rngBlock = rng_block + 1
      const tx = factoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if order was executed already', async () => {

      // Mine empty blocks
      for (let i = 0; i < delay.toNumber(); i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      let rng_seed = await factoryContract.functions.getRNGSeed(order)
      let gold = await getRandomGoldCards(factoryContract, rng_seed, nGoldsBuy)
      let ids_to_mint = gold.ids_mint_array
      let sort_order = gold.sorted_indexes

      const tx0 = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx0).to.be.fulfilled;

      const tx1 = factoryContract.functions.recommit(order)
      await expect(tx1).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if RNG block was not mined yet', async () => {
      const tx = factoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
    })

    it('should REVERT if order is still executable', async () => {
      // Mine empty blocks
      for (let i = 0; i < delay.toNumber(); i ++) {
        await ownerProvider.send("evm_mine", [])
      }
      const tx = factoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NOT_EXPIRED"))
    })

    it('should REVERT if order at new rng_block already exists', async () => {

      // 1. Create order with 1 delay
      await factoryContract.functions.updateRNGDelay(1);
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      let order1_rng_block = await ownerProvider.getBlockNumber() + 1

      // 2. Create order with 257 delay
      await factoryContract.functions.updateRNGDelay(257);
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)

      let filter = factoryContract.filters.OrderCommited(null);
      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filter.fromBlock = (await ownerProvider.getBlockNumber()) - 1;
      let logs = await operatorProvider.getLogs(filter);
      let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

      // Update rng_block to correct
      let order2_rng_block = args[4]
      
      // 3. Mine 254 blocks
      for (let i = 0; i < 254; i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      // 4. Recommit order #1 with delay of 1
      await factoryContract.functions.updateRNGDelay(1);

      order.rngBlock = new BigNumber(order1_rng_block)
      
      // should fail because order 2. is already using that hash
      expect(await ownerProvider.getBlockNumber()).to.be.equal(order2_rng_block-2)
      let tx = factoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_HASH_ALREADY_USED"))
    })

    it('should REVERT if card recipient of order is wrong', async () => {
      order.cardRecipient = ownerAddress
      const tx = operatorFactoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if fee recipient of order is wrong', async () => {
      order.feeRecipient = userAddress
      const tx = operatorFactoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if card amount of order is wrong', async () => {
      // +1
      order.cardAmount = order.cardAmount.add(1)
      const tx = operatorFactoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))

      // -1
      order.cardAmount = order.cardAmount.sub(2)
      const tx2 = operatorFactoryContract.functions.recommit(order)
      await expect(tx2).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if fee amount of order is wrong', async () => {
      order.feeAmount = order.feeAmount.sub(1)
      const tx = operatorFactoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if rng block of order is wrong', async () => {
      // Not mined yet (+1)
      order.rngBlock = order.rngBlock.add(1)
      const tx = operatorFactoryContract.functions.recommit(order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
      
      // Mined but wrong (-1)
      order.rngBlock = order.rngBlock.sub(2)
      const tx3 = operatorFactoryContract.functions.recommit(order)
      await expect(tx3).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))

      // rng block was Mined, but wrong (+1)
      order.rngBlock = order.rngBlock.add(2)
      const tx2 = operatorFactoryContract.functions.recommit(order)
      await expect(tx2).to.be.rejectedWith(RevertError("GoldCardsFactory#recommit: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should PASS if order is not executable anymore', async () => {
      // Mine empty blocks
      for (let i = 0; i < delay.toNumber() + 256; i ++) {
        await ownerProvider.send("evm_mine", [])
      }
      const tx = factoryContract.functions.recommit(order)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if anyone recommits', async () => {
      // Mine empty blocks
      for (let i = 0; i < delay.toNumber() + 256; i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      const tx = userFactoryContract.functions.recommit(order)
      await expect(tx).to.be.fulfilled
    })

    context('When order was recommitted', () => {
      let zero_bytes32 = ethers.utils.formatBytes32String('')
      let logs;
      let blockNumber;
      let old_oder_hash;
      let new_oder_hash;
      beforeEach(async () => {
        old_oder_hash = getGoldMintObjHash(order)

        // Mine empty blocks
        for (let i = 0; i < delay.toNumber() + 256; i ++) {
          await ownerProvider.send("evm_mine", [])
        }

        await userFactoryContract.functions.recommit(order)
        blockNumber = await userProvider.getBlockNumber()

        let filter = factoryContract.filters.OrderRecommitted(null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filter.fromBlock = blockNumber;
        logs = await operatorProvider.getLogs(filter);
        rng_block = delay.add(blockNumber)
        order.rngBlock = rng_block
        new_oder_hash = getGoldMintObjHash(order)
      })

      it('should set old order status to false', async () => {
        let old_order_status = (await factoryContract.functions.getOrderStatuses([old_oder_hash]))[0]
        expect(old_order_status).to.be.eql(false);
      })

      it('should set new order hash to true', async () => {
        let new_order_status = (await factoryContract.functions.getOrderStatuses([new_oder_hash]))[0]
        expect(new_order_status).to.be.eql(true);
      })

      it('should allow recommited order to be filled', async () => {
        // Mine empty blocks
        for (let i = 0; i < delay.toNumber(); i ++) {
          await ownerProvider.send("evm_mine", [])
        }

        let rng_seed = await factoryContract.functions.getRNGSeed(order)
        let golds = await getRandomGoldCards(factoryContract, rng_seed, nGoldsBuy)
        let ids_to_mint = golds.ids_mint_array
        let sort_order = golds.sorted_indexes

        const tx0 = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
        await expect(tx0).to.be.fulfilled;
      })

      it('should emit OrderRecommitted event', async () => {
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.OrderRecommitted.topic)
      })
      
      describe('OrderRecommitted Event', () => {
        let args;

        beforeEach(async () => {
          args = factoryContract.interface.events.OrderRecommitted.decode(logs[0].data, logs[0].topics)
        })

        it('should have user address as `cardRecipient` field', async () => {  
          expect(args.order[0]).to.be.eql(userAddress)
        })

        it('should have operator address as `feeRecipient` field', async () => {  
          expect(args.order[1]).to.be.eql(operatorAddress)
        })

        it('should have amount of gold as `cardAmount` field', async () => {  
          expect(args.order[2]).to.be.eql(nGoldsBuy)
        })

        it('should have fee amount as `feeAmount` field', async () => {  
          expect(args.order[3]).to.be.eql(feeAmount)
        })

        it('should have new rng block as `rngBlock` field', async () => {  
          expect(args.order[4]).to.be.eql(order.rngBlock)
        })
      })
    })
  })

  describe('mineGolds() function', () => {
    let feeAmount = new BigNumber(500)
    let cost = nGoldsBuy.mul(price).add(feeAmount)
    let buyCardsData;
    let order_hash;
    let ids_to_mint: number[]
    let sort_order: number[]
    let n_loop: number = 0
    let snapshot;
 
    let order: GoldOrder;

    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids)
      snapshot = await ownerProvider.send('evm_snapshot', [])
      let repeat = true
      n_loop = 0

      // Will loop until we have some duplicates, to make sure it works fine
      while (repeat) {
        order = {
          cardRecipient: userAddress,
          feeRecipient: operatorAddress,
          cardAmount: nGoldsBuy,
          feeAmount: feeAmount,
          rngBlock: Zero,
        }
        buyCardsData = getBuyGoldCardsData(order)

        // Commit weave for purchase
        let tx = await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
        await tx.wait()

        let filter = factoryContract.filters.OrderCommited(null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filter.fromBlock = (await ownerProvider.getBlockNumber())-1;
        let logs = await operatorProvider.getLogs(filter);
        let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

        // Update rng_block to correct
        order.rngBlock = args[4]
        order_hash = getGoldMintObjHash(order)

        // Need to mine block post rng block
        for (let i = 0; i < delay.toNumber(); i ++) {
          await ownerProvider.send("evm_mine", [])
        }

        let rng_seed = await factoryContract.functions.getRNGSeed(order)
        let gold = await getRandomGoldCards(factoryContract, rng_seed, order.cardAmount)
        ids_to_mint = gold.ids_mint_array
        sort_order = gold.sorted_indexes

        repeat = ids_to_mint.length < nGoldsBuy.toNumber() ? false : true
        repeat = nGoldsBuy.toNumber() == 1 ? false : repeat
        n_loop++;
      }
    })

    afterEach(async () => {
      await ownerProvider.send("evm_revert", [snapshot])
    })

    it('should PASS if everything is valid', async () => {
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled
    })

    it('should allow anyone to mine cards if no fee recipient is specified', async () => {
      order = {
        cardRecipient: userAddress,
        feeRecipient: ZERO_ADDRESS,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }

      buyCardsData = getBuyGoldCardsData(order)

      // Event filter
      let filter = factoryContract.filters.OrderCommited(null);
      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filter.fromBlock = await ownerProvider.getBlockNumber()

      // Commit weave for purchase
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      let logs = await operatorProvider.getLogs(filter);
      let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

      // Update rng_block to correct
      order.rngBlock = args[4]

      // Need to mine block post rng block
      for (let i = 0; i < delay.toNumber() + 1; i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      let rng_seed = await factoryContract.functions.getRNGSeed(order)
      let gold = await getRandomGoldCards(factoryContract, rng_seed, order.cardAmount)
      ids_to_mint = gold.ids_mint_array
      sort_order = gold.sorted_indexes

      const tx = randomFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled

      // Owner balance should be updated
      let balance = await weaveContract.functions.balanceOf(randomAddress, weaveID)
      expect(balance).to.be.eql(feeAmount);
    })

    it('should REVERT if caller tries to commit and mine in same block', async () => {
      let iface = new ethers.utils.Interface(weaveAbstract.abi)
      let factory_iface = new ethers.utils.Interface(factoryAbstract.abi)
      let txn1_data = iface.functions.safeTransferFrom.encode([userAddress, factory, weaveID, cost, buyCardsData])

      order = {
        cardRecipient: userAddress,
        feeRecipient: operatorAddress,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }
      buyCardsData = getBuyGoldCardsData(order)

      // FOLLOWING LINE IS VERY INSECURE BUT FINE FOR TESTING THAT CONDITION
      await userWeaveContract.functions.setApprovalForAll(txnAggregatorContract.address, true)
      // VERY INSECURE ^^^^

      // Update rng_block to correct
      order.rngBlock = new BigNumber(await ownerProvider.getBlockNumber()).add(delay).add(1)

      let rng_seed = await factoryContract.functions.getRNGSeed(order)
      let gold = await getRandomGoldCards(factoryContract, rng_seed, order.cardAmount)
      ids_to_mint = gold.ids_mint_array
      sort_order = gold.sorted_indexes

      let txn2_data = factory_iface.functions.mineGolds.encode([order, ids_to_mint, sort_order])

      const TX1 = {dest: weaveContract.address, data: txn1_data}
      const TX2 = {dest: factory, data: txn2_data}

      const tx = txnAggregatorContract.functions.executeTxns([TX1, TX2], true, {gasLimit: 4000000})
      await expect(tx).to.be.rejectedWith("SafeMath#sub: UNDERFLOW") // no exact match, but needs to be substring
    })

    it('should REVERT if RNG block has not been mined yet', async () => {
      order = {
        cardRecipient: userAddress,
        feeRecipient: ZERO_ADDRESS,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }

      buyCardsData = getBuyGoldCardsData(order)

      // Commit weave for purchase
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      let premine_block = await ownerProvider.getBlockNumber()

      let filter = factoryContract.filters.OrderCommited(null);
      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filter.fromBlock = await ownerProvider.getBlockNumber();
      let logs = await operatorProvider.getLogs(filter);
      let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

      // Update rng_block to correct
      order.rngBlock = args[4]

      // Need to mine block post rng block
      await ownerProvider.send("evm_mine", [])

      let rng_seed = await factoryContract.functions.getRNGSeed(order)
      let gold = await getRandomGoldCards(factoryContract, rng_seed, order.cardAmount)
      ids_to_mint = gold.ids_mint_array
      sort_order = gold.sorted_indexes
      
      const tx = randomFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError('SafeMath#sub: UNDERFLOW'))

      // Check that only 2 blocks were mined since commit
      expect(await ownerProvider.getBlockNumber()).to.be.equal(premine_block + 2)
    })

    it('should REVERT if gold mining block is same RNG block', async () => {
      order = {
        cardRecipient: userAddress,
        feeRecipient: ZERO_ADDRESS,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }

      buyCardsData = getBuyGoldCardsData(order)

      // Commit weave for purchase
      let premine_block = await ownerProvider.getBlockNumber()
      await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)

      let filter = factoryContract.filters.OrderCommited(null);
      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filter.fromBlock = premine_block;
      let logs = await operatorProvider.getLogs(filter);
      let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

      // Update rng_block to correct
      order.rngBlock = args[4]

      // Need to mine block post rng block
      for (let i = 0; i < delay.toNumber()-1; i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      let rng_seed = await factoryContract.functions.getRNGSeed(order)
      let gold = await getRandomGoldCards(factoryContract, rng_seed, order.cardAmount)
      ids_to_mint = gold.ids_mint_array
      sort_order = gold.sorted_indexes
      
      const tx = randomFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

      expect(await ownerProvider.getBlockNumber()).to.be.equal(order.rngBlock.toNumber())
    })

    it('should REVERT if card recipient of order is wrong', async () => {
      order.cardRecipient = ownerAddress
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if fee recipient of order is wrong', async () => {
      order.feeRecipient = userAddress
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if card amount of order is wrong', async () => {
      // +1
      order.cardAmount = order.cardAmount.add(1)
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: INVALID_INDEXES_ARRAY_LENGTH"))

      // -1
      order.cardAmount = order.cardAmount.sub(2)
      sort_order = sort_order.slice(0, order.cardAmount.toNumber())

      expect(order.cardAmount.toNumber()).to.be.equal(sort_order.length)

      const tx2 = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx2).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if fee amount of order is wrong', async () => {
      order.feeAmount = order.feeAmount.add(1)
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if rng block of order is wrong', async () => {
      // Not mined yet (+1)
      order.rngBlock = order.rngBlock.add(1)
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      
      // Mined but wrong (-1)
      order.rngBlock = order.rngBlock.sub(2)
      const tx3 = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx3).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: ORDER_NON_EXISTANT_OR_EXECUTED"))

      // rng block was Mined, but wrong (+1)
      order.rngBlock = order.rngBlock.add(2)
      const tx2 = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx2).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: ORDER_NON_EXISTANT_OR_EXECUTED"))
    })

    it('should REVERT if tries to mint more than comitted for', async () => {
      let bad_sort_order = sort_order.slice()
      bad_sort_order.push(1)
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, bad_sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: INVALID_INDEXES_ARRAY_LENGTH"))
    })

    it('should REVERT if tries to mint less than comitted for', async () => {
      let bad_sort_order = sort_order.slice()
      bad_sort_order.pop()
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, bad_sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: INVALID_INDEXES_ARRAY_LENGTH"))
    })

    it('should REVERT if one of the ID is invalid', async () => {
      let bad_sort_order = sort_order.slice()
      let last_index = bad_sort_order[bad_sort_order.length-1]
      bad_sort_order[bad_sort_order.length-1] = last_index == 0 ? last_index + 1 : last_index - 1
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, bad_sort_order)
      if (sort_order.length > 1) {
        await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#validateRandomCards: INVALID_ID"))
      } else {
        await expect(tx).to.be.rejected
      }
    })

    it('should REVERT if one of the ID is invalid', async () => {
      let bad_ids = ids_to_mint.slice()
      bad_ids[bad_ids.length-1] = bad_ids[bad_ids.length-1] + 1
      const tx = operatorFactoryContract.functions.mineGolds(order, bad_ids, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#validateRandomCards: INVALID_ID"))
    })

    it('should REVERT if RNG block is too far back', async () => {
      // Need to mine block post rng block
      for (let i = 0; i < 256; i ++) {
        await ownerProvider.send("evm_mine", [])
      }
      let current_block = await ownerProvider.getBlockNumber()
      expect(current_block).to.be.equal(order.rngBlock.toNumber() + 256)

      // Next tx will be mined 257 block after rng block
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.rejectedWith(RevertError("GoldCardsFactory#mineGolds: RNG_BLOCK_OUT_OF_RANGE"))
    })

    it('should PASS if RNG block is 256 away far back', async () => {
      let current_block = await ownerProvider.getBlockNumber()
      let blocks_to_mine = 256 - (current_block - order.rngBlock.toNumber())-1

      // Need to mine block post rng block
      for (let i = 0; i < blocks_to_mine; i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      current_block = await ownerProvider.getBlockNumber()
      expect(current_block).to.be.equal(order.rngBlock.toNumber() + 255)
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if price was increased before order was mined', async () => {
      await factoryContract.functions.updateGoldPrice(price.mul(10))
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if price was decreased before order was mined', async () => {
      await factoryContract.functions.updateGoldPrice(refund)
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if refund was increased before order was mined', async () => {
      await factoryContract.functions.updateGoldPrice(price.mul(10))
      await factoryContract.functions.updateGoldRefund(refund.mul(10))
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if refund was decreased before order was mined', async () => {
      await factoryContract.functions.updateGoldRefund(refund.div(10))
      const tx = operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
      await expect(tx).to.be.fulfilled
    })


    context('When gold cards were minted', () => {
      let logs;
  
      beforeEach( async () => {
        await operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
        let filter = factoryContract.filters.OrderFulfilled(null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filter.fromBlock = await operatorProvider.getBlockNumber();
        logs = await operatorProvider.getLogs(filter);
      })
  
      it('should update factory weave balance with enough for refund, minus fee paid', async () => {
        let factory_balance = await weaveContract.functions.balanceOf(factory, weaveID)
        let refund_amount = order.cardAmount.mul(refund).mul(n_loop)
        let fees = feeAmount.mul(n_loop-1) // -1 because miner gets reimbursed once
        expect(factory_balance).to.be.eql(refund_amount.add(fees));
      })

      it('should update operator weave balance', async () => {
        let balance = await weaveContract.functions.balanceOf(operatorAddress, weaveID)
        expect(balance).to.be.eql(feeAmount);
      })

      it('should NOT change user weave balance', async () => {
        let user_balance = await weaveContract.functions.balanceOf(userAddress, weaveID)
        expect(user_balance).to.be.eql(baseTokenAmount.sub(cost.mul(n_loop)));
      })

      it('should set the order status to false', async () => {
        let order_status = (await factoryContract.functions.getOrderStatuses([order_hash]))[0]
        expect(order_status).to.be.eql(false);
      })

      it('should update user gold cards balance', async () => {
        let user_addresses = new Array(ids_to_mint.length).fill('').map((a, i) => userAddress)
        let userBalances = await skyweaverAssetsContract.functions.balanceOfBatch(user_addresses, ids_to_mint)
        for (let i = 0; i < ids_to_mint.length; i++) {
          // Count number of occurences
          let expected_amount = sort_order.filter(id => ids_to_mint[id] === ids_to_mint[i]).length
          expect(userBalances[i]).to.be.eql(new BigNumber(expected_amount).mul(10**decimals))
        }
      })

      it('should emit OrderFulfilled event', async () => {
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.OrderFulfilled.topic)
      })
      
      describe('OrderFulfilled Event', () => {
        let args;

        beforeEach(async () => {
          args = factoryContract.interface.events.OrderFulfilled.decode(logs[0].data, logs[0].topics)
        })

        it('should have order hash as `orderHash` field', async () => {  
          expect(args.orderHash).to.be.eql(order_hash)
        })

      })
    })
  })

  describe('_melt() function', () => {
    let feeAmount = new BigNumber(500)
    let cost = nGoldsBuy.mul(price).add(feeAmount)
    let buyCardsData;
    let ids_to_mint: number[]
    let sort_order: number[]
    let snapshot;
 
    let order: GoldOrder;

    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids)
      snapshot = await ownerProvider.send('evm_snapshot', [])

      order = {
        cardRecipient: userAddress,
        feeRecipient: operatorAddress,
        cardAmount: nGoldsBuy,
        feeAmount: feeAmount,
        rngBlock: Zero,
      }
      buyCardsData = getBuyGoldCardsData(order)

      // Commit weave for purchase
      let tx = await userWeaveContract.functions.safeTransferFrom(userAddress, factory, weaveID, cost, buyCardsData, TX_PARAM)
      await tx.wait()

      let filter = factoryContract.filters.OrderCommited(null);
      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filter.fromBlock = await ownerProvider.getBlockNumber();
      let logs = await operatorProvider.getLogs(filter);
      let args = factoryContract.interface.events.OrderCommited.decode(logs[0].data, logs[0].topics).order

      // Update rng_block to correct
      order.rngBlock = args[4]

      // Need to mine block post rng block
      for (let i = 0; i < delay.toNumber() + 1; i ++) {
        await ownerProvider.send("evm_mine", [])
      }

      let rng_seed = await factoryContract.functions.getRNGSeed(order)
      let gold = await getRandomGoldCards(factoryContract, rng_seed, order.cardAmount)
      ids_to_mint = gold.ids_mint_array
      sort_order = gold.sorted_indexes

      // Mint golds
      await operatorFactoryContract.functions.mineGolds(order, ids_to_mint, sort_order)
    })

    afterEach(async () => {
      await ownerProvider.send("evm_revert", [snapshot])
    })

    it('should PASS if everything is valid', async () => {
      let user_adresses = new Array(ids_to_mint.length).fill('').map((a) => userAddress)
      let balances = await skyweaverAssetsContract.functions.balanceOfBatch(user_adresses, ids_to_mint)
      const tx = userSkyweaverAssetsContract.functions.safeBatchTransferFrom(userAddress, factory, ids_to_mint, balances, [])
      await expect(tx).to.be.fulfilled
    })

    it('should set recipient to address provided, not from, if recipient is specified', async () => {
      let user_adresses = new Array(ids_to_mint.length).fill('').map((a) => userAddress)
      let balances = await skyweaverAssetsContract.functions.balanceOfBatch(user_adresses, ids_to_mint)
      let recipient = ethers.utils.defaultAbiCoder.encode(['address'], [randomAddress])

      const tx = userSkyweaverAssetsContract.functions.safeBatchTransferFrom(userAddress, factory, ids_to_mint, balances, recipient)
      await expect(tx).to.be.fulfilled

      let userBalance = await weaveContract.functions.balanceOf(userAddress, weaveID)
      expect(userBalance).to.be.eql(baseTokenAmount.sub(cost))

      let randomBalance = await weaveContract.functions.balanceOf(randomAddress, weaveID)
      expect(randomBalance).to.be.eql(nGoldsBuy.mul(refund))
    })

    context('When gold cards were melted', () => {
      let logsBatch;
      let logsSingle;
      let gold_balances;
      beforeEach(async () => {
        let user_adresses = new Array(ids_to_mint.length).fill('').map(() => userAddress)
        gold_balances = await skyweaverAssetsContract.functions.balanceOfBatch(user_adresses, ids_to_mint)
        let current_block = await ownerProvider.getBlockNumber()
        await userSkyweaverAssetsContract.functions.safeBatchTransferFrom(userAddress, factory, ids_to_mint, gold_balances, [])
        let filterBatch = skyweaverAssetsContract.filters.TransferBatch(null, null, null, null, null);
        let filterSingle = skyweaverAssetsContract.filters.TransferSingle(null, null, null, null, null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterBatch.fromBlock = current_block+1;
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterSingle.fromBlock = current_block+1;
        logsBatch = await operatorProvider.getLogs(filterBatch);
        logsSingle = await operatorProvider.getLogs(filterSingle);
      })

      it('should update factory weave balance', async () => {
        let factory_balance = await weaveContract.functions.balanceOf(factory, weaveID)
        expect(factory_balance).to.be.eql(Zero);
      })

      it('should update user weave balance', async () => {
        let userBalance = await weaveContract.functions.balanceOf(userAddress, weaveID)
        expect(userBalance).to.be.eql(baseTokenAmount.sub(cost).add(nGoldsBuy.mul(refund)))

        let randomBalance = await weaveContract.functions.balanceOf(randomAddress, weaveID)
        expect(randomBalance).to.be.eql(Zero)
      })

      it('should update user Gold cards balance', async () => {
        let user_addresses = new Array(ids_to_mint.length).fill('').map((a, i) => userAddress)
        let userBalances = await skyweaverAssetsContract.functions.balanceOfBatch(user_addresses, ids_to_mint)
        for (let i = 0; i < ids_to_mint.length; i++) {
          expect(userBalances[i]).to.be.eql(Zero)
        }
      })

      it('should not change factory gold cards balance', async () => {
        let factory_addresses = new Array(ids_to_mint.length).fill('').map((a, i) => factory)
        let factoryBalances = await skyweaverAssetsContract.functions.balanceOfBatch(factory_addresses, ids_to_mint)
        for (let i = 0; i < ids_to_mint.length; i++) {
          expect(factoryBalances[i]).to.be.eql(Zero)
        }
      })
      
      describe('Gold cards Burn Event', () => {
        let args;

        beforeEach(async () => {
          args = skyweaverAssetsContract.interface.events.TransferBatch.decode(logsBatch[1].data, logsBatch[1].topics)
        })

        it('should have factory address as `_from` field', async () => {  
          expect(args._from).to.be.eql(factory)
        })

        it('should have 0x0 as `_to` field', async () => {  
          expect(args._to).to.be.eql(ZERO_ADDRESS)
        })

        it('should have token ids as `_ids` field', async () => {  
          for (let i = 0; i < ids_to_mint.length; i++) {
            expect(args._ids[i].toNumber()).to.be.eql(ids_to_mint[i])
          }
        })

        it('should have gold_balances as `_amounts` field', async () => {  
          for (let i = 0; i < gold_balances.length; i++) {
            expect(args._amounts[i]).to.be.eql(gold_balances[i])
          }
        })
      })
    })

  })

})