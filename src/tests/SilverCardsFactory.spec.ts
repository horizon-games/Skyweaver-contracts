import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  AssetRange,
  BuyCardsObj,
  getBuyCardsData,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from 'typings/contracts/SkyweaverAssets'
import { ERC1155Mock } from 'typings/contracts/ERC1155Mock'
import { SilverCardsFactory } from 'typings/contracts/SilverCardsFactory'
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

contract('SilverCardsFactory', (accounts: string[]) => {
  let ownerAddress: string
  let userAddress: string
  let operatorAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let arcadeumCoinAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let arcadeumCoinContract: ERC1155Mock
  let factoryContract: SilverCardsFactory

  // Arcadeum Coins
  let userArcadeumCoinContract: ERC1155Mock

  // Factory manager
  let userFactoryContract: SilverCardsFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = 30 
  const nTokensPerType = 5

  // Range values 
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(500);

  // Base Token Param
  const arcID = new BigNumber(666);
  const baseTokenAmount = new BigNumber(10000000).mul(new BigNumber(10).pow(18))
  const price = new BigNumber(100).mul(new BigNumber(10).pow(18))

  // Arrays
  const ids = new Array(nTokenTypes).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes).fill('').map((a, i) => nTokensPerType)

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    arcadeumCoinAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    factoryAbstract = await AbstractContract.fromArtifactName('SilverCardsFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Arcadeum Coins
    arcadeumCoinContract = await arcadeumCoinAbstract.deploy(ownerWallet) as ERC1155Mock
    userArcadeumCoinContract = await arcadeumCoinContract.connect(userSigner) as ERC1155Mock

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      arcadeumCoinContract.address,
      arcID,
      price
    ]) as SilverCardsFactory
    userFactoryContract = await factoryContract.connect(userSigner) as SilverCardsFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, minRange, maxRange);

    // Mint Arcadeum coins to owner and user
    await arcadeumCoinContract.functions.mintMock(ownerAddress, arcID, baseTokenAmount, [])
    await arcadeumCoinContract.functions.mintMock(userAddress, arcID, baseTokenAmount, [])
  })

  describe('Getter functions', () => {
    describe('getFactoryManager() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.functions.getFactoryManager()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
      })
    })

    describe('getArcadeumCoin() function', () => {
      it('should return arcadeum coin contract contract address', async () => {
        const token_address = await factoryContract.functions.getArcadeumCoin()
        expect(token_address).to.be.eql(arcadeumCoinContract.address)
      })
    })

    describe('getArcadeumCoinID() function', () => {
      it('should return correct arcadeum coin ID', async () => {
        const token_id = await factoryContract.functions.getArcadeumCoinID()
        expect(token_id).to.be.eql(arcID)
      })
    })

    describe('getCardPrice() function', () => {
      it('should return correct card price', async () => {
        const card_price = await factoryContract.functions.getCardPrice()
        expect(card_price).to.be.eql(price)
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
    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids)
    })

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.deregisterIDs(ids)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.deregisterIDs(ids)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When tokens were deRegistered', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.deregisterIDs(ids)
      })

      it('should set token ids to not registered', async () => {
        let statuses = await factoryContract.functions.getPurchasableStatus(ids);
        for (let i = 0; i < statuses.length; i++){
          expect(statuses[i]).to.be.eql(false)
        }
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
          expect(args.ids.length).to.be.eql(ids.length)
        })
      })
    })
  })

  describe('updateCardPrice() function', () => {
    let newPrice = price.mul(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateCardPrice(newPrice)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateCardPrice(newPrice)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if new price is too low', async () => {
      const tx = factoryContract.functions.updateCardPrice(10000000)
      await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#updateCardPrice: INVALID_PRICE"))
    })

    context('When tokens were deRegistered', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateCardPrice(newPrice)
      })

      it('should set price to new price', async () => {
        let returned_price = await factoryContract.functions.getCardPrice();
        expect(returned_price).to.be.eql(newPrice)
      })

      it('should emit CardPriceChange event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.CardPriceChange(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.CardPriceChange.topic)
      })
      
      describe('CardPriceChange Event', () => {
        it('should have old price as `oldPrice` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldPrice).to.be.eql(price)
        })
        it('should have old price as `newPrice` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newPrice).to.be.eql(newPrice)
        })
      })
    })
  })

  describe('_buy() function', () => {
    let cost = new BigNumber(nTokenTypes).mul(price).mul(nTokensPerType)
    let buyCardsData;

    beforeEach(async () => {
      buyCardsData = getBuyCardsData(userAddress, ids, amounts)
      await factoryContract.functions.registerIDs(ids)
    })

    context('Using safeTransferFrom', () => {
      it('should PASS if caller sends enough arcs', async () => {
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, buyCardsData, TX_PARAM)
        await expect(tx).to.be.fulfilled
      })

      it('should send refund if too many ARCs were sent', async () => {
        await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, baseTokenAmount, buyCardsData, TX_PARAM)
        let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
        let user_balance = await arcadeumCoinContract.functions.balanceOf(userAddress, arcID)
        expect(factory_balance).to.be.eql(cost);
        expect(user_balance).to.be.eql(baseTokenAmount.sub(cost));
      })

      it('should REVERT if arrays are not the same length', async () => {
        let data = getBuyCardsData(userAddress, [minRange, minRange.add(1)], [nTokensPerType, nTokensPerType, nTokensPerType])
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("ERC1155MintBurnPackedBalance#_batchMint: INVALID_ARRAYS_LENGTH"))

        data = getBuyCardsData(userAddress, [minRange, minRange.add(1)], [nTokensPerType])
        const tx2 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
        await expect(tx2).to.be.rejected;
      })

      it('should REVERT if caller does not send enough arcs', async () => {
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost.sub(1), buyCardsData, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      })

      it('should REVERT if caller tries to overflow the total quantity of cards to buy', async () => {
        let maxVal = new BigNumber(2).pow(256).sub(1)
        let data = getBuyCardsData(userAddress, [minRange, minRange.add(1)], [maxVal, new BigNumber(1)])
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#add: OVERFLOW"))
      })

      it('should REVERT if caller tries to overflow the total cost to buy', async () => {
        let max_val = new BigNumber(2).pow(256)
        let overflow_cost_amount = max_val.div(price).add(1)
        let maxVal = new BigNumber(2).pow(256).sub(1)
        let data = getBuyCardsData(userAddress, [minRange], [overflow_cost_amount])
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#mul: OVERFLOW"))
      })

      it('should REVERT if ID is not registered', async () => {
        let data = getBuyCardsData(userAddress, [maxRange.add(1)], [amounts[0]])
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, price, data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#_buy: ID_NOT_PURCHASABLE"))
      })

      it('should REVERT if at least one of the IDs is not registered', async () => {
        let data = getBuyCardsData(userAddress, [minRange.add(1), maxRange.add(1)], [amounts[0], amounts[0]])
        const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, price.mul(amounts[0]).mul(2), data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#_buy: ID_NOT_PURCHASABLE"))
      })
    })

    context('Using safeBatchTransferFrom', () => {
      it('should PASS if caller sends enough arcs', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], buyCardsData, TX_PARAM)
        await expect(tx).to.be.fulfilled
      })

      it('should send refund if too many ARCs were sent', async () => {
        await userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [baseTokenAmount], buyCardsData, TX_PARAM)
        let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
        let user_balance = await arcadeumCoinContract.functions.balanceOf(userAddress, arcID)
        expect(factory_balance).to.be.eql(cost);
        expect(user_balance).to.be.eql(baseTokenAmount.sub(cost));
      })

      it('should REVERT if arrays are not the same length', async () => {
        let data = getBuyCardsData(userAddress, [minRange, minRange.add(1)], [nTokensPerType, nTokensPerType, nTokensPerType])
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("ERC1155MintBurnPackedBalance#_batchMint: INVALID_ARRAYS_LENGTH"))

        data = getBuyCardsData(userAddress, [minRange, minRange.add(1)], [nTokensPerType])
        const tx2 = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], data, TX_PARAM)
        await expect(tx2).to.be.rejected;
      })

      it('should REVERT if caller does not send enough arcs', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost.sub(1)], buyCardsData, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      })

      it('should REVERT if caller tries to overflow the total quantity of cards to buy', async () => {
        let maxVal = new BigNumber(2).pow(256).sub(1)
        let data = getBuyCardsData(userAddress, [minRange, minRange.add(1)], [maxVal, new BigNumber(1)])
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#add: OVERFLOW"))
      })

      it('should REVERT if caller tries to overflow the total cost to buy', async () => {
        let max_val = new BigNumber(2).pow(256)
        let overflow_cost_amount = max_val.div(price).add(1)
        let maxVal = new BigNumber(2).pow(256).sub(1)
        let data = getBuyCardsData(userAddress, [minRange], [overflow_cost_amount])
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#mul: OVERFLOW"))
      })

      it('should REVERT if ID is not registered', async () => {
        let data = getBuyCardsData(userAddress, [maxRange.add(1)], [amounts[0]])
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [price], data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#_buy: ID_NOT_PURCHASABLE"))
      })

      it('should REVERT if at least one of the IDs is not registered', async () => {
        let data = getBuyCardsData(userAddress, [minRange.add(1), maxRange.add(1)], [amounts[0], amounts[0]])
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [price.mul(amounts[0]).mul(2)], data, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#_buy: ID_NOT_PURCHASABLE"))
      })

      it('should REVERT if batch transfer contains multiple assets', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID, arcID], [cost, 0], buyCardsData, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#onERC1155BatchReceived: INVALID_BATCH_TRANSFER"))
      })

      it('should REVERT if batch transfer contains no assets', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [], [], buyCardsData, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#onERC1155BatchReceived: INVALID_BATCH_TRANSFER"))
      })
    })

    context('When cards were purchased', () => {
      let logs;
      beforeEach(async () => {
        await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, buyCardsData, TX_PARAM)
        let filter = factoryContract.filters.CardsPurchased(null, null, null, null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filter.fromBlock = 0;
        logs = await operatorProvider.getLogs(filter);
      })

      it('should update factory Arcadeum coin balance', async () => {
        let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
        expect(factory_balance).to.be.eql(cost);
      })

      it('should update user silver cards balance', async () => {
        let user_addresses = new Array(nTokenTypes).fill('').map((a, i) => userAddress)
        let userBalances = await skyweaverAssetsContract.functions.balanceOfBatch(user_addresses, ids)
        for (let i = 0; i < ids.length; i++) {
          expect(userBalances[i]).to.be.eql(new BigNumber(amounts[i]))
        }
      })

      it('should emit CardsPurchased event', async () => {
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.CardsPurchased.topic)
      })
      
      describe('CardsPurchased Event', () => {
        let args;

        beforeEach(async () => {
          args = factoryContract.interface.events.CardsPurchased.decode(logs[0].data, logs[0].topics)
        })

        it('should have user address as `recipient` field', async () => {  
          expect(args.recipient).to.be.eql(userAddress)
        })

        it('should have token ids as `tokensBoughtIds` field', async () => {  
          expect(args.tokensBoughtIds.length).to.be.eql(ids.length)
          expect(args.tokensBoughtIds[0]).to.be.eql(ids[0])
        })

        it('should have purchase amounts as `tokensBoughtAmounts` field', async () => {  
          expect(args.tokensBoughtAmounts.length).to.be.eql(amounts.length)
          expect(args.tokensBoughtAmounts[0]).to.be.eql(new BigNumber(amounts[0]))
        })

        it('should have cost as `totalCost` field', async () => {  
          expect(args.totalCost).to.be.eql(cost)
        })
      })
    })
  })

  describe('withdraw() function', () => {
    let cost = new BigNumber(nTokenTypes).mul(price).mul(nTokensPerType)
    let buyCardsData;

    beforeEach(async () => {
      buyCardsData = getBuyCardsData(userAddress, ids, amounts)
      await factoryContract.functions.registerIDs(ids)
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, buyCardsData, TX_PARAM)
    })

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.withdraw(ownerAddress)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.withdraw(ownerAddress)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it("should update factory's Arcadeum coin balance", async () => {
      await factoryContract.functions.withdraw(ownerAddress)
      let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
      expect(factory_balance).to.be.eql(Zero);
    })

    it("should update owner's Arcadeum coin balance", async () => {
      await factoryContract.functions.withdraw(ownerAddress)
      let owner_balance = await arcadeumCoinContract.functions.balanceOf(ownerAddress, arcID)
      expect(owner_balance).to.be.eql(baseTokenAmount.add(cost));
    })

    it("should pass if any recipient", async () => {
      const tx = factoryContract.functions.withdraw(ownerAddress)
      await expect(tx).to.be.fulfilled
    })

    it("should REVERT if recipient is 0x0", async () => {
      const tx = factoryContract.functions.withdraw(ZERO_ADDRESS)
      await expect(tx).to.be.rejectedWith(RevertError("SilverCardsFactory#withdraw: INVALID_RECIPIENT"))
    })

  })
})