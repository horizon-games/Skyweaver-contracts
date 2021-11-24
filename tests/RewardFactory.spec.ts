import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'

import { 
  SkyweaverAssets,
  RewardFactory
} from 'src/gen/typechain'

import { BigNumber } from 'ethers'

import { web3 } from 'hardhat'

// init test wallets from package.json mnemonic

const {
  wallet: subOwnerWallet,
  provider: subOwnerProvider,
  signer: subOwnerSigner
} = utils.createTestWallet(web3, 0)

const {
  wallet: ownerWallet,
  provider: ownerProvider,
  signer: ownerSigner
} = utils.createTestWallet(web3, 1)


const {
  wallet: userWallet,
  provider: userProvider,
  signer: userSigner
} = utils.createTestWallet(web3, 2)

const {
  wallet: operatorWallet,
  provider: operatorProvider,
  signer: operatorSigner
} = utils.createTestWallet(web3, 3)

const {
  wallet: randomWallet,
  provider: randomProvider,
  signer: randomSigner
} = utils.createTestWallet(web3, 4)

const getBig = (id: number) => BigNumber.from(id);

describe('RewardFactory', () => {
  let ownerAddress: string
  let subOwnerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: RewardFactory

  // Factory manager
  let userFactoryContract: RewardFactory
  let subOwnerFactoryContract: RewardFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = BigNumber.from(30) 
  const nTokensPerType = BigNumber.from(50000)

  // Range values 
  const minRange = BigNumber.from(1);
  const maxRange = BigNumber.from(500);
  const startTime = BigNumber.from(Math.floor(Date.now() / 1000))
  const endTime = BigNumber.from(startTime.add(60*60*24)) // 24 hour from now

  // Base Token Param
  const periodMintLimit = BigNumber.from(100000)
  const periodLength = BigNumber.from(60).mul(60).mul(6) // 6 hours

  // Arrays
  const ids = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => nTokensPerType)

  let factory;
  
  // Environment conditions
  let conditions = [
    ['Factory without Whitelist', 1],
    ['Whitelisted Factory', 2]
  ]
  
  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    subOwnerAddress = await subOwnerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    factoryAbstract = await AbstractContract.fromArtifactName('RewardFactory')
  })

  conditions.forEach(function(condition) {
    context(condition[0] as string, () => {

      // deploy before each test, to reset state of contract
      beforeEach(async () => {
        // Deploy Skyweaver Assets Contract
        skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet, [ownerAddress]) as SkyweaverAssets
        userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

        // Deploy silver card factory
        factoryContract = await factoryAbstract.deploy(ownerWallet, [
          ownerAddress,
          skyweaverAssetsContract.address,
          periodLength,
          periodMintLimit,
          condition[1] == 1 ? false : true
        ]) as RewardFactory
        userFactoryContract = await factoryContract.connect(userSigner) as RewardFactory
        subOwnerFactoryContract = await factoryContract.connect(subOwnerSigner) as RewardFactory

        // Assing vars
        factory = factoryContract.address

        // Activate factory and authorize it
        await skyweaverAssetsContract.activateFactory(factory);
        await skyweaverAssetsContract.addMintPermission(factory, minRange, maxRange, startTime, endTime);

        // Let owner be a "factory" to mint silver cards to test conquest
        await skyweaverAssetsContract.activateFactory(ownerAddress);
        await skyweaverAssetsContract.addMintPermission(ownerAddress, 0, 666, startTime, endTime);

        // Set subOwner to ownership tier 1
        await factoryContract.assignOwnership(subOwnerAddress, 1)

        // Mint silver cards to user
        await skyweaverAssetsContract.batchMint(userAddress, ids, amounts, [])

        // Whitelist ids if whitelist is present
        if (condition[1] == 2) {
          await factoryContract.enableMint(ids);
        }
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
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        it('should REVERT if caller is not owner', async () => {
          const tx = userFactoryContract.updatePeriodMintLimit(newPeriodLimit)
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        context('When periodMintLimit was updated', () => {
          let tx;
          beforeEach(async () => {
            tx = await factoryContract.updatePeriodMintLimit(newPeriodLimit)
          })

          it('should set periodMintLimit to new periodMintLimit', async () => {
            let returned_value = await factoryContract.periodMintLimit();
            expect(returned_value).to.be.eql(newPeriodLimit)
          })

          it('should set availableSupply to new periodMintLimit if higher', async () => {
            let returned_value = await factoryContract.getAvailableSupply();
            expect(returned_value).to.be.eql(newPeriodLimit)
          })

          it('should not set availableSupply to new periodMintLimit if lower', async () => {
            await factoryContract.updatePeriodMintLimit(periodMintLimit)
            let returned_value = await factoryContract.getAvailableSupply();
            expect(returned_value).to.be.eql(newPeriodLimit)
          })

          it('should emit PeriodMintLimitChange event', async () => {
            let filterFromOperatorContract: ethers.ethers.EventFilter

            // Get event filter to get internal tx event
            filterFromOperatorContract = factoryContract.filters.PeriodMintLimitChanged(null, null);

            // Get logs from internal transaction event
            // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
            filterFromOperatorContract.fromBlock = 0;
            let logs = await operatorProvider.getLogs(filterFromOperatorContract);
            expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.getEventTopic(factoryContract.interface.events["PeriodMintLimitChanged(uint256,uint256)"]))
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
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        it('should REVERT if caller is not owner', async () => {
          const tx = userFactoryContract.updatePeriodMintLimit(newPeriodLimit)
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        context('When periodMintLimit was updated', () => {
          let tx;
          beforeEach(async () => {
            tx = await factoryContract.updatePeriodMintLimit(newPeriodLimit)
          })

          it('should set periodMintLimit to new periodMintLimit', async () => {
            let returned_value = await factoryContract.periodMintLimit();
            expect(returned_value).to.be.eql(newPeriodLimit)
          })

          it('should set availableSupply to new periodMintLimit if higher', async () => {
            let returned_value = await factoryContract.getAvailableSupply();
            expect(returned_value).to.be.eql(newPeriodLimit)
          })

          it('should not set availableSupply to new periodMintLimit if lower', async () => {
            await factoryContract.updatePeriodMintLimit(periodMintLimit)
            let returned_value = await factoryContract.getAvailableSupply();
            expect(returned_value).to.be.eql(newPeriodLimit)
          })

          it('should emit PeriodMintLimitChange event', async () => {
            let filterFromOperatorContract: ethers.ethers.EventFilter

            // Get event filter to get internal tx event
            filterFromOperatorContract = factoryContract.filters.PeriodMintLimitChanged(null, null);

            // Get logs from internal transaction event
            // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
            filterFromOperatorContract.fromBlock = 0;
            let logs = await operatorProvider.getLogs(filterFromOperatorContract);
            expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.getEventTopic(factoryContract.interface.events["PeriodMintLimitChanged(uint256,uint256)"]))
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

      describe('enableMint() function', () => {
        let enabledIds = [ids[0], ids[1], ids[2]]
        let nonEnabledIds = [ids[3]]

        // Only run when whitelist is active
        before(async function() {
          if (condition[1] !== 2) {
            this.test!.parent!.pending = true
            this.skip()
          }
        })

        beforeEach(async () => {
          await factoryContract.disableMint(nonEnabledIds)
        })

        it('should PASS if caller is super owner', async () => {
          const tx = factoryContract.enableMint(enabledIds)
          await expect(tx).to.be.fulfilled
        })

        it('should REVERT if caller is sub owner', async () => {
          const tx = subOwnerFactoryContract.enableMint(enabledIds)
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        it('should REVERT if caller is not owner', async () => {
          const tx = userFactoryContract.enableMint(enabledIds)
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        context('When ids were whitelisted', () => {
          let tx;
          beforeEach(async () => {
            tx = await factoryContract.enableMint(enabledIds)
          })

          it('should set ids to whitelisted', async () => {
            for (let i = 0; i < enabledIds.length; i++) {
              let returned_value = await factoryContract.mintWhitelist(enabledIds[i]);
              expect(returned_value).to.be.eql(true)
            }
          })

          it('prevent minting of non-whitelisted asset', async () => {
            const tx = subOwnerFactoryContract.batchMint(userAddress, [...enabledIds, ...nonEnabledIds], [1, 1, 1, 1], [])
            await expect(tx).to.be.rejectedWith(RevertError("RewardFactory#batchMint: ID_IS_NOT_WHITELISTED"))
          })

          it('ALLOWS minting of whitelisted asset', async () => {
            const tx = subOwnerFactoryContract.batchMint(userAddress, [...enabledIds], [1, 1, 1], [])
            await expect(tx).to.be.fulfilled
          })
        })
      })

      describe('disableMint() function', () => {
        let enabledIds = [ids[0], ids[1], ids[2]]
        let disabledIds = [ids[0], ids[1]]

        // Only run when whitelist is active
        before(async function() {
          if (condition[1] !== 2) {
            this.test!.parent!.pending = true
            this.skip()
          }
        })

        beforeEach(async () => {
          await factoryContract.enableMint(enabledIds)
        })

        it('should PASS if caller is super owner', async () => {
          const tx = factoryContract.disableMint(disabledIds)
          await expect(tx).to.be.fulfilled
        })

        it('should REVERT if caller is sub owner', async () => {
          const tx = subOwnerFactoryContract.disableMint(disabledIds)
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        it('should REVERT if caller is not owner', async () => {
          const tx = userFactoryContract.disableMint(disabledIds)
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        context('When ids were disabled', () => {
          let tx;
          beforeEach(async () => {
            tx = await factoryContract.disableMint(disabledIds)
          })

          it('should set ids to NOT whitelisted', async () => {
            for (let i = 0; i < disabledIds.length; i++) {
              let returned_value = await factoryContract.mintWhitelist(disabledIds[i]);
              expect(returned_value).to.be.eql(false)
            }
          })

          it('prevent minting of non-whitelisted asset', async () => {
            const tx = subOwnerFactoryContract.batchMint(userAddress, [...enabledIds], [1, 1, 1], [])
            await expect(tx).to.be.rejectedWith(RevertError("RewardFactory#batchMint: ID_IS_NOT_WHITELISTED"))
          })

          it('ALLOWS minting of whitelisted asset', async () => {
            const tx = subOwnerFactoryContract.batchMint(userAddress, [enabledIds[2]], [1], [])
            await expect(tx).to.be.fulfilled
          })
        })
      })


      describe('batchMint()', () => {
        let mintIds = [33, 66, 99, 133]
        let mintAmounts = [10000, 20000, 50000, 10000]

        beforeEach( async () => {
          if (condition[1] == 2) {
            await factoryContract.enableMint(mintIds);
          }
        })

        it('should PASS if caller is owner', async () => {
          const tx = factoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
          await expect(tx).to.be.fulfilled
        })

        it('should PASS if caller is subowner', async () => {
          const tx = subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
          await expect(tx).to.be.fulfilled
        })

        it('should REVERT false if caller is not owner', async () => {
          const tx = userFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
          await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
        })

        it('should PASS if trying to mint exactly the available supply', async () => {
          let available_supply = await subOwnerFactoryContract.getAvailableSupply()
          const tx = subOwnerFactoryContract.batchMint(userAddress, [1], [available_supply], [])
          await expect(tx).to.be.fulfilled
        })

        it('should REVERT if trying to mint more than current supply', async () => {
          let available_supply = await factoryContract.getAvailableSupply()
          const tx = subOwnerFactoryContract.batchMint(userAddress, [1], [available_supply.add(1)], [])
          await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

          const tx2 = subOwnerFactoryContract.batchMint(userAddress, [1, 2], [1, available_supply], [])
          await expect(tx2).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

          const tx3 = subOwnerFactoryContract.batchMint(userAddress, [1, 2, 66], [1, available_supply.sub(1), 1], [])
          await expect(tx3).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
        })

        context('When cards were minted', () => {
          let expected_supply
          beforeEach(async () => {
            let available_supply = await factoryContract.getAvailableSupply()
            expected_supply = available_supply.sub(90000);
            await subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
          })

          it('should update user availableSupply', async () => {
            let supply = await factoryContract.getAvailableSupply()
            expect(supply).to.be.eql(expected_supply)
          })

          it('should be able to mint more assets in the same period', async () => {
            let tx = subOwnerFactoryContract.batchMint(randomAddress, mintIds, [1, 1, 1, expected_supply.sub(3)], [])
            await expect(tx).to.be.fulfilled
          })

          it('should not be able to exceed minting limit for this period with second mint tx', async () => {
            let tx = subOwnerFactoryContract.batchMint(randomAddress, mintIds, [1, 1, 1, expected_supply.sub(2)], [])
            await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
          })

          it('should update user silver cards balance', async () => {
            let n_ids = mintIds.length
            let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
            let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, mintIds)
            for (let i = 0; i < n_ids; i++) {
              expect(userBalances[i]).to.be.eql(BigNumber.from(mintAmounts[i]))
            }
          })

          it('should refresh user availableSupply with new period', async () => {
            // Check current supply
            let current_period = await factoryContract.livePeriod()
            let supply = await factoryContract.getAvailableSupply()
            expect(supply).to.be.eql(expected_supply)
            
            // Try to mint current period
            const tx1 = subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
            await expect(tx1).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

            // Move forward by 6 hours
            let sixHours = BigNumber.from(60).mul(60).mul(6)
            let snapshot = await ownerProvider.send('evm_snapshot', [])
            await ownerProvider.send("evm_increaseTime", [sixHours.toNumber()])
            await ownerProvider.send("evm_mine", [])

            // Get new supply for current period
            let new_period = await factoryContract.livePeriod()
            supply = await factoryContract.getAvailableSupply()
            expect(new_period).to.be.eql(current_period.add(1))
            expect(supply).to.be.eql(periodMintLimit)

            // Try mint during new period
            const tx2 = subOwnerFactoryContract.batchMint(userAddress, mintIds, mintAmounts, [])
            await expect(tx2).to.be.fulfilled

            // Revert time to expected timestamp
            await ownerProvider.send("evm_revert", [snapshot])
          })
        })
      })
    })
  })
})