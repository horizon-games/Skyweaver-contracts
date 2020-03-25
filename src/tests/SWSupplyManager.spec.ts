import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  AssetRange
} from './utils'

import * as utils from './utils'

import { SkyweaverAssets } from 'typings/contracts/SkyweaverAssets'
import { ERC1155Mock } from 'typings/contracts/ERC1155Mock'
import { SWSupplyManager } from 'typings/contracts/SWSupplyManager'
import { FactoryMock } from 'typings/contracts/FactoryMock'

import { Zero } from 'ethers/constants';
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

contract('SWSupplyManager', (accounts: string[]) => {

  let ownerAddress: string
  let userAddress: string
  let operatorAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let arcadeumCoinAbstract: AbstractContract
  let SWSupplyManagerAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let arcadeumCoinContract: ERC1155Mock
  let SWSupplyManagerContract: SWSupplyManager
  let factoryContract: FactoryMock

  // Arcadeum Coins
  let userArcadeumCoinContract: ERC1155Mock

  // Factory manager
  let userSWSupplyManagerContract: SWSupplyManager

  // Token Param
  const nTokenTypes    = 30 
  const nTokensPerType = 500000

  // Range values 
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(500);

  // Base Token Param
  const baseTokenID = 666;
  const baseTokenAmount = new BigNumber(10000000).mul(new BigNumber(10).pow(18))

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
    SWSupplyManagerAbstract = await AbstractContract.fromArtifactName('SWSupplyManager')
    factoryAbstract = await AbstractContract.fromArtifactName('FactoryMock')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Arcadeum Coins
    arcadeumCoinContract = await arcadeumCoinAbstract.deploy(ownerWallet) as ERC1155Mock
    userArcadeumCoinContract = await arcadeumCoinContract.connect(userSigner) as ERC1155Mock

    // Deploy SWFactory manager
    SWSupplyManagerContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SWSupplyManager
    userSWSupplyManagerContract = await SWSupplyManagerContract.connect(userSigner) as SWSupplyManager

    // Deploy mock factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [SWSupplyManagerContract.address]) as FactoryMock

    // Mint Arcadeum coins to owner and user
    await arcadeumCoinContract.functions.mintMock(ownerAddress, baseTokenID, baseTokenAmount, [])
    await arcadeumCoinContract.functions.mintMock(userAddress, baseTokenID, baseTokenAmount, [])

    // Assing vars
    factory = factoryContract.address
  })

  describe('Getter functions', () => {

    describe('getMaxSupplies() function', () => {
      it('should return correct value', async () => {
        const id = new BigNumber(981273918273)
        const maxSupply = new BigNumber(100)
        await SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply])
        const value = await SWSupplyManagerContract.functions.getMaxSupplies([id])
        expect(value[0]).to.be.eql(maxSupply)
      })
    })

    describe('getCurrentSupplies() function', () => {
      it('should return correct value', async () => {
        const id = new BigNumber(nTokenTypes - 1)
        const maxSupply = new BigNumber(100)
        const expected_supply = new BigNumber(3)
        await SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply])
        await SWSupplyManagerContract.functions.activateFactory(factory)
        await SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange)
        await factoryContract.functions.batchMint(userAddress, [id], [expected_supply], [])
        const value = await SWSupplyManagerContract.functions.getCurrentSupplies([id])
        expect(value[0]).to.be.eql(expected_supply)
      })
    })
  })

  describe('addMintPermission() function', () => {

    it('should REVERT if maxRange is 0', async () => {
      let tx = SWSupplyManagerContract.functions.addMintPermission(factory, minRange, 0);
      await expect(tx).to.be.rejectedWith( RevertError("SWSupplyManager#addMintPermission: NULL_RANGE") )
    })

    it('should REVERT if minRange is lower than maxRange', async () => {
      let tx = SWSupplyManagerContract.functions.addMintPermission(factory, maxRange.add(1), maxRange);
      await expect(tx).to.be.rejectedWith( RevertError("SWSupplyManager#addMintPermission: INVALID_RANGE") )
    })

    it('should PASS if range is valid', async () => {
      const tx = SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userSWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When mint permission was given', () => {
      let tx;
      beforeEach(async () => {
        tx = await SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange);
      })
      
      it("should update factory's mint access range", async () => {
        const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
        await expect(range[0].minID).to.be.eql(minRange)
        await expect(range[0].maxID).to.be.eql(maxRange)
      })

      it('should emit MintPermissionAdded event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = SWSupplyManagerContract.filters.MintPermissionAdded(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(SWSupplyManagerContract.interface.events.MintPermissionAdded.topic)
      })
      
      describe('MintPermissionAdded Event', () => {

        it('should have factory address as `factory` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!
          const args = ev.args! as any
          expect(args.factory).to.be.eql(factory)
        })

        it('should have range in `range` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!
          const args = ev.args! as any
          expect(args.new_range).to.be.eql([minRange, maxRange])
        })
      })

      context('When mint permission was given for a 2ND time', () => {
        let tx;
        const minRange2 = maxRange.mul(2);
        const maxRange2 = minRange2.add(123);

        beforeEach(async () => {
          tx = await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2);
        })

        it("should update factory's mint access range correctly", async () => {
          const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range[0].minID).to.be.eql(minRange)
          expect(range[0].maxID).to.be.eql(maxRange)
          expect(range[1].minID).to.be.eql(minRange2)
          expect(range[1].maxID).to.be.eql(maxRange2)
        })
      })
    })

    it('should REVERT if range overlaps with locked range', async () => {
      let range: AssetRange = {minID: minRange, maxID: maxRange}
      await SWSupplyManagerContract.functions.lockRangeMintPermissions(range)

      let tx = SWSupplyManagerContract.functions.addMintPermission(factory, maxRange, maxRange.add(100))
      await expect(tx).to.be.rejectedWith( RevertError("SWSupplyManager#addMintPermission: OVERLAP_WITH_LOCKED_RANGE") )

      let tx2 = SWSupplyManagerContract.functions.addMintPermission(factory, 0, minRange)
      await expect(tx2).to.be.rejectedWith( RevertError("SWSupplyManager#addMintPermission: OVERLAP_WITH_LOCKED_RANGE") )

      let tx3 = SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange)
      await expect(tx3).to.be.rejectedWith( RevertError("SWSupplyManager#addMintPermission: OVERLAP_WITH_LOCKED_RANGE") )

      let tx4 = SWSupplyManagerContract.functions.addMintPermission(factory, 0, minRange.add(10))
      await expect(tx4).to.be.rejectedWith( RevertError("SWSupplyManager#addMintPermission: OVERLAP_WITH_LOCKED_RANGE") )
    })

    it('should pass if range does not overlap with locked range', async () => {
      let range: AssetRange = {minID: minRange.add(1), maxID: maxRange.add(1)}
      await SWSupplyManagerContract.functions.lockRangeMintPermissions(range)

      let range2: AssetRange = {minID: maxRange.mul(3), maxID: maxRange.mul(3).add(100)}
      await SWSupplyManagerContract.functions.lockRangeMintPermissions(range2)
      
      // Before first
      let tx = SWSupplyManagerContract.functions.addMintPermission(factory, 0, 1)
      await expect(tx).to.be.fulfilled

      // After last
      let tx2 = SWSupplyManagerContract.functions.addMintPermission(factory, maxRange.mul(3).add(101), maxRange.mul(3).add(102))
      await expect(tx2).to.be.fulfilled

      // Between two
      let tx3 = SWSupplyManagerContract.functions.addMintPermission(factory, maxRange.add(2), maxRange.add(101))
      await expect(tx3).to.be.fulfilled
    })

  })

  describe('removeMintPermission() function', () => {

    it('should REVERT if no range exists', async () => {
      let tx = SWSupplyManagerContract.functions.removeMintPermission(factory, 0);
      await expect(tx).to.be.rejected;
    })

    context('When mint permission was given', () => {
      let tx;
      beforeEach(async () => {
        tx = await SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange);
      })

      it('should PASS if range exists', async () => {
        const tx = SWSupplyManagerContract.functions.removeMintPermission(factory, 0)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if caller is not owner', async () => {
        const tx = userSWSupplyManagerContract.functions.removeMintPermission(factory, 0)
        await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
      })

      it('should REVERT if range to delete does not exist', async () => {
        const tx = SWSupplyManagerContract.functions.removeMintPermission(factory, 1)
        await expect(tx).to.be.rejected;
        
        const tx2 = SWSupplyManagerContract.functions.removeMintPermission(factory, 99)
        await expect(tx2).to.be.rejected;
      })

      context('When mint permission was removed', () => {

        let tx;
        beforeEach(async () => {
          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 0);
        })
      
        it("should update factory's mint access range", async () => {
          const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          await expect(range.length).to.be.eql(0)
        })

        it('should emit MintPermissionRemoved event', async () => {
          let filterFromOperatorContract: ethers.ethers.EventFilter

          // Get event filter to get internal tx event
          filterFromOperatorContract = SWSupplyManagerContract.filters.MintPermissionRemoved(null, null);

          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filterFromOperatorContract.fromBlock = 0;
          let logs = await operatorProvider.getLogs(filterFromOperatorContract);
          expect(logs[0].topics[0]).to.be.eql(SWSupplyManagerContract.interface.events.MintPermissionRemoved.topic)
        })
        
        describe('MintPermissionRemoved Event', () => {

          it('should have factory address as `factory` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!
    
            const args = ev.args! as any
            expect(args.factory).to.be.eql(factory)
          })

          it('should have range in `range` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!
            const args = ev.args! as any
            expect(args.deleted_range).to.be.eql([minRange, maxRange])
          })
        })
      })

      context('When multiple ranges are permitted', () => {
        const minRange2 = maxRange.mul(2);
        const maxRange2 = minRange2.add(123);
        const minRange3 = maxRange2.mul(3);
        const maxRange3 = minRange3.add(444);

        beforeEach(async () => {
          await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2);
        })

        it('should have correct range in `range` field', async () => {
          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 0);  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!
          const args = ev.args! as any
          expect(args.deleted_range).to.be.eql([minRange, maxRange])
        })

        it("should remove the correct range", async () => {
          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 0);
          const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range[0].minID).to.be.eql(minRange2)
          expect(range[0].maxID).to.be.eql(maxRange2)
        })

        it("should reduce length of range array by 1", async () => {
          const range_pre = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range_pre.length).to.be.eql(2)

          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 0);
          const range_post = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range_post.length).to.be.eql(1)
        })

        it("should move last range to removed range, if different", async () => {
          tx = await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3);

          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 0);
          const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range[0]).to.be.eql([minRange3, maxRange3])
          expect(range[1]).to.be.eql([minRange2, maxRange2])
          expect(range.length).to.be.eql(2)
        })

        it("should move last range to removed range, if different (#2)", async () => {
          tx = await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3);

          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 1);
          const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range[0]).to.be.eql([minRange, maxRange])
          expect(range[1]).to.be.eql([minRange3, maxRange3])
          expect(range.length).to.be.eql(2)
        })

        it("should simply delete last element if range is last", async () => {
          tx = await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3);

          tx = await SWSupplyManagerContract.functions.removeMintPermission(factory, 2);
          const range = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(range[0]).to.be.eql([minRange, maxRange])
          expect(range[1]).to.be.eql([minRange2, maxRange2])
          expect(range.length).to.be.eql(2)
        })

        it("should allow delete all ranges and re-order ranges", async () => {
          await SWSupplyManagerContract.functions.removeMintPermission(factory, 0); // Range 1
          await SWSupplyManagerContract.functions.removeMintPermission(factory, 0); // Range 2
          const rangePre = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(rangePre.length).to.be.eql(0)

          await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3);
          await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2);
          await SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange);
          const rangePost = await SWSupplyManagerContract.functions.getFactoryAccessRanges(factory)
          expect(rangePost.length).to.be.eql(3)
          expect(rangePost[0]).to.be.eql([minRange3, maxRange3])
          expect(rangePost[1]).to.be.eql([minRange2, maxRange2])
          expect(rangePost[2]).to.be.eql([minRange, maxRange])
        })
      })

    })
  })

  describe('activateFactory() function', () => {

    it('should PASS if caller is owner', async () => {
      const tx = SWSupplyManagerContract.functions.activateFactory(factory)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userSWSupplyManagerContract.functions.activateFactory(factory)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When factory was activated', () => {
      let tx;
      beforeEach(async () => {
        tx = await SWSupplyManagerContract.functions.activateFactory(factory)
      })

      it('should set factory to active', async () => {
        let status = await SWSupplyManagerContract.functions.getFactoryStatus(factory);
        expect(status).to.be.eql(true)
      })

      it('should emit FactoryActivation event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = SWSupplyManagerContract.filters.FactoryActivation(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(SWSupplyManagerContract.interface.events.FactoryActivation.topic)
      })
      
      describe('FactoryActivation Event', () => {
        it('should have factory address as `factory` field', async () => {  
          const tx = await SWSupplyManagerContract.functions.activateFactory(factory)
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.factory).to.be.eql(factory)
        })
      })
    })
  })

  describe('shutdownFactory() function', () => {
    beforeEach(async () => {
      await SWSupplyManagerContract.functions.activateFactory(factory)
    })

    it('should PASS if caller is owner', async () => {
      const tx = SWSupplyManagerContract.functions.shutdownFactory(factory)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userSWSupplyManagerContract.functions.shutdownFactory(factory)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When factory was shutdown', () => {
      let tx;
      beforeEach(async () => {
        tx = await SWSupplyManagerContract.functions.shutdownFactory(factory)
      })

      it('should set factory to inactive', async () => {
        let status = await SWSupplyManagerContract.functions.getFactoryStatus(factory);
        expect(status).to.be.eql(false)
      })

      it('should emit FactoryShutdown event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = SWSupplyManagerContract.filters.FactoryShutdown(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(SWSupplyManagerContract.interface.events.FactoryShutdown.topic)
      })
      
      describe('FactoryShutdown Event', () => {
        it('should have factory address as `factory` field', async () => {  
          const tx = await SWSupplyManagerContract.functions.activateFactory(factory)
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.factory).to.be.eql(factory)
        })
      })
    })
  })

  describe('lockRangeMintPermissions() function', () => {

    let range: AssetRange = {minID: minRange, maxID: maxRange}

    it('should PASS if caller is owner', async () => {
      const tx = SWSupplyManagerContract.functions.lockRangeMintPermissions(range)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userSWSupplyManagerContract.functions.lockRangeMintPermissions(range)
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When range was locked', () => {
      let tx;
      beforeEach(async () => {
        tx = await SWSupplyManagerContract.functions.lockRangeMintPermissions(range)
      })

      it('should push range in `lockedRanges` array', async () => {
        let ranges = await SWSupplyManagerContract.functions.getLockedRanges();
        expect(ranges.length).to.be.eql(1)

        await SWSupplyManagerContract.functions.lockRangeMintPermissions(range);
        let ranges2 = await SWSupplyManagerContract.functions.getLockedRanges();
        expect(ranges2.length).to.be.eql(2)
      })

      it('should emit RangeLocked event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = SWSupplyManagerContract.filters.RangeLocked(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await operatorProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(SWSupplyManagerContract.interface.events.RangeLocked.topic)
      })
      
      describe('RangeLocked Event', () => {
        it('should have correct range as `range` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.locked_range).to.be.eql([minRange, maxRange])
        })
      })
    })
  })

  describe('setMaxSupplies() function', () => {
    const id = new BigNumber(981273918273)
    const maxSupply = new BigNumber(100)

    it('should PASS if caller is owner', async () => {
      const tx = SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply])
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userSWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply])
      await expect(tx).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    it('should REVERT if arrays are not the same length', async () => {
      const tx = SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply, maxSupply])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#setMaxSupply: INVALID_ARRAYS_LENGTH"))
    })

    context('Wen max supply is already set', () => {

      beforeEach(async () => {
        await SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply])
      })

      it('should PASS if new max supply is lower', async () => {
        const tx = SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply.sub(1)])
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if new max supply is same', async () => {
        const tx = SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply])
        await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#setMaxSupply: INVALID_NEW_MAX_SUPPLY"))
      })

      it('should REVERT if new max supply is higher', async () => {
        const tx = SWSupplyManagerContract.functions.setMaxSupplies([id], [maxSupply.add(1)])
        await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#setMaxSupply: INVALID_NEW_MAX_SUPPLY"))
      })

      it('should REVERT if new max supply is 0', async () => {
        const tx = SWSupplyManagerContract.functions.setMaxSupplies([id], [0])
        await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#setMaxSupply: INVALID_NEW_MAX_SUPPLY"))
      })
    })
  })

  describe('batchMint() function', () => {
    const minRange2 = maxRange.add(9)
    const maxRange2 = minRange2.add(333)
    const ids2 = new Array(nTokenTypes).fill('').map((a, i) => minRange2.add(a))

    const minRange3 = maxRange2.add(11)
    const maxRange3 = minRange3.add(741)
    const ids3 = new Array(nTokenTypes).fill('').map((a, i) => minRange3.add(a))

    beforeEach(async () => {
      await SWSupplyManagerContract.functions.activateFactory(factory)
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange)
    })

    it('should REVERT if called by inactive factory, but authorized IDs', async () => {
      await SWSupplyManagerContract.functions.shutdownFactory(factory)
      const tx = factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: FACTORY_NOT_ACTIVE"))
    })

    it('should REVERT if IDs to mint are not authorized', async () => {
      let invalid_ids = new Array(nTokenTypes).fill('').map((a, i) => maxRange.add(a+1))
      const tx = factoryContract.functions.batchMint(userAddress, invalid_ids, amounts, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
      
      let invalid_ids_low = new Array(nTokenTypes).fill('').map((a, i) => minRange.add(a-1))
      const tx_2 = factoryContract.functions.batchMint(userAddress, invalid_ids_low, amounts, [])
      await expect(tx_2).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))

      // With mltiple ranges
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)

      let invalid_ids_high_2 = new Array(nTokenTypes).fill('').map((a, i) => maxRange2.add(a+1))
      const tx3 = factoryContract.functions.batchMint(userAddress, invalid_ids_high_2, amounts, [])
      await expect(tx3).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
      
      let invalid_ids_low_3 = new Array(nTokenTypes).fill('').map((a, i) => minRange3.add(a-1))
      const tx4 = factoryContract.functions.batchMint(userAddress, invalid_ids_low_3, amounts, [])
      await expect(tx4).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
    })

    it('should REVERT if NO id ranges are authorized for factory', async () => {
      await SWSupplyManagerContract.functions.removeMintPermission(factory, 0)
      const tx = factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      await expect(tx).to.be.rejected;
    })

    it('should REVERT if only 1 ID to mint is not authorized', async () => {
      let invalid_ids = ids.slice()
      invalid_ids[invalid_ids.length - 1] = maxRange.add(1)
      const tx = factoryContract.functions.batchMint(userAddress, invalid_ids, amounts, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
    })

    it('should REVERT if exceeds max supply', async () => {
      const max_supply = nTokensPerType - 1
      const id = nTokenTypes - 1
      await SWSupplyManagerContract.functions.setMaxSupplies([id], [max_supply])
      const tx = factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: MAX_SUPPLY_EXCEEDED"))
    })

    it('should PASS if reach exact max supply', async () => {
      const max_supply = nTokensPerType
      const id = nTokenTypes - 1
      await SWSupplyManagerContract.functions.setMaxSupplies([id], [max_supply])
      const tx = factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      await expect(tx).to.be.fulfilled
    })

    it('should update current supply if max supply is set', async () => {
      const max_supply = nTokensPerType
      const id = nTokenTypes - 1
      await SWSupplyManagerContract.functions.setMaxSupplies([id], [max_supply])
      await factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      const current_supply = await SWSupplyManagerContract.functions.getCurrentSupplies([id])
      const get_max_supply = await SWSupplyManagerContract.functions.getMaxSupplies([id])
      expect(current_supply[0]).to.be.eql(new BigNumber(max_supply))
      expect(current_supply[0]).to.be.eql(get_max_supply[0])
    })

    it('should NOT update current supply if max supply is NOT set', async () => {
      const id = nTokenTypes - 1
      await factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      const current_supply = await SWSupplyManagerContract.functions.getCurrentSupplies([id])
      const get_max_supply = await SWSupplyManagerContract.functions.getMaxSupplies([id])
      expect(current_supply[0]).to.be.eql(new BigNumber(0))
      expect(current_supply[0]).to.be.eql(get_max_supply[0])
    })

    it('should PASS if caller is activated and authorized factory', async () => {
      const tx = factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if id is in a later range', async () => {
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      const tx = factoryContract.functions.batchMint(userAddress, ids2, amounts, [])
      await expect(tx).to.be.fulfilled

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx2 = factoryContract.functions.batchMint(userAddress, ids3, amounts, [])
      await expect(tx2).to.be.fulfilled
    })

    it('should PASS if some ids are in different ranges', async () => {
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      const tx = factoryContract.functions.batchMint(userAddress, ids.concat(ids2), amounts.concat(amounts), [])
      await expect(tx).to.be.fulfilled

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx2 = factoryContract.functions.batchMint(userAddress, ids.concat(ids3), amounts.concat(amounts), [])
      await expect(tx2).to.be.fulfilled

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx3 = factoryContract.functions.batchMint(userAddress, [maxRange, maxRange2, maxRange3], [2,2,2], [])
      await expect(tx3).to.be.fulfilled

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx4 = factoryContract.functions.batchMint(userAddress, [minRange, minRange2, minRange3], [2,2,2], [])
      await expect(tx4).to.be.fulfilled

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx5 = factoryContract.functions.batchMint(userAddress, [maxRange, maxRange3], [2,2], [])
      await expect(tx5).to.be.fulfilled
    })

    it('should REVERT if some ids in different ranges are not sorted', async () => {
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      const tx = factoryContract.functions.batchMint(userAddress, ids2.concat(ids), amounts.concat(amounts), [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      const tx2 = factoryContract.functions.batchMint(userAddress, ids.concat(ids3).concat(ids2), amounts.concat(amounts).concat(amounts), [])
      await expect(tx2).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx3 = factoryContract.functions.batchMint(userAddress, [maxRange, maxRange3, maxRange2], [2,2,2], [])
      await expect(tx3).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx4 = factoryContract.functions.batchMint(userAddress, [minRange, minRange3, minRange2], [2,2,2], [])
      await expect(tx4).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
    })

    context('When tokens were minted', () => {
      beforeEach(async () => {
        await factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      })

      it('should mint tokens to recipient', async () => {
        const addresses = Array(ids.length).fill(userAddress)
        const balances = await SWSupplyManagerContract.functions.balanceOfBatch(addresses, ids);
        for (let i = 0; i < ids.length; i++) {
          expect(balances[i]).to.be.eql(new BigNumber(amounts[i]))
        }
      })
    })
  })

  describe('mint() function', () => {
    const id = minRange.add(1)
    const amount = amounts[0]

    const minRange2 = maxRange.add(9)
    const maxRange2 = minRange2.add(333)
    const id2 = minRange2.add(1)

    const minRange3 = maxRange2.add(11)
    const maxRange3 = minRange3.add(741)
    const id3 = minRange3.add(1)

    beforeEach(async () => {
      await SWSupplyManagerContract.functions.activateFactory(factory)
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange, maxRange)
    })

    it('should REVERT if called by inactive factory, but authorized IDs', async () => {
      await SWSupplyManagerContract.functions.shutdownFactory(factory)
      const tx = factoryContract.functions.mint(userAddress, id, amount, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: FACTORY_NOT_ACTIVE"))
    })

    it('should REVERT if IDs to mint are not authorized', async () => {
      let invalid_id_high = maxRange.add(1)
      const tx = factoryContract.functions.mint(userAddress, invalid_id_high, amount, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))

      let invalid_id_low = minRange.sub(1)
      const tx1 = factoryContract.functions.mint(userAddress, invalid_id_low, amount, [])
      await expect(tx1).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))

      // With mltiple ranges
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)

      let invalid_ids_high_2 = maxRange2.add(1)
      const tx2 = factoryContract.functions.mint(userAddress, invalid_ids_high_2, amount, [])
      await expect(tx2).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
      
      let invalid_id_low_2 = minRange3.sub(1)
      const tx3 = factoryContract.functions.mint(userAddress, invalid_id_low_2, amount, [])
      await expect(tx3).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: ID_OUT_OF_RANGE"))
    })

    it('should REVERT if exceeds max supply', async () => {
      const max_supply = nTokensPerType - 1
      const id = nTokenTypes - 1
      await SWSupplyManagerContract.functions.setMaxSupplies([id], [max_supply])
      const tx = factoryContract.functions.mint(userAddress, id, amount, [])
      await expect(tx).to.be.rejectedWith(RevertError("SWSupplyManager#_validateMints: MAX_SUPPLY_EXCEEDED"))
    })

    it('should PASS if reach exact max supply', async () => {
      const max_supply = nTokensPerType
      const id = nTokenTypes - 1
      await SWSupplyManagerContract.functions.setMaxSupplies([id], [max_supply])
      const tx = factoryContract.functions.mint(userAddress, id, amount, [])
      await expect(tx).to.be.fulfilled
    })

    it('should update current supply if max supply is set', async () => {
      const max_supply = nTokensPerType
      const id = nTokenTypes - 1
      await SWSupplyManagerContract.functions.setMaxSupplies([id], [max_supply])
      await factoryContract.functions.mint(userAddress, id, amount, [])
      const current_supply = await SWSupplyManagerContract.functions.getCurrentSupplies([id])
      const get_max_supply = await SWSupplyManagerContract.functions.getMaxSupplies([id])
      expect(current_supply[0]).to.be.eql(new BigNumber(max_supply))
      expect(current_supply[0]).to.be.eql(get_max_supply[0])
    })

    it('should NOT update current supply if max supply is NOT set', async () => {
      const id = nTokenTypes - 1
      await factoryContract.functions.mint(userAddress, id, amount, [])
      const current_supply = await SWSupplyManagerContract.functions.getCurrentSupplies([id])
      const get_max_supply = await SWSupplyManagerContract.functions.getMaxSupplies([id])
      expect(current_supply[0]).to.be.eql(new BigNumber(0))
      expect(current_supply[0]).to.be.eql(get_max_supply[0])
    })

    it('should PASS if caller is activated and authorized factory', async () => {
      const tx = factoryContract.functions.mint(userAddress, id, amount, [])
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if id is in a later range', async () => {
      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange2, maxRange2)
      const tx = factoryContract.functions.mint(userAddress, id2, amount, [])
      await expect(tx).to.be.fulfilled

      await SWSupplyManagerContract.functions.addMintPermission(factory, minRange3, maxRange3)
      const tx2 = factoryContract.functions.mint(userAddress, id3, amount, [])
      await expect(tx2).to.be.fulfilled
    })

    context('When tokens were minted', () => {
      beforeEach(async () => {
        await factoryContract.functions.batchMint(userAddress, ids, amounts, [])
      })

      it('should mint tokens to recipient', async () => {
        const balance = await SWSupplyManagerContract.functions.balanceOf(userAddress, id);
        expect(balance).to.be.eql(new BigNumber(amount))
      })
    })
  })

})