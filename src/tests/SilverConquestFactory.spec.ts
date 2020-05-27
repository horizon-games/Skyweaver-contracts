import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from 'typings/contracts/SkyweaverAssets'
import { ERC1155Mock } from 'typings/contracts/ERC1155Mock'
import { SilverConquestFactory } from 'typings/contracts/SilverConquestFactory'
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

contract('SilverConquestFactory', (accounts: string[]) => {
  let ownerAddress: string
  let userAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let arcadeumCoinAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: SilverConquestFactory

  // Arcadeum Coins
  let arcadeumCoinContract: ERC1155Mock
  let userArcadeumCoinContract: ERC1155Mock

  // Factory manager
  let userFactoryContract: SilverConquestFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = new BigNumber(30) 
  const nTokensPerType = new BigNumber(500)

  // Arcadeum Coin Param
  const arcID = new BigNumber(2);
  const baseTokenAmount = new BigNumber(1000000000).mul(new BigNumber(10).pow(16))
  const price = new BigNumber(100).mul(new BigNumber(10).pow(16))

  // Range values 
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(500);

  // Base Token Param
  const mintEntryRatio = new BigNumber(875)

  // Arrays
  const ids = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => nTokensPerType)

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    arcadeumCoinAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    factoryAbstract = await AbstractContract.fromArtifactName('SilverConquestFactory')
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
      mintEntryRatio,
      arcadeumCoinContract.address,
      arcID,
      price
    ]) as SilverConquestFactory
    userFactoryContract = await factoryContract.connect(userSigner) as SilverConquestFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, minRange, maxRange);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
    await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, 0, 666);

    // Set range in factory
    await factoryContract.functions.updateSilverCardsRange(minRange, maxRange)

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

    describe('getMintEntryRatio() function', () => {
      it('should return the mint entry ratio', async () => {
        const ratio = await factoryContract.functions.getMintEntryRatio()
        expect(ratio).to.be.eql(mintEntryRatio)
      })
    })

    describe('getArcPrice() function', () => {
      it('should return the enry price in arc', async () => {
        const arc_price = await factoryContract.functions.getArcPrice()
        expect(arc_price).to.be.eql(price)
      })
    })

    describe('getAvailableSupply() function', () => {
      it('should return current available supply', async () => {
        const supply = await factoryContract.functions.getAvailableSupply()
        expect(supply).to.be.eql(Zero)
      })
    })

    describe('getSilverCardsRange() function', () => {
      it('should return current available supply', async () => {
        const range = await factoryContract.functions.getSilverCardsRange()
        expect(range).to.be.eql([minRange, maxRange])
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

  describe('updateMintEntryRatio() function', () => {
    let newRatio = mintEntryRatio.div(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateMintEntryRatio(newRatio)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateMintEntryRatio(newRatio)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if new price is below or qual to 100000000', async () => {
      const tx = factoryContract.functions.updateArcPrice(new BigNumber(100000000))
      await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#updateArcPrice: INVALID_PRICE"))
    })

    context('When ratio was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateMintEntryRatio(newRatio)
      })

      it('should set ratio to new ratio', async () => {
        let returned_ratio = await factoryContract.functions.getMintEntryRatio();
        expect(returned_ratio).to.be.eql(newRatio)
      })

      it('should emit MintEntryRatioChange event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.MintEntryRatioChange(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.MintEntryRatioChange.topic)
      })
      
      describe('MintEntryRatioChange Event', () => {
        it('should have old ratio as `oldratio` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.oldRatio).to.be.eql(mintEntryRatio)
        })
        it('should have old ratio as `newRatio` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newRatio).to.be.eql(newRatio)
        })
      })
    })
  })

  describe('updateArcPrice() function', () => {
    let newPrice = price.mul(2)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateArcPrice(newPrice)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateArcPrice(newPrice)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if new price is below or qual to 100000000', async () => {
      const tx = factoryContract.functions.updateArcPrice(new BigNumber(100000000))
      await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#updateArcPrice: INVALID_PRICE"))
    })

    context('When price was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateArcPrice(newPrice)
      })

      it('should set price to new price', async () => {
        let returned_price = await factoryContract.functions.getArcPrice();
        expect(returned_price).to.be.eql(newPrice)
      })

      it('should emit MintEntryRatioChange event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.MintEntryRatioChange(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.MintEntryRatioChange.topic)
      })
      
      describe('ArcPriceChange Event', () => {
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

  describe('updateSilverCardsRange() function', () => {
    let newMinRange = maxRange.mul(2)
    let newMaxRange = newMinRange.add(maxRange)

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.functions.updateSilverCardsRange(newMinRange, newMaxRange)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.functions.updateSilverCardsRange(newMinRange, newMaxRange)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if max range is 0', async () => {
      const tx = factoryContract.functions.updateSilverCardsRange(newMinRange, 0)
      await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#updateSilverCardsRange: NULL_RANGE"))
    })

    it('should REVERT if min range is higher than max range', async () => {
      const tx = factoryContract.functions.updateSilverCardsRange(newMaxRange.add(1), newMaxRange)
      await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#updateSilverCardsRange: INVALID_RANGE"))
    })

    context('When range was updated', () => {
      let tx;
      beforeEach(async () => {
        tx = await factoryContract.functions.updateSilverCardsRange(newMinRange, newMaxRange)
      })

      it('should set range to new range', async () => {
        let returned_range = await factoryContract.functions.getSilverCardsRange();
        expect(returned_range[0]).to.be.eql(newMinRange)
        expect(returned_range[1]).to.be.eql(newMaxRange)
      })

      it('should emit IdRangeUpdated event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.IdRangeUpdated(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.IdRangeUpdated.topic)
      })
      
      describe('IdRangeUpdated Event', () => {
        it('should have old ratio as `newRange` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newRange).to.be.eql([newMinRange, newMaxRange])
        })
      })
    })
  })

  describe('Tribute', () => {
    let id = ids[0]
    let amount = 1

    context('Using Silver Cards', () => {
      context('Using safeTransferFrom', () => {
        it('should PASS if caller sends cards', async () => {
          const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, id, amount, [], TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
  
        it('should REVERT if ID is out of range', async () => {
          let invalid_id = 666
          await skyweaverAssetsContract.functions.batchMint(userAddress, [0, invalid_id], [1, 1], [])
  
          // Under min
          const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, 0, 1, [], TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"))
  
          // Above max
          const tx2 = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, invalid_id, 1, [], TX_PARAM)
          await expect(tx2).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"))
        })
      })
  
      context('Using safeBatchTransferFrom', () => {
        it('should PASS if caller sends silver cards', async () => {
          const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
  
        it('should REVERT if ID is out of range', async () => {
          let invalid_id = 666
          await skyweaverAssetsContract.functions.batchMint(userAddress, [0, invalid_id], [1, 1], [])
  
          // Under min
          const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [0], [1], [], TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"))
  
          // Above max
          const tx2 = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [invalid_id], [1], [], TX_PARAM)
          await expect(tx2).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"))
        })
  
        it('should REVERT if one ID is out of range', async () => {
          let invalid_id = 666
          await skyweaverAssetsContract.functions.batchMint(userAddress, [0, invalid_id], [1, 1], [])
  
          // Under min
          const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [0, 1, 2], [1, 1, 1], [], TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"))
  
          // Above max
          const tx2 = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [1, 2, invalid_id], [1, 1, 1], [], TX_PARAM)
          await expect(tx2).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155BatchReceived: ID_OUT_OF_RANGE"))
        })
  
      })
  
      context('When cards were sent to tribute', () => {
        let logs;
        beforeEach(async () => {
          await userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
          let filter = factoryContract.filters.NewTribute(null, null);
          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filter.fromBlock = 0;
          logs = await operatorProvider.getLogs(filter);
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
  
        it('should update availableSupply', async () => {
          let expected_supply = nTokenTypes.mul(nTokensPerType).mul(mintEntryRatio).div(1000)
          let supply = await factoryContract.functions.getAvailableSupply()
          expect(supply).to.be.eql(expected_supply)
        })
  
        it('should emit NewTribute event', async () => {
          expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.NewTribute.topic)
        })
        
        describe('NewTribute Event', () => {
          let args;
  
          beforeEach(async () => {
            args = factoryContract.interface.events.NewTribute.decode(logs[0].data, logs[0].topics)
          })
  
          it('should have user address as `user` field', async () => {  
            expect(args.user).to.be.eql(userAddress)
          })
  
          it('should have amount burned as `nEntries` field', async () => {  
            expect(args.nEntries).to.be.eql(nTokenTypes.mul(nTokensPerType))
          })
        })
      })
    })

    context('Using ARC', () => {
      let amount = nTokenTypes
      let cost = price.mul(amount)

      context('Using safeBatchTransferFrom', () => {
        it('should PASS if caller sends arcs', async () => {
          const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID], [cost], [], TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
  
        it('should REVERT if ID is not arc', async () => {
          let invalid_id = 123456
          await userArcadeumCoinContract.functions.mintMock(userAddress, invalid_id, cost, [])

          const tx = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [invalid_id], [cost], [], TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155Received: INVALID_ARC_ID"))

          const tx2 = userArcadeumCoinContract.functions.safeBatchTransferFrom(userAddress, factory, [arcID, invalid_id], [cost, cost], [], TX_PARAM)
          await expect(tx2).to.be.rejectedWith(RevertError("SilverConquestFactory#onERC1155Received: INVALID_ARRAY_LENGTH"))
        })
      })
  
      context('Using safeTransferFrom', () => {
        it('should PASS if caller send arcs', async () => {
          const tx = userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, [], TX_PARAM)
          await expect(tx).to.be.fulfilled
        })
      })
  
      context('When arc was sent to tribute', () => {
        let logs;
        beforeEach(async () => {
          await userArcadeumCoinContract.functions.safeTransferFrom(userAddress, factory, arcID, cost, [], TX_PARAM)
          let filter = factoryContract.filters.NewTribute(null, null);
          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filter.fromBlock = 0;
          logs = await operatorProvider.getLogs(filter);
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
  
        it('should update availableSupply', async () => {
          let expected_supply = cost.div(price).mul(mintEntryRatio).div(1000)
          let supply = await factoryContract.functions.getAvailableSupply()
          expect(supply).to.be.eql(expected_supply)
        })
  
        it('should emit NewTribute event', async () => {
          expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.NewTribute.topic)
        })
        
        describe('NewTribute Event', () => {
          let args;
  
          beforeEach(async () => {
            args = factoryContract.interface.events.NewTribute.decode(logs[0].data, logs[0].topics)
          })
  
          it('should have user address as `user` field', async () => {  
            expect(args.user).to.be.eql(userAddress)
          })
  
          it('should have of entries paid as `nEntries` field', async () => {  
            expect(args.nEntries).to.be.eql(cost.div(price))
          })
        })

        describe('withdraw() function', () => {

          let recipient = randomWallet.address

          it('should PASS if caller is owner', async () => {
            const tx = factoryContract.functions.withdraw(recipient)
            await expect(tx).to.be.fulfilled
          })
      
          it('should REVERT if caller is not owner', async () => {
            const tx = userFactoryContract.functions.withdraw(recipient)
            await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
          })
      
          it('should REVERT if recipient is 0x0', async () => {
            const tx = factoryContract.functions.withdraw(ZERO_ADDRESS)
            await expect(tx).to.be.rejectedWith(RevertError("SilverConquestFactory#withdraw: INVALID_RECIPIENT"))
          })

          context('When ARC is withdrawn', () => {
            beforeEach(async () => {
              await factoryContract.functions.withdraw(recipient)
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

  describe('batchMint()', () => {
    let mintIds = [33, 66, 99, 133]
    let mintAmounts = [100, 200, 500, 100]

    context('When user burned some cards', () => {
      beforeEach(async () => {
        await userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
      })

      it('should PASS if caller is owner', async () => {
        const tx = factoryContract.functions.batchMint(userAddress, mintIds, mintAmounts)
        await expect(tx).to.be.fulfilled
      })
  
      it('should REVERT if caller is not owner', async () => {
        const tx = userFactoryContract.functions.batchMint(userAddress, mintIds, mintAmounts)
        await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
      })

      it('should PASS if trying to mint exactly the available supply', async () => {
        let available_supply = await factoryContract.functions.getAvailableSupply() 
        const tx = factoryContract.functions.batchMint(userAddress, [1], [available_supply])
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if trying to mint more than current supply', async () => {
        let available_supply = await factoryContract.functions.getAvailableSupply() 
        const tx = factoryContract.functions.batchMint(userAddress, [1], [available_supply.add(1)])
        await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

        const tx2 = factoryContract.functions.batchMint(userAddress, [1, 2], [1, available_supply])
        await expect(tx2).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

        const tx3 = factoryContract.functions.batchMint(userAddress, [1, 2, 66], [1, available_supply.sub(1), 1])
        await expect(tx3).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      })

      context('When cards were minted', () => {
        let expected_supply
        beforeEach(async () => {
          let available_supply = await factoryContract.functions.getAvailableSupply()
          expected_supply = available_supply.sub(900);
          await factoryContract.functions.batchMint(userAddress, mintIds, mintAmounts)
        })

        it('should update user availableSupply', async () => {
          let supply = await factoryContract.functions.getAvailableSupply()
          expect(supply).to.be.eql(expected_supply)
        })

        it('should update user silver cards balance', async () => {
          let n_ids = mintIds.length
          let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
          let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, mintIds)
          for (let i = 0; i < n_ids; i++) {
            expect(userBalances[i]).to.be.eql(new BigNumber(mintAmounts[i]))
          }
        })
      })
    })
  })
})