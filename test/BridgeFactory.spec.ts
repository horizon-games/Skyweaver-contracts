import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from '../typings/contracts/SkyweaverAssets'
import { ERC1155Mock } from '../typings/contracts/ERC1155Mock'
import { BridgeMock } from '../typings/contracts/BridgeMock'
import { BridgeFactory } from '../typings/contracts/BridgeFactory'
import { BigNumber } from 'ethers/utils';
import { Zero } from 'ethers/constants'
import { web3 } from '@nomiclabs/buidler'

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

const getBig = (id: number) => new BigNumber(id);

describe('BridgeFactory', () => {
  let ownerAddress: string
  let subOwnerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let arcadeumCoinAbstract: AbstractContract
  let factoryAbstract: AbstractContract
  let bridgeMockAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: BridgeFactory
  let bridgeOwner: BridgeMock

  // Arcadeum Coins
  let arcadeumCoinContract: ERC1155Mock
  let userArcadeumCoinContract: ERC1155Mock

  // Factory manager
  let userFactoryContract: BridgeFactory
  let subOwnerFactoryContract: BridgeFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = new BigNumber(30) 
  const nTokensPerType = new BigNumber(50000)

  // Arcadeum Coin Param
  const arcID = new BigNumber(2);
  const baseTokenAmount = new BigNumber(1000000000).mul(new BigNumber(10).pow(16))

  // Range values 
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(500);

  // Base Token Param
  const periodMintLimit = new BigNumber(100000)

  // Arrays
  const ids = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => nTokensPerType)

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    subOwnerAddress = await subOwnerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    arcadeumCoinAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    factoryAbstract = await AbstractContract.fromArtifactName('BridgeFactory')
    bridgeMockAbstract = await AbstractContract.fromArtifactName('BridgeMock')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Arcadeum Coins
    arcadeumCoinContract = await arcadeumCoinAbstract.deploy(ownerWallet) as ERC1155Mock
    userArcadeumCoinContract = await arcadeumCoinContract.connect(userSigner) as ERC1155Mock

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      arcadeumCoinContract.address,
      arcID,
      periodMintLimit
    ]) as BridgeFactory
    userFactoryContract = await factoryContract.connect(userSigner) as BridgeFactory
    subOwnerFactoryContract = await factoryContract.connect(subOwnerSigner) as BridgeFactory

    // Deploy bridge mock
    bridgeOwner = await bridgeMockAbstract.deploy(ownerWallet, [factoryContract.address]) as BridgeMock

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, minRange, maxRange);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
    await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, 0, 666);

    // Set subOwner to ownership tier 1
    await factoryContract.functions.assignOwnership(subOwnerAddress, 1)

    // Set bridgeMock as owner for mint
    await factoryContract.functions.assignOwnership(bridgeOwner.address, 1) 

    // Mint silver cards to user
    await skyweaverAssetsContract.functions.batchMint(userAddress, ids, amounts, [])

    // Mint Arcadeum coins to owner and user
    await arcadeumCoinContract.functions.mintMock(ownerAddress, arcID, baseTokenAmount, [])
    await arcadeumCoinContract.functions.mintMock(userAddress, arcID, baseTokenAmount, [])
  })

  describe('Getter functions', () => {
    describe('getSkyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.functions.getSkyweaverAssets()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
      })
    })

    describe('getPeriodMintLimit() function', () => {
      it('should return the mint entry ratio', async () => {
        const ratio = await factoryContract.functions.getPeriodMintLimit()
        expect(ratio).to.be.eql(periodMintLimit)
      })
    })

    describe('getAvailableSupply() function', () => {
      it('should return current available supply', async () => {
        const supply = await factoryContract.functions.getAvailableSupply()
        expect(supply).to.be.eql(periodMintLimit)
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

  describe('updatePeriodMintLimit() function', () => {
    let newPeriodLimit = periodMintLimit.div(2)

    it('should PASS if caller is super owner', async () => {
      const tx = factoryContract.functions.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is sub owner', async () => {
      const tx = subOwnerFactoryContract.functions.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updatePeriodMintLimit(newPeriodLimit)
      await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    context('When periodMintLimit was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updatePeriodMintLimit(newPeriodLimit)
      })

      it('should set periodMintLimit to new periodMintLimit', async () => {
        let returned_value = await factoryContract.functions.getPeriodMintLimit();
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should set availableSupply to new periodMintLimit if higher', async () => {
        let returned_value = await factoryContract.functions.getAvailableSupply();
        expect(returned_value).to.be.eql(newPeriodLimit)
      })

      it('should not set availableSupply to new periodMintLimit if lower', async () => {
        await factoryContract.functions.updatePeriodMintLimit(periodMintLimit)
        let returned_value = await factoryContract.functions.getAvailableSupply();
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
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.PeriodMintLimitChanged.topic)
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

  describe('Bridge', () => {
    let id = ids[0]
    let amount = 1
    let salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('salt'))
    console.log(salt)

    let conditions = [
      'safeTransferFrom()',
      'safeBatchTransferFrom()'  
    ]

    context('Using Silver Cards', () => {
      context('Using safeTransferFrom', () => {
        it('should PASS if caller sends cards', async () => {
          const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, id, amount, salt, TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
      })
  
      context('Using safeBatchTransferFrom', () => {
        it('should PASS if caller sends silver cards', async () => {
          const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, salt, TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
      })
  
      conditions.forEach(function(condition) { 
        context(condition as string, () => {
          context('When cards were sent to Bridge', () => {
            let tx;
            beforeEach(async () => {
              if (condition == condition[0]) {
                for (let i = 0; i < ids.length; i++) {
                  tx = await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ids[i], amounts[i], salt, TX_PARAM)
                }
              } else {
                tx = await userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, salt, TX_PARAM)
              }
            })
      
            it('should leave factory silver cards balance to 0', async () => {
              let factory_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => factory)
              let factory_balances = await userSkyweaverAssetContract.functions.balanceOfBatch(factory_addresses, ids)
              for (let i = 0; i < ids.length; i++) {
                expect(factory_balances[i]).to.be.eql(Zero)
              }
            })
      
            it('should update user silver cards balance', async () => {
              let user_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => userAddress)
              let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, ids)
              for (let i = 0; i < ids.length; i++) {
                expect(userBalances[i]).to.be.eql(Zero)
              }
            })

            it('should emit Deposit event', async () => {
              let filterFromOperatorContract: ethers.ethers.EventFilter
      
              // Get event filter to get internal tx event
              filterFromOperatorContract = factoryContract.filters.Deposit(null, null);
      
              // Get logs from internal transaction event
              // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
              filterFromOperatorContract.fromBlock = 0;
              let logs = await operatorProvider.getLogs(filterFromOperatorContract);
              expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.Deposit.topic)
            })
            
            describe('Deposit Event', () => {
              let args;
              beforeEach(async () => {
                let filterFromOperatorContract: ethers.ethers.EventFilter
      
                // Get event filter to get internal tx event
                filterFromOperatorContract = factoryContract.filters.Deposit(null, null);
        
                // Get logs from internal transaction event
                // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
                filterFromOperatorContract.fromBlock = 0;
                let logs = await operatorProvider.getLogs(filterFromOperatorContract);
                args = factoryContract.interface.events.Deposit.decode(logs[0].data, logs[0].topics)
              })
              it('should have user address as `recipient` field', async () => {  
                expect(args.recipient).to.be.eql(userAddress)
              })
              it('should have salt as `salt` field', async () => {  
                expect(args.salt).to.be.eql(salt)
              })
            })
          })
        })
      })
    })

    context('Using ARC', () => {
      let amount = nTokenTypes
      let cost = new BigNumber(10).pow(18).mul(amount)

      context('Using safeBatchTransferFrom', () => {
        it('should PASS if caller sends arcs', async () => {
          const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], salt, TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
  
        it('should REVERT if ID is not arc', async () => {
          let invalid_id = 123456
          await userArcadeumCoinContract.functions.mintMock(userAddress, invalid_id, cost, [])

          const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [invalid_id], [cost], salt, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BridgeFactory#onERC1155BatchReceived: INVALID_ARC_ID"))

          const tx2 = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID, invalid_id], [cost, cost], salt, TX_PARAM)
          await expect(tx2).to.be.rejectedWith(RevertError("BridgeFactory#onERC1155BatchReceived: INVALID_ARRAY_LENGTH"))
        })
      })
  
      context('Using safeTransferFrom', () => {
        it('should PASS if caller send arcs', async () => {
          const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, salt, TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
      })
  
      context('When arc was sent to Bridge', () => {
        conditions.forEach(function(condition) { 
          context(condition as string, () => {
            context('When cards were sent to Bridge', () => {
              let tx;
              beforeEach(async () => {
                if (condition == condition[0]) {
                  tx = await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, salt, TX_PARAM)
                } else {
                  tx = await userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], salt, TX_PARAM)
                }
              })
  
              it('should leave factory silver cards balance to 0', async () => {
                let factory_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => factory)
                let factory_balances = await userSkyweaverAssetContract.functions.balanceOfBatch(factory_addresses, ids)
                for (let i = 0; i < ids.length; i++) {
                  expect(factory_balances[i]).to.be.eql(Zero)
                }
              })

              it('should update factory ARC balance', async () => {
                let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
                expect(factory_balance).to.be.eql(cost)
              })
        
              it('should update user ARC balance', async () => {
                let user_balance = await arcadeumCoinContract.functions.balanceOf(userAddress, arcID)
                expect(user_balance).to.be.eql(baseTokenAmount.sub(cost))
              })

              it('should emit Deposit event', async () => {
                let filterFromOperatorContract: ethers.ethers.EventFilter
        
                // Get event filter to get internal tx event
                filterFromOperatorContract = factoryContract.filters.Deposit(null, null);
        
                // Get logs from internal transaction event
                // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
                filterFromOperatorContract.fromBlock = 0;
                let logs = await operatorProvider.getLogs(filterFromOperatorContract);
                expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.Deposit.topic)
              })
              
              describe('Deposit Event', () => {
                let args;
                beforeEach(async () => {
                  let filterFromOperatorContract: ethers.ethers.EventFilter
        
                  // Get event filter to get internal tx event
                  filterFromOperatorContract = factoryContract.filters.Deposit(null, null);
          
                  // Get logs from internal transaction event
                  // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
                  filterFromOperatorContract.fromBlock = 0;
                  let logs = await operatorProvider.getLogs(filterFromOperatorContract);
                  args = factoryContract.interface.events.Deposit.decode(logs[0].data, logs[0].topics)
                })
                it('should have user address as `recipient` field', async () => {  
                  expect(args.recipient).to.be.eql(userAddress)
                })
                it('should have salt as `salt` field', async () => {  
                  expect(args.salt).to.be.eql(salt)
                })
              })

              describe('withdraw() function', () => {

                let recipient = randomWallet.address
                let data = []

                it('should PASS if caller is owner', async () => {
                  const tx = factoryContract.functions.withdraw(recipient, data)
                  await expect(tx).to.be.fulfilled
                })

                it('should REVERT if caller is sub owner', async () => {
                  const tx = subOwnerFactoryContract.functions.withdraw(recipient, data)
                  await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
                })
            
                it('should REVERT if caller is not owner', async () => {
                  const tx = userFactoryContract.functions.withdraw(recipient, data)
                  await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
                })
            
                it('should REVERT if recipient is 0x0', async () => {
                  const tx = factoryContract.functions.withdraw(ZERO_ADDRESS, data)
                  await expect(tx).to.be.rejectedWith(RevertError("BridgeFactory#withdraw: INVALID_RECIPIENT"))
                })

                context('When ARC is withdrawn', () => {
                  beforeEach(async () => {
                    await factoryContract.functions.withdraw(recipient, data)
                  })

                  it('should update factory ARC balance', async () => {
                    let factory_balance = await arcadeumCoinContract.functions.balanceOf(factory, arcID)
                    expect(factory_balance).to.be.eql(Zero)
                  })
            
                  it('should update recipient ARC balance', async () => {
                    let recipient_balance = await arcadeumCoinContract.functions.balanceOf(recipient, arcID)
                    expect(recipient_balance).to.be.eql(cost)
                  })
                })
              })
            })
          })  
        })
      })
    })
  })

  describe('batchMint()', () => {
    let mintIds = [33, 66, 99, 133]
    let mintAmounts = [10000, 20000, 50000, 10000]

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.batchMint(userAddress, mintIds, mintAmounts)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if caller is subowner', async () => {
      const tx = bridgeOwner.functions.batchMint(userAddress, mintIds, mintAmounts)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT false if caller is not owner', async () => {
      const tx = userFactoryContract.functions.batchMint(userAddress, mintIds, mintAmounts)
      await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    it('should PASS if trying to mint exactly the available supply', async () => {
      let available_supply = await factoryContract.functions.getAvailableSupply() 
      const tx = bridgeOwner.functions.batchMint(userAddress, [1], [available_supply])
      await expect(tx).to.be.fulfilled
    })

    it('should return FALSE if trying to mint more than current supply', async () => {
      let available_supply = await factoryContract.functions.getAvailableSupply() 
      const tx = bridgeOwner.functions.batchMint(userAddress, [1], [available_supply.add(1)])
      await expect(tx).to.be.rejectedWith(RevertError("BATCH_MINT_ERROR"))

      const tx2 = bridgeOwner.functions.batchMint(userAddress, [1, 2], [1, available_supply])
      await expect(tx2).to.be.rejectedWith(RevertError("BATCH_MINT_ERROR"))

      const tx3 = bridgeOwner.functions.batchMint(userAddress, [1, 2, 66], [1, available_supply.sub(1), 1])
      await expect(tx3).to.be.rejectedWith(RevertError("BATCH_MINT_ERROR"))
    })

    it('should NOT REVERT if trying to mint more than current supply', async () => {
      let available_supply = await factoryContract.functions.getAvailableSupply() 
      const tx = factoryContract.functions.batchMint(userAddress, [1], [available_supply.add(1)])
      await expect(tx).to.be.fulfilled

      const tx2 = factoryContract.functions.batchMint(userAddress, [1, 2], [1, available_supply])
      await expect(tx2).to.be.fulfilled

      const tx3 = factoryContract.functions.batchMint(userAddress, [1, 2, 66], [1, available_supply.sub(1), 1])
      await expect(tx3).to.be.fulfilled
    })

    context('When cards were minted', () => {
      let expected_supply
      beforeEach(async () => {
        let available_supply = await factoryContract.functions.getAvailableSupply()
        expected_supply = available_supply.sub(90000);
        await bridgeOwner.functions.batchMint(userAddress, mintIds, mintAmounts)
      })

      it('should update user availableSupply', async () => {
        let supply = await factoryContract.functions.getAvailableSupply()
        expect(supply).to.be.eql(expected_supply)
      })

      it('should be able to mint more assets in the same period', async () => {
        let tx = bridgeOwner.functions.batchMint(randomAddress, mintIds, [1, 1, 1, expected_supply.sub(3)])
        await expect(tx).to.be.fulfilled
      })

      it('should not be able to exceed minting limit for this period with second mint tx', async () => {
        let tx = bridgeOwner.functions.batchMint(randomAddress, mintIds, [1, 1, 1, expected_supply.sub(2)])
        await expect(tx).to.be.rejectedWith(RevertError("BATCH_MINT_ERROR"))
      })

      it('should update user silver cards balance', async () => {
        let n_ids = mintIds.length
        let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
        let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, mintIds)
        for (let i = 0; i < n_ids; i++) {
          expect(userBalances[i]).to.be.eql(new BigNumber(mintAmounts[i]))
        }
      })

      it('should refresh user availableSupply with new period', async () => {
        // Check current supply
        let current_period = await factoryContract.functions.livePeriod()
        let supply = await factoryContract.functions.getAvailableSupply()
        expect(supply).to.be.eql(expected_supply)
        
        // Try to mint current period
        const tx1 = bridgeOwner.functions.batchMint(userAddress, mintIds, mintAmounts)
        await expect(tx1).to.be.rejectedWith(RevertError("BATCH_MINT_ERROR"))

        // Move forward by 6 hours
        let sixHours = new BigNumber(60).mul(60).mul(6)
        let snapshot = await ownerProvider.send('evm_snapshot', [])
        await ownerProvider.send("evm_increaseTime", [sixHours.toNumber()])
        await ownerProvider.send("evm_mine", [])

        // Get new supply for current period
        let new_period = await factoryContract.functions.livePeriod()
        supply = await factoryContract.functions.getAvailableSupply()
        expect(new_period).to.be.eql(current_period.add(1))
        expect(supply).to.be.eql(periodMintLimit)

        // Try mint during new period
        const tx2 = bridgeOwner.functions.batchMint(userAddress, mintIds, mintAmounts)
        await expect(tx2).to.be.fulfilled

        // Revert time to expected timestamp
        await ownerProvider.send("evm_revert", [snapshot])
      })
    })
    context('When cards were not minted due to out of supply', () => {
      let expected_supply: BigNumber
      let bad_mintAmounts =  mintAmounts.slice()
      let tx

      beforeEach(async () => {
        expected_supply = await factoryContract.functions.getAvailableSupply()
        bad_mintAmounts[0] = (expected_supply.add(1)).toNumber()
        tx = await factoryContract.functions.batchMint(userAddress, mintIds, bad_mintAmounts)
      })

      it('should NOT update user availableSupply', async () => {
        let supply = await factoryContract.functions.getAvailableSupply()
        expect(supply).to.be.eql(expected_supply)
      })

      it('should be able to mint more assets in the same period', async () => {
        let tx = bridgeOwner.functions.batchMint(randomAddress, mintIds, [1, 1, 1, expected_supply.sub(3)])
        await expect(tx).to.be.fulfilled
      })

      it('should not be able to exceed minting limit for this period with second mint tx', async () => {
        let tx = bridgeOwner.functions.batchMint(randomAddress, mintIds, [1, 1, 1, expected_supply.sub(2)])
        await expect(tx).to.be.rejectedWith(RevertError("BATCH_MINT_ERROR"))
      })

      it('should NOT update user silver cards balance', async () => {
        let n_ids = mintIds.length
        let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
        let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, mintIds)
        for (let i = 0; i < n_ids; i++) {
          expect(userBalances[i]).to.be.eql(new BigNumber(0))
        }
      })

      it('should refresh user availableSupply with new period', async () => {
        // Check current supply
        let current_period = await factoryContract.functions.livePeriod()
        let supply = await factoryContract.functions.getAvailableSupply()
        expect(supply).to.be.eql(expected_supply)
        
        // Try to mint current period
        const tx1 = bridgeOwner.functions.batchMint(userAddress, [1], [expected_supply])
        await expect(tx1).to.be.fulfilled;

        // Move forward by 6 hours
        let sixHours = new BigNumber(60).mul(60).mul(6)
        let snapshot = await ownerProvider.send('evm_snapshot', [])
        await ownerProvider.send("evm_increaseTime", [sixHours.toNumber()])
        await ownerProvider.send("evm_mine", [])

        // Try to more than limit without reverting
        const tx2 = factoryContract.functions.batchMint(userAddress, mintIds, bad_mintAmounts)
        await expect(tx2).to.be.fulfilled;

        // Get new supply for current period
        let new_period = await factoryContract.functions.livePeriod()
        supply = await factoryContract.functions.getAvailableSupply()
        expect(new_period).to.be.eql(current_period.add(1))
        expect(supply).to.be.eql(periodMintLimit)

        // Try mint during new period
        const tx3 = bridgeOwner.functions.batchMint(userAddress, [1], [expected_supply])
        await expect(tx3).to.be.fulfilled

        // Revert time to expected timestamp
        await ownerProvider.send("evm_revert", [snapshot])
      })

      it('should emit ReDeposit event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.ReDeposit(null,null,null,null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await ownerProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.ReDeposit.topic)
      })

      describe('ReDeposit Event', () => {
        it('should have user as `tx.recipient` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.recipient).to.be.eql(userAddress)
        })
        it('should have correct ids as `tx.ids` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          for (let i = 0; i < mintIds.length; i++){
            expect(args.ids[i]).to.be.eql(new BigNumber(mintIds[i]))
          }
        })
        it('should have correct amounts as `tx.amounts` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          for (let i = 0; i < bad_mintAmounts.length; i++){
            expect(args.amounts[i]).to.be.eql(new BigNumber(bad_mintAmounts[i]))
          }
        })
      })
    })
  })
})