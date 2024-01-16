import * as ethers from 'ethers'

import { AbstractContract, expect, RevertError, ZERO_ADDRESS } from './utils'

import * as utils from './utils'

import { SkyweaverAssets, VariantRewardFactory } from 'src/gen/typechain'

import { BigNumber } from 'ethers'

import { web3 } from 'hardhat'

// init test wallets from package.json mnemonic

const { wallet: subOwnerWallet, provider: subOwnerProvider, signer: subOwnerSigner } = utils.createTestWallet(web3, 0)

const { wallet: ownerWallet, provider: ownerProvider, signer: ownerSigner } = utils.createTestWallet(web3, 1)

const { wallet: userWallet, provider: userProvider, signer: userSigner } = utils.createTestWallet(web3, 2)

const { wallet: operatorWallet, provider: operatorProvider, signer: operatorSigner } = utils.createTestWallet(web3, 3)

const { wallet: randomWallet, provider: randomProvider, signer: randomSigner } = utils.createTestWallet(web3, 4)

const getBig = (id: number) => BigNumber.from(id)

const MAX_2BYTE = 2 ** 16 - 1
const encodeTokenID = (itemID: number, itemType: number, variantID: number, variantType: number) => {
  return BigNumber.from(itemID)
    .or(BigNumber.from(itemType).shl(16))
    .or(BigNumber.from(variantID).shl(24))
    .or(BigNumber.from(variantType).shl(40))
}

// Note this test is a clone of ExclusiveRewardFactory.spec.ts with "batchMint" updated to support token id validation and whitelist removed

