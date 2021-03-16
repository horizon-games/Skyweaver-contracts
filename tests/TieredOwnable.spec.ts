import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { TieredOwnableMock } from 'src/gen/typechain'
import { BigNumber, constants } from 'ethers'

import { web3 } from 'hardhat'

// init test wallets from package.json mnemonic

const {
  wallet: ownerWallet,
  provider: ownerProvider,
  signer: ownerSigner
} = utils.createTestWallet(web3, 0)

const {
  wallet: owner0Wallet,
  provider: owner0Provider,
  signer: owner0Signer
} = utils.createTestWallet(web3, 2)

const {
  wallet: owner5Wallet,
  provider: owner5Provider,
  signer: owner5Signer
} = utils.createTestWallet(web3, 3)

const {
  wallet: userWallet,
  provider: userProvider,
  signer: userSigner
} = utils.createTestWallet(web3, 4)

const {
  wallet: randomWallet,
  provider: randomProvider,
  signer: randomSigner
} = utils.createTestWallet(web3, 5)

const getBig = (id: number) => BigNumber.from(id);

describe('TieredOwnable', () => {
  let ownerAddress: string
  let owner0Address: string
  let owner5Address: string
  let userAddress: string
  let randomAddress: string

  let ownerMockAbstract: AbstractContract
  let contract: TieredOwnableMock
  let owner0Contract: TieredOwnableMock
  let owner5Contract: TieredOwnableMock
  let userContract: TieredOwnableMock
  let randomContract: TieredOwnableMock

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    owner0Address = await owner0Wallet.getAddress()
    owner5Address = await owner5Wallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    ownerMockAbstract = await AbstractContract.fromArtifactName('TieredOwnableMock')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    contract = await ownerMockAbstract.deploy(ownerWallet, [ownerAddress]) as TieredOwnableMock
    owner0Contract = await contract.connect(owner0Signer) as TieredOwnableMock
    owner5Contract = await contract.connect(owner5Signer) as TieredOwnableMock
    userContract = await contract.connect(userSigner) as TieredOwnableMock
    randomContract = await contract.connect(randomSigner) as TieredOwnableMock

    // Assing ownership to owners
    await contract.assignOwnership(owner0Address, 0)
    await contract.assignOwnership(owner5Address, 5)
  })

  describe('Getter functions', () => {
    describe('ownerTier() function', () => {
      it('should return expected owner tier', async () => {
        const owner_tier = await contract.getOwnerTier(ownerAddress)
        const owner0_tier = await contract.getOwnerTier(owner0Address)
        const owner5_tier = await contract.getOwnerTier(owner5Address)
        const user_tier = await contract.getOwnerTier(userAddress)

        expect(owner_tier).to.be.eql(constants.MaxUint256)
        expect(owner0_tier).to.be.eql(BigNumber.from(0))
        expect(owner5_tier).to.be.eql(BigNumber.from(5))
        expect(user_tier).to.be.eql(BigNumber.from(0))
      })
    })
  })

  describe('Constructor', () => {
    it('should not set owner to msg.sender by default', async () => {
      const contract_test = await ownerMockAbstract.deploy(ownerWallet, [randomAddress]) as TieredOwnableMock
      const owner_owner_tier = await contract_test.getOwnerTier(ownerAddress)
      const randowm_owner_tier = await contract_test.getOwnerTier(randomAddress)
      
      expect(owner_owner_tier).to.be.eql(constants.Zero)
      expect(randowm_owner_tier).to.be.eql(constants.MaxUint256)
    })
  })

  describe('assignOwnership() function', () => {
    let newTier = BigNumber.from(7)

    it('should PASS if caller is super owner', async () => {
      const tx = contract.assignOwnership(randomAddress, newTier)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is sub owner', async () => {
      const tx1 = owner5Contract.assignOwnership(randomAddress, newTier)
      await expect(tx1).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))

      const tx2 = owner0Contract.assignOwnership(randomAddress, newTier)
      await expect(tx2).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    it('should REVERT if caller is not owner', async () => {
      const tx1 = userContract.assignOwnership(randomAddress, newTier)
      await expect(tx1).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    it('should REVERT if address is 0x0', async () => {
      const tx1 = contract.assignOwnership(ZERO_ADDRESS, newTier)
      await expect(tx1).to.be.rejectedWith(RevertError("TieredOwnable#assignOwnership: INVALID_ADDRESS"))
    })

    it('should REVERT if address is sender', async () => {
      const tx1 = contract.assignOwnership(ownerAddress, newTier)
      await expect(tx1).to.be.rejectedWith(RevertError("TieredOwnable#assignOwnership: UPDATING_SELF_TIER"))
    })

    context('When ownerTier was updated', () => {
      let tx: ethers.ContractTransaction;
      beforeEach(async () => {
        tx = await contract.assignOwnership(randomAddress, newTier)
      })

      it('should set ownerTier to new ownerTier', async () => {
        const owner_tier = await contract.getOwnerTier(randomAddress)
        expect(owner_tier).to.be.eql(newTier)
      })

      it('should emit OwnershipGranted event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = contract.filters.OwnershipGranted(null, null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await ownerProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(contract.interface.getEventTopic(contract.interface.events["OwnershipGranted(address,uint256,uint256)"]))
      })
      
      describe('OwnershipGranted Event', () => {
        it('should have address value as `owner` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.owner).to.be.eql(randomAddress)
        })
        it('should have old tier as `previousTier` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.previousTier).to.be.eql(constants.Zero)
        })
        it('should have new tier as `newTier` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.newTier).to.be.eql(newTier)
        })
      })
    })
  })

  describe('onlyOwnerTier', () => {

    it('should REVERT if caller is  has lower tier', async () => {
      // Max tier
      const tx1 = owner5Contract.onlyMaxTier()
      await expect(tx1).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))

      const tx2 = owner0Contract.onlyMaxTier()
      await expect(tx2).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))

      const tx3 = userContract.onlyMaxTier()
      await expect(tx3).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
      
      // Tier 5
      const tx4 = owner0Contract.onlyTierFive()
      await expect(tx4).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))

      const tx5 = userContract.onlyTierFive()
      await expect(tx5).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    it('should PASS if caller is  has lower tier', async () => {
      // Max tier
      const tx1 = contract.onlyMaxTier()
      await expect(tx1).to.be.fulfilled

      // Tier 5
      const tx2 = contract.onlyTierFive()
      await expect(tx2).to.be.fulfilled
      
      const tx3 = owner5Contract.onlyTierFive()
      await expect(tx3).to.be.fulfilled

      // Tier 0
      const tx4 = contract.onlyTierZero()
      await expect(tx4).to.be.fulfilled

      const tx5 = owner5Contract.onlyTierZero()
      await expect(tx5).to.be.fulfilled

      const tx6 = owner0Contract.onlyTierZero()
      await expect(tx6).to.be.fulfilled

      const tx7 = userContract.onlyTierZero()
      await expect(tx7).to.be.fulfilled

      // Anyone (tier 0)
      const tx8 = contract.anyone()
      await expect(tx8).to.be.fulfilled

      const tx9 = owner5Contract.anyone()
      await expect(tx9).to.be.fulfilled

      const tx10 = owner0Contract.anyone()
      await expect(tx10).to.be.fulfilled

      const tx11 = userContract.anyone()
      await expect(tx11).to.be.fulfilled
    })

  })
})