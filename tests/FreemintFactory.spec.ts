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
  FreemintFactory
} from 'src/gen/typechain'

import { BigNumber } from 'ethers'

import { web3 } from 'hardhat'

// init test wallets from package.json mnemonic

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

describe('FreemintFactory', () => {
  let userAddress: string
  let ownerAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets

  // Factory
  let factoryContract: FreemintFactory
  let userFactoryContract: FreemintFactory

  // Range values 
  const minRange = BigNumber.from(1000000001);
  const maxRange = BigNumber.from(1000000500);
  const startTime = BigNumber.from(Math.floor(Date.now() / 1000))
  const endTime = BigNumber.from(startTime.add(60*60)) // 1 hour from now

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    factoryAbstract = await AbstractContract.fromArtifactName('FreemintFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet, [ownerAddress]) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
    ]) as FreemintFactory
    userFactoryContract = await factoryContract.connect(userSigner) as FreemintFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.activateFactory(factory);
    await skyweaverAssetsContract.addMintPermission(factory, minRange, maxRange, startTime, endTime);
  })

  describe('Getter functions', () => {
    describe('getSkyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.getSkyweaverAssets()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
      })
    })

    describe('supportsInterface()', () => {
      it('should return true for 0x01ffc9a7 (ERC165)', async () => {
        const support = await factoryContract.supportsInterface('0x01ffc9a7')
        expect(support).to.be.eql(true)
      })
      it('should return false for 0x4e2312e0 (ERC1155Receiver)', async () => {
        const support = await factoryContract.supportsInterface('0x4e2312e0')
        expect(support).to.be.eql(false)
      })
    })
  })

  describe('batchMint()', () => {
    let mintIds = [1000000033, 1000000066, 1000000099, 1000000133]
    let mintAmounts = [100, 200, 500, 100]
    let recipients: string[]

    beforeEach(async() => {
      recipients = [userAddress, randomAddress]
    })

    it('should PASS if caller is owner', async () => {
      const tx = factoryContract.batchMint(recipients, mintIds, mintAmounts)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx = userFactoryContract.batchMint(recipients, mintIds, mintAmounts)
      await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
    })

    context('When assets were minted', () => {
      beforeEach(async () => {
        await factoryContract.batchMint(recipients, mintIds, mintAmounts)
      })

      it('should update user silver cards balance', async () => {
        let n_ids = mintIds.length
        let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
        let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, mintIds)
        for (let i = 0; i < n_ids; i++) {
          expect(userBalances[i]).to.be.eql(BigNumber.from(mintAmounts[i]))
        }
      })

      it('should update recipients assets balance', async () => {
        let n_ids = mintIds.length
        
        for (let r = 0; r < recipients.length; r++) {
          let user_addresses = new Array(n_ids).fill('').map((a, i) => recipients[r])
          let balances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, mintIds)
          for (let i = 0; i < n_ids; i++) {
            expect(balances[i]).to.be.eql(BigNumber.from(mintAmounts[i]))
          }
        }
      })
    })
  })
})