describe('VariantRewardFactory', () => {
  let ownerAddress: string
  let subOwnerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: VariantRewardFactory

  // Factory manager
  let userFactoryContract: VariantRewardFactory
  let subOwnerFactoryContract: VariantRewardFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = { gasLimit: 2000000 }

  // Token Param
  const SUPPORTED_ITEM_TYPE = 16
  const BIG_ONE = BigNumber.from(1)

  // Range values
  const startTime = BigNumber.from(Math.floor(Date.now() / 1000))
  const endTime = BigNumber.from(startTime.add(60 * 60 * 24)) // 24 hour from now

  // Base Token Param
  const periodMintLimit = BigNumber.from(10)
  const periodLength = BigNumber.from(60)
    .mul(60)
    .mul(6) // 6 hours

  // Arrays
  // Test boundaries for supported token id parts
  const ids: BigNumber[] = []
  ;[0, 10, MAX_2BYTE].forEach(itemID => {
    ;[0, 10, MAX_2BYTE].forEach(variantID => {
      ;[0, 10, MAX_2BYTE].forEach(variantType => {
        ids.push(encodeTokenID(itemID, SUPPORTED_ITEM_TYPE, variantID, variantType))
      })
    })
  })

  let factory

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    subOwnerAddress = await subOwnerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    factoryAbstract = await AbstractContract.fromArtifactName('VariantRewardFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = (await skyweaverAssetsAbstract.deploy(ownerWallet, [ownerAddress])) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy factory
    factoryContract = (await factoryAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
      periodLength,
      periodMintLimit,
      SUPPORTED_ITEM_TYPE
    ])) as VariantRewardFactory
    userFactoryContract = (await factoryContract.connect(userSigner)) as VariantRewardFactory
    subOwnerFactoryContract = (await factoryContract.connect(subOwnerSigner)) as VariantRewardFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.activateFactory(factory)
    await skyweaverAssetsContract.addMintPermission(
      factory,
      0,
      encodeTokenID(MAX_2BYTE, SUPPORTED_ITEM_TYPE, MAX_2BYTE, MAX_2BYTE),
      startTime,
      endTime
    )

    // Set subOwner to ownership tier 1
    await factoryContract.assignOwnership(subOwnerAddress, 1)
  })

  describe('Getter functions', () => {
    describe('skyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.skyweaverAssets()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
      })
    })

    describe('periodMintLimit() function', () => {
      it('should return the mint entry ratio', async () => {
        const ratio = await factoryContract.periodMintLimit()
        expect(ratio).to.be.eql(periodMintLimit)
      })
    })

    describe('getAvailableSupply() function', () => {
      it('should return current available supply', async () => {
        const supply = await factoryContract.getAvailableSupply()
        expect(supply).to.be.eql(periodMintLimit)
      })
    })

    describe('supportsInterface()', () => {
      it('should return true for 0x01ffc9a7 (ERC165)', async () => {
        const support = await factoryContract.supportsInterface('0x01ffc9a7')
        expect(support).to.be.eql(true)
      })

      it('should return FALSE for 0x4e2312e0 (ERC1155Receiver)', async () => {
        const support = await factoryContract.supportsInterface('0x4e2312e0')
        expect(support).to.be.eql(false)
      })
    })
  })

  describe('updatePeriodMintLimit() function', () => {
    let newPeriodLimit = periodMintLimit.div(2)

    it('should PASS if caller is super owner', async () => {
      const tx = factoryContract.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is sub owner', async () => {
      const tx = subOwnerFactoryContract.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.rejectedWith(RevertError('TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW'))
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.rejectedWith(RevertError('TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW'))
    })

    context('When periodMintLimit was updated', () => {
      let tx
      beforeEach(async () => {
        tx = await factoryContract.updatePeriodMintLimit(newPeriodLimit)
      })

      it('should set periodMintLimit to new periodMintLimit', async () => {
        let returned_value = await factoryContract.periodMintLimit()
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should set availableSupply to new periodMintLimit if higher', async () => {
        let returned_value = await factoryContract.getAvailableSupply()
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should not set availableSupply to new periodMintLimit if lower', async () => {
        await factoryContract.updatePeriodMintLimit(periodMintLimit)
        let returned_value = await factoryContract.getAvailableSupply()
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should emit PeriodMintLimitChange event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.PeriodMintLimitChanged(null, null)

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0
        let logs = await operatorProvider.getLogs(filterFromOperatorContract)
        expect(logs[0].topics[0]).to.be.eql(
          factoryContract.interface.getEventTopic(factoryContract.interface.events['PeriodMintLimitChanged(uint256,uint256)'])
        )
      })

      describe('PeriodMintLimitChanged Event', () => {
        it('should have old value as `oldMintingLimit` field', async () => {
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldMintingLimit).to.be.eql(periodMintLimit)
        })
        it('should have new value as `newMintingLimit` field', async () => {
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newMintingLimit).to.be.eql(newPeriodLimit)
        })
      })
    })
  })

  describe('updatePeriodMintLimit() function', () => {
    let newPeriodLimit = periodMintLimit.div(2)

    it('should PASS if caller is super owner', async () => {
      const tx = factoryContract.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is sub owner', async () => {
      const tx = subOwnerFactoryContract.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.rejectedWith(RevertError('TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW'))
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.rejectedWith(RevertError('TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW'))
    })

    context('When periodMintLimit was updated', () => {
      let tx
      beforeEach(async () => {
        tx = await factoryContract.updatePeriodMintLimit(newPeriodLimit)
      })

      it('should set periodMintLimit to new periodMintLimit', async () => {
        let returned_value = await factoryContract.periodMintLimit()
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should set availableSupply to new periodMintLimit if higher', async () => {
        let returned_value = await factoryContract.getAvailableSupply()
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should not set availableSupply to new periodMintLimit if lower', async () => {
        await factoryContract.updatePeriodMintLimit(periodMintLimit)
        let returned_value = await factoryContract.getAvailableSupply()
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should emit PeriodMintLimitChange event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.PeriodMintLimitChanged(null, null)

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0
        let logs = await operatorProvider.getLogs(filterFromOperatorContract)
        expect(logs[0].topics[0]).to.be.eql(
          factoryContract.interface.getEventTopic(factoryContract.interface.events['PeriodMintLimitChanged(uint256,uint256)'])
        )
      })

      describe('PeriodMintLimitChanged Event', () => {
        it('should have old value as `oldMintingLimit` field', async () => {
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldMintingLimit).to.be.eql(periodMintLimit)
        })
        it('should have new value as `newMintingLimit` field', async () => {
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newMintingLimit).to.be.eql(newPeriodLimit)
        })
      })
    })
  })

  describe('batchMint()', () => {
    let mintIds = ids.slice(0, 4)
    let mintIds2 = ids.slice(4, 8)
    let mintAmounts = [1, 1, 1, 1]

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if caller is subowner', async () => {
      const tx = subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
      await expect(tx).to.be.rejectedWith(RevertError('TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW'))
    })

    it('should REVERT if token id does not have supported item type', async () => {
      const random4Byte = () => Math.floor(Math.random() * (2 ** 32 - 1))
      const txs: Promise<ethers.ContractTransaction>[] = []
      for (let i; i < 100; i++) {
        // Do it a bunch of times for fuzzing
        let unsupported = Math.floor(Math.random() * (2 ** 8 - 1))
        if (unsupported == SUPPORTED_ITEM_TYPE) {
          unsupported = 0
        }
        const invalidIds = [encodeTokenID(random4Byte(), unsupported, random4Byte(), random4Byte())]
        txs.push(subOwnerFactoryContract.batchMint(userAddress, invalidIds, [BIG_ONE], []))
      }
      // Check each promise is rejected
      await Promise.all(
        txs.map(tx => expect(tx).to.be.rejectedWith(RevertError('VariantRewardFactory#batchMint: INVALID_TOKEN_ID')))
      )
    })

    it.only('should PASS for all valid ids set in test suite', async () => {
      await (await factoryContract.updatePeriodMintLimit(BigNumber.from(ids.length + 1))).wait()
      let sixHours = BigNumber.from(60)
        .mul(60)
        .mul(6)
      await ownerProvider.send('evm_increaseTime', [sixHours.toNumber()])
      await ownerProvider.send('evm_mine', [])
      const available_supply = await subOwnerFactoryContract.getAvailableSupply()
      expect(available_supply.toNumber()).to.be.eql(ids.length + 1)
      const amounts = new Array(ids.length).fill(BIG_ONE)
      const tx = subOwnerFactoryContract.batchMint(userAddress, ids, amounts, [])
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if trying to mint exactly the available supply', async () => {
      const available_supply = await subOwnerFactoryContract.getAvailableSupply()
      const token_ids = ids.slice(-available_supply.toNumber())
      const amounts = new Array(token_ids.length).fill(BIG_ONE)
      const tx = subOwnerFactoryContract.batchMint(userAddress, token_ids, amounts, [])
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if trying to mint more than current supply', async () => {
      const available_supply = await subOwnerFactoryContract.getAvailableSupply()
      const overSupply = available_supply.add(1).toNumber()
      const token_ids = ids.slice(-overSupply)
      const amounts = new Array(token_ids.length).fill(BIG_ONE)
      const tx = subOwnerFactoryContract.batchMint(userAddress, token_ids, amounts, [])
      await expect(tx).to.be.rejectedWith(RevertError('SafeMath#sub: UNDERFLOW'))
    })

    it('should REVERT if trying to mint more than 1', async () => {
      const token_ids = ids.slice(0, 3)
      const amounts = new Array(token_ids.length).fill(getBig(2))
      const tx = subOwnerFactoryContract.batchMint(userAddress, token_ids, amounts, [])
      await expect(tx).to.be.rejectedWith(RevertError('VariantRewardFactory#batchMint: NON_EXCLUSIVE_MINTING'))
    })

    context('When cards were minted', () => {
      let expected_supply
      beforeEach(async () => {
        const available_supply = await factoryContract.getAvailableSupply()
        expected_supply = available_supply.sub(mintAmounts.reduce((a, b) => a + b, 0))
        await subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
      })

      it('should update availableSupply', async () => {
        const supply = await factoryContract.getAvailableSupply()
        expect(supply).to.be.eql(expected_supply)
      })

      it('should be able to mint more assets in the same period', async () => {
        let tx = subOwnerFactoryContract.batchMint(randomAddress, mintIds2, mintAmounts, [])
        await expect(tx).to.be.fulfilled
      })

      it('should not be able to exceed minting limit for this period with second mint tx', async () => {
        const token_ids = ids.slice(-(expected_supply.toNumber() + 1))
        const amounts = new Array(token_ids.length).fill(BIG_ONE)
        let tx = subOwnerFactoryContract.batchMint(randomAddress, token_ids, amounts, [])
        await expect(tx).to.be.rejectedWith(RevertError('SafeMath#sub: UNDERFLOW'))
      })

      it('should not allow minting of same ids', async () => {
        const tx = subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
        await expect(tx).to.be.rejectedWith(RevertError('VariantRewardFactory#batchMint: ID_ALREADY_MINTED'))
      })

      it('should update user silver cards balance', async () => {
        let n_ids = mintIds.length
        let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
        let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, mintIds)
        for (let i = 0; i < n_ids; i++) {
          expect(userBalances[i]).to.be.eql(BigNumber.from(mintAmounts[i]))
        }
      })

      it('should refresh availableSupply with new period', async () => {
        // Check current supply
        let current_period = await factoryContract.livePeriod()
        let supply = await factoryContract.getAvailableSupply()
        expect(supply).to.be.eql(expected_supply)

        // Move forward by 6 hours
        let sixHours = BigNumber.from(60)
          .mul(60)
          .mul(6)
        let snapshot = await ownerProvider.send('evm_snapshot', [])
        await ownerProvider.send('evm_increaseTime', [sixHours.toNumber()])
        await ownerProvider.send('evm_mine', [])

        // Get new supply for current period
        let new_period = await factoryContract.livePeriod()
        supply = await factoryContract.getAvailableSupply()
        expect(new_period).to.be.eql(current_period.add(1))
        expect(supply).to.be.eql(periodMintLimit)

        // Try mint during new period
        const tx2 = subOwnerFactoryContract.batchMint(userAddress, mintIds2, mintAmounts, [])
        await expect(tx2).to.be.fulfilled

        // Revert time to expected timestamp
        await ownerProvider.send('evm_revert', [snapshot])
      })
    })
  })
})
