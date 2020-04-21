import * as ethers from 'ethers'

import {
  AbstractContract,
  expect,
  RevertError,
  AssetRange,
  BuyCardsObj,
  getBuyHeroesData,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from 'typings/contracts/SkyweaverAssets'
import { ERC1155Mock } from 'typings/contracts/ERC1155Mock'
import { EternalHeroesFactory } from 'typings/contracts/EternalHeroesFactory'
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

contract('EternalHeroesFactory', (accounts: string[]) => {
  let ownerAddress: string
  let userAddress: string
  let operatorAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let arcadeumCoinAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let arcadeumCoinContract: ERC1155Mock
  let factoryContract: EternalHeroesFactory

  // Arcadeum Coins
  let userArcadeumCoinContract: ERC1155Mock

  // Factory manager
  let userFactoryContract: EternalHeroesFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = 15
  const purchaseAmount = new BigNumber(500) // 5, accounting for 2 decimals

  // Range values
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(500);

  // Base Token Param
  const arcID = new BigNumber(666);
  const baseTokenAmount = new BigNumber(1000000000000).mul(new BigNumber(10).pow(18))

  // Sales params
  const maxSupply = new BigNumber(300000);
  const tierSize = new BigNumber(25000);
  const priceIncrement = new BigNumber(1250).mul(new BigNumber(10).pow(16)) // 10**16 to account for decimals
  const floorPrice = new BigNumber(5000).mul(new BigNumber(10).pow(16)) // 10**16 to account for decimals

  // Arrays
  const ids = new Array(nTokenTypes).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes).fill('').map((a, i) => purchaseAmount)

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    arcadeumCoinAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    factoryAbstract = await AbstractContract.fromArtifactName('EternalHeroesFactory')
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
      floorPrice,
      tierSize,
      priceIncrement
    ]) as EternalHeroesFactory
    userFactoryContract = await factoryContract.connect(userSigner) as EternalHeroesFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, minRange, maxRange);

    // Mint Arcadeum coins to owner and user
    await arcadeumCoinContract.functions.mintMock(ownerAddress, arcID, baseTokenAmount, [])
    await arcadeumCoinContract.functions.mintMock(userAddress, arcID, baseTokenAmount, [])

    // Set max supplies
    let max_supplies = new Array(nTokenTypes).fill('').map((i) => maxSupply)
    await skyweaverAssetsContract.functions.setMaxIssuances(ids, max_supplies)
  })

  describe('Getter functions', () => {

    describe('getSkyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const address = await factoryContract.functions.getSkyweaverAssets()
        expect(address).to.be.eql(skyweaverAssetsContract.address)
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

    describe('getFloorPrice() function', () => {
      it('should return correct value', async () => {
        const val = await factoryContract.functions.getFloorPrice()
        expect(val).to.be.eql(floorPrice)
      })
    })

    describe('getTierSize() function', () => {
      it('should return correct value', async () => {
        const val = await factoryContract.functions.getTierSize()
        expect(val).to.be.eql(tierSize)
      })
    })

    describe('getPriceIncrement() function', () => {
      it('should return correct value', async () => {
        const val = await factoryContract.functions.getPriceIncrement()
        expect(val).to.be.eql(priceIncrement)
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


    it('should REVERT if supply is not set to max', async () => {
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

  describe('_buy() function', () => {
    let cost = new BigNumber(nTokenTypes).mul(floorPrice).mul(purchaseAmount)
    const expectedTiers = new Array(nTokenTypes).fill('').map((i, a) => 0)
    let buyHeroesData;

    beforeEach(async () => {
      buyHeroesData = getBuyHeroesData(userAddress, ids, amounts, expectedTiers)
      await factoryContract.functions.registerIDs(ids)
    })

    it('should PASS if caller sends enough arcs', async () => {
      const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, buyHeroesData, TX_PARAM)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if arrays are not the same length and would cause problem', async () => {
      // If expected tier is larger, then should be fine
      let data = getBuyHeroesData(userAddress, [minRange, minRange.add(1)], [purchaseAmount, purchaseAmount], [0, 0, 0])
      const tx1 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx1).to.be.fulfilled;

      // Everything else should throw
      data = getBuyHeroesData(userAddress, [minRange, minRange.add(1)], [purchaseAmount, purchaseAmount, purchaseAmount], [0, 0, 0])
      const tx2 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx2).to.be.fulfilled

      data = getBuyHeroesData(userAddress, [minRange, minRange.add(1)], [purchaseAmount, purchaseAmount, purchaseAmount], [0, 0])
      const tx3 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx3).to.be.fulfilled

      data = getBuyHeroesData(userAddress, [minRange, minRange.add(1)], [purchaseAmount], [0])
      const tx4 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx4).to.be.rejectedWith(RevertError())

      data = getBuyHeroesData(userAddress, [minRange, minRange.add(1)], [purchaseAmount], [0, 0])
      const tx5 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx5).to.be.rejectedWith(RevertError())

      data = getBuyHeroesData(userAddress, [minRange, minRange.add(1)], [purchaseAmount, purchaseAmount], [0])
      const tx6 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx6).to.be.rejectedWith(RevertError(""))
    })

    it('should send refund if too many ARCs were sent', async () => {
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, baseTokenAmount, buyHeroesData)
      let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
      let user_balance = await arcadeumCoinContract.functions.balanceOf(userAddress, arcID)
      expect(factory_balance).to.be.eql(cost);
      expect(user_balance).to.be.eql(baseTokenAmount.sub(cost));
    })

    it('should REVERT if caller does not send enough arcs', async () => {
      const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost.sub(1), buyHeroesData)
      await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
    })

    it('should REVERT if ID is not registered', async () => {
      let unreg_ids =  new Array(nTokenTypes).fill('').map((a, i) => getBig(i+1))
      unreg_ids[nTokenTypes-1] = new BigNumber(124123)
      let data = getBuyHeroesData(userAddress, unreg_ids, amounts, expectedTiers)
      const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("EternalHeroesFactory#_buy: ID_NOT_PURCHASABLE"))
    })


    it('should REVERT if IDs are not sorted', async () => {
      let data = getBuyHeroesData(userAddress, [1,2,4,6], [1, 1, 1, 1], [0, 0, 0 ,0])
      const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx).to.be.fulfilled

      let data2 = getBuyHeroesData(userAddress, [1,2,6,4], [1, 1, 1, 1], [0, 0, 0 ,0])
      const tx2 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data2, TX_PARAM)
      await expect(tx2).to.be.rejectedWith(RevertError("EternalHeroesFactory#_buy: UNSORTED_OR_DUPLICATE_TOKEN_IDS"))

      let data3 = getBuyHeroesData(userAddress, [2,1,4,6], [1, 1, 1, 1], [0, 0, 0 ,0])
      const tx3 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data3, TX_PARAM)
      await expect(tx3).to.be.rejectedWith(RevertError("EternalHeroesFactory#_buy: UNSORTED_OR_DUPLICATE_TOKEN_IDS"))
    })

    it('should skip a hero if a price tier is wrong', async () => {
      let bad_expectedTiers = new Array(nTokenTypes).fill('').map((i, a) => 0)
      bad_expectedTiers[nTokenTypes-1] = 1
      let data = getBuyHeroesData(userAddress, ids, amounts, bad_expectedTiers)
      const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx).to.be.fulfilled;
      let balance_0 = await skyweaverAssetsContract.functions.balanceOf(userAddress, ids[0])
      let balance_skip = await skyweaverAssetsContract.functions.balanceOf(userAddress, ids[nTokenTypes-1])
      expect(balance_0).to.be.eql(new BigNumber(purchaseAmount))
      expect(balance_skip).to.be.eql(new BigNumber(0))
    })

    it('should crop purchase amount if tier supply would be exceeded', async () => {
      let data_full = getBuyHeroesData(userAddress, [1, 2], [new BigNumber(1), tierSize.sub(1)], [0,0])
      const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data_full, TX_PARAM)
      await expect(tx).to.be.fulfilled

      let data = getBuyHeroesData(userAddress, [1, 2], [new BigNumber(1), tierSize.sub(1)], [0, 0])
      const tx2 = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data, TX_PARAM)
      await expect(tx2).to.be.fulfilled;

      let balance_1 = await skyweaverAssetsContract.functions.balanceOf(userAddress, 1)
      let balance_2 = await skyweaverAssetsContract.functions.balanceOf(userAddress, 2)
      expect(balance_1).to.be.eql(new BigNumber(2))
      expect(balance_2).to.be.eql(tierSize)
    })

    it('should NOT update price tier if all assets in tier are purchased but one', async () => {
      let data = getBuyHeroesData(userAddress, [2], [tierSize.sub(1)], [0])
      let pre_tier = await factoryContract.functions.getPriceTiers([2])
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data, TX_PARAM)
      let post_tier = await factoryContract.functions.getPriceTiers([2])
      expect(pre_tier[0]).to.be.eql(Zero)
      expect(post_tier[0]).to.be.eql(Zero)
    })

    it('should update price tier if all assets in tier are purchased', async () => {
      let data = getBuyHeroesData(userAddress, [2], [tierSize], [0])
      let pre_tier = await factoryContract.functions.getPriceTiers([2])
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data, TX_PARAM)
      let post_tier = await factoryContract.functions.getPriceTiers([2])
      expect(pre_tier[0]).to.be.eql(Zero)
      expect(post_tier[0]).to.be.eql(new BigNumber(1))
    })

    it('should update price tier if all assets in tier are purchased and one', async () => {
      let data = getBuyHeroesData(userAddress, [2], [tierSize], [0])
      let pre_tier = await factoryContract.functions.getPriceTiers([2])
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data, TX_PARAM)

      let data2 = getBuyHeroesData(userAddress, [2], [1], [1])
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data2, TX_PARAM)
      let post_tier = await factoryContract.functions.getPriceTiers([2])
      expect(pre_tier[0]).to.be.eql(Zero)
      expect(post_tier[0]).to.be.eql(new BigNumber(1))
    })

    it('should update price if all assets in tier are purchased', async () => {
      let data = getBuyHeroesData(userAddress, [2], [tierSize], [0])
      let pre_tier = await factoryContract.functions.getPrices([2])
      await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, tierSize.mul(floorPrice), data, TX_PARAM)
      let post_tier = await factoryContract.functions.getPrices([2])
      expect(pre_tier[0]).to.be.eql(floorPrice)
      expect(post_tier[0]).to.be.eql(floorPrice.add(priceIncrement))

      let amounts_left = await factoryContract.functions.getSuppliesCurrentTier([2])
      expect(amounts_left.tiers[0]).to.be.eql(new BigNumber(1))
      expect(amounts_left.supplies[0]).to.be.eql(tierSize)
    })

    it('should get correct amount if all assets are sold', async () => {
      const n_tiers = maxSupply.div(tierSize).sub(1)
      const a = floorPrice.mul(n_tiers.add(1))
      const b = (priceIncrement.mul(n_tiers).mul(n_tiers.add(1))).div(2)
      const k = tierSize.mul(nTokenTypes)
      const expected_revenue = k.mul(a.add(b))
      let full_amounts = new Array(nTokenTypes).fill('').map((a, i) => tierSize)

      for (let i = 0; i <= n_tiers.toNumber(); i++){
        let cost = ((floorPrice.add(priceIncrement.mul(i))).mul(tierSize)).mul(nTokenTypes)
        let expected_tiers = new Array(nTokenTypes).fill('').map((k) => i)
        let full_data = getBuyHeroesData(userAddress, ids, full_amounts, expected_tiers)
        await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, full_data, TX_PARAM)
      }

      // Double check all assets were purchased up to max supply
      let supplies = await skyweaverAssetsContract.functions.getCurrentIssuances(ids)
      for (let i = 0; i < ids.length; i++){
        expect(supplies[i]).to.be.eql(maxSupply)
      }

      const revenue = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
      expect(revenue).to.be.eql(expected_revenue)
    })

    it('should REVERT if an asset exceeds max supply', async () => {
      const n_tiers = maxSupply.div(tierSize).sub(1)
      let full_amounts = new Array(nTokenTypes).fill('').map((a, i) => tierSize)

      for (let i = 0; i <= n_tiers.toNumber(); i++){
        let cost = ((floorPrice.add(priceIncrement.mul(i))).mul(tierSize)).mul(nTokenTypes)
        let expected_tiers = new Array(nTokenTypes).fill('').map((k) => i)
        let full_data = getBuyHeroesData(userAddress, ids, full_amounts, expected_tiers)
        await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, full_data, TX_PARAM)
      }

      let supplies = await skyweaverAssetsContract.functions.getCurrentIssuances(ids)
      // Check if indeed max supply is reached
      for (let i =0; i < nTokenTypes; i++){
        expect(supplies[i]).to.be.eql(maxSupply)
      }
      let data = getBuyHeroesData(userAddress, [ids[0]], [new BigNumber(1)], [n_tiers.add(1)])
      let tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, data, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: MAX_ISSUANCE_EXCEEDED"))
    })
  
    context('Using safeBatchTransferFrom', () => {
      it('should PASS if caller sends enough arcs', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], buyHeroesData, TX_PARAM)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if caller does not send enough arcs', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost.sub(1)], buyHeroesData)
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      })

      it('should REVERT if batch transfer contains multiple assets', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID, arcID], [cost, 0], buyHeroesData, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("EternalHeroesFactory#onERC1155BatchReceived: INVALID_BATCH_TRANSFER"))
      })

      it('should REVERT if batch transfer contains no assets', async () => {
        const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [], [], buyHeroesData, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("EternalHeroesFactory#onERC1155BatchReceived: INVALID_BATCH_TRANSFER"))
      })
    })

    context('When cards were purchased', () => {
      let logs;
      beforeEach(async () => {
        await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, buyHeroesData, {gasLimit: 2000000})
        let filter = factoryContract.filters.AssetsPurchased(null, null, null, null);
        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filter.fromBlock = 0;
        logs = await operatorProvider.getLogs(filter);
      })

      it('should update factory Arcadeum coin balance', async () => {
        let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
        expect(factory_balance).to.be.eql(cost);
      })

      it('should update heroes supplies', async () => {
        let supplies = await skyweaverAssetsContract.functions.getCurrentIssuances(ids)
        for (let i = 0; i < supplies.length; i++) {
          expect(supplies[i]).to.be.eql(purchaseAmount)
        }
      })

      it('should update heroes amount left in tier', async () => {
        let amounts_left = await factoryContract.functions.getSuppliesCurrentTier(ids)
        for (let i = 0; i < amounts_left.tiers.length; i++) {
          expect(amounts_left.tiers[i]).to.be.eql(Zero)
          expect(amounts_left.supplies[i]).to.be.eql(tierSize.sub(purchaseAmount))
        }
      })

      it('should update user silver cards balance', async () => {
        let user_addresses = new Array(nTokenTypes).fill('').map((a, i) => userAddress)
        let userBalances = await skyweaverAssetsContract.functions.balanceOfBatch(user_addresses, ids)
        for (let i = 0; i < ids.length; i++) {
          expect(userBalances[i]).to.be.eql(new BigNumber(amounts[i]))
        }
      })

      it('should emit AssetsPurchased event', async () => {
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.AssetsPurchased.topic)
      })

      describe('AssetsPurchased Event', () => {
        let args;

        beforeEach(async () => {
          args = factoryContract.interface.events.AssetsPurchased.decode(logs[0].data, logs[0].topics)
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
    const n_tiers = maxSupply.div(tierSize).sub(1)
    const a = floorPrice.mul(n_tiers.add(1))
    const b = (priceIncrement.mul(n_tiers).mul(n_tiers.add(1))).div(2)
    const k = tierSize.mul(nTokenTypes)
    const expected_revenue = k.mul(a.add(b))

    beforeEach(async () => {
      await factoryContract.functions.registerIDs(ids)

      // Will buy all assets possible
      let full_amounts = new Array(nTokenTypes).fill('').map((a, i) => tierSize)

      for (let i = 0; i <= n_tiers.toNumber(); i++) {
        let cost = ((floorPrice.add(priceIncrement.mul(i))).mul(tierSize)).mul(nTokenTypes)
        let expected_tiers = new Array(nTokenTypes).fill('').map((k) => i)
        let full_data = getBuyHeroesData(userAddress, ids, full_amounts, expected_tiers)
        await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, full_data, TX_PARAM)
      }
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
      expect(owner_balance).to.be.eql(baseTokenAmount.add(expected_revenue));
    })

    it("should pass if any recipient", async () => {
      const tx = factoryContract.functions.withdraw(ownerAddress)
      await expect(tx).to.be.fulfilled
    })

    it("should REVERT if recipient is 0x0", async () => {
      const tx = factoryContract.functions.withdraw(ZERO_ADDRESS)
      await expect(tx).to.be.rejectedWith(RevertError("EternalHeroesFactory#withdraw: INVALID_RECIPIENT"))
    })

  })
})