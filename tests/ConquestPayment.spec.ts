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
  ERC1155Mock,
  ERC20MintMock,
  ConquestPayment
} from 'src/gen/typechain'

import { BigNumber, constants } from 'ethers'

import { web3 } from 'hardhat'

// init test wallets from package.json mnemonic

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

describe('ConquestPayment', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let usdcAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Wrapped DAI
  let usdcContract: ERC20MintMock
  let userUsdcContract: ERC20MintMock

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: ConquestPayment

  // Factory manager
  let userFactoryContract: ConquestPayment

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = BigNumber.from(30).add(1) 
  const nTokensPerType = BigNumber.from(100).mul(100)

  const unitPrice = BigNumber.from(15).mul(BigNumber.from(10).pow(5)) //1.5 USDC
  const nUSDC = BigNumber.from(5).mul(unitPrice)

  // Ticket token Param
  const ticketID = BigNumber.from(555);

  // Range values 
  const silverMinRange = BigNumber.from(1);
  const silverMaxRange = BigNumber.from(500);

  const startTime = BigNumber.from(Math.floor(Date.now() / 1000))
  const endTime = BigNumber.from(startTime.add(60*60)) // 1 hour from now

  // usdc Param
  const baseTokenAmount = BigNumber.from(10000000).mul(BigNumber.from(10).pow(6))

  // Arrays for cards
  const ids = new Array(nTokenTypes.toNumber()-1).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => nTokensPerType)
  
  // Add conquest tickets
  ids.push(ticketID)

  // Init
  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    usdcAbstract = await AbstractContract.fromArtifactName('ERC20MintMock')
    factoryAbstract = await AbstractContract.fromArtifactName('ConquestPayment')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Wrapped DAI
    usdcContract = await usdcAbstract.deploy(ownerWallet) as ERC20MintMock
    userUsdcContract = await usdcContract.connect(userSigner) as ERC20MintMock

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet, [ownerAddress]) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
      ticketID, 
      silverMinRange, 
      silverMaxRange
    ]) as ConquestPayment
    userFactoryContract = await factoryContract.connect(userSigner) as ConquestPayment

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.activateFactory(factory);
    await skyweaverAssetsContract.addMintPermission(factory, ticketID, ticketID, startTime, endTime);

    // Let owner be a "factory" to mint items
    await skyweaverAssetsContract.activateFactory(ownerAddress);
    await skyweaverAssetsContract.addMintPermission(ownerAddress, silverMinRange, silverMaxRange.add(100), startTime, endTime);

    // Mint items to user
    await skyweaverAssetsContract.batchMint(userAddress, ids, amounts , [])

    // Mint usdc to owner and user
    await usdcContract.mockMint(ownerAddress, baseTokenAmount)
    await usdcContract.mockMint(userAddress, baseTokenAmount)
  })

  describe('Getter functions', () => {
    describe('skyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.skyweaverAssets()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
      })
    })

    describe('supportsInterface()', () => {
      it('should return true for 0x01ffc9a7 (ERC165)', async () => {
        const support = await factoryContract.supportsInterface('0x01ffc9a7')
        expect(support).to.be.eql(true)
      })

      it('should return true for 0x4e2312e0 (ERC1155Receiver)', async () => {
        const support = await factoryContract.supportsInterface('0x4e2312e0')
        expect(support).to.be.eql(true)
      })
    })
  })

  describe('ConquestPayment', () => {

    let conditions = [
      'safeTransferFrom() with Silver Cards',
      'safeBatchTransferFrom() with Silver Cards',
      'safeTransferFrom() with ticket',
      'safeBatchTransferFrom() with ticket'
    ]

    conditions.forEach(function(condition) { 
      context(condition as string, () => {

        it('should PASS if caller sends assets', async () => {
          let tx;
          if (condition == conditions[0]) {
            for (let i = 0; i < ids.length; i++) {
              tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ids[i], amounts[i], [], TX_PARAM)
            }
          } else if (condition == conditions[1]) {
            tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
          } else if (condition == conditions[2]) {
            tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amounts[0], [], TX_PARAM)
          } else if (condition == conditions[3]) {
            tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amounts[0]], [], TX_PARAM)
          }

          await expect(tx).to.be.fulfilled
        })

        it('should REVERT if asset is not silver card or ticket', async () => {
          let tx;
          await skyweaverAssetsContract.batchMint(userAddress, [silverMaxRange.add(1), silverMaxRange.add(2)], [nTokensPerType, nTokensPerType] , [])
          if (condition == conditions[0]) {
            tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, silverMaxRange.add(1), nTokensPerType, [])
          } else {
            tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [silverMaxRange.add(1), silverMaxRange.add(2)], [nTokensPerType, nTokensPerType], [])
          }
          await expect(tx).to.be.rejectedWith(RevertError("ConquestPayment#onERC1155BatchReceived: ID_IS_INVALID"))
        })

        context('When assets were sent to factory', () => {

          let tx;
          beforeEach(async () => {
            if (condition == conditions[0]) {
              for (let i = 0; i < ids.length; i++) {
                tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ids[i], amounts[i], [], TX_PARAM)
              }
            } else if (condition == conditions[1]) {
              tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
            } else if (condition == conditions[2]) {
              tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amounts[0], [], TX_PARAM)
            } else if (condition == conditions[3]) {
              tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amounts[0]], [], TX_PARAM)
            }
          })
          
          if (condition == conditions[0] || condition == conditions[1]) {
            it('should leave factory silver cards balance to 0', async () => {
              let factory_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => factory)
              let factory_balances = await userSkyweaverAssetContract.balanceOfBatch(factory_addresses, ids)
              for (let i = 0; i < ids.length; i++) {
                expect(factory_balances[i]).to.be.eql(constants.Zero)
              }
            })

            it('should update users silver cards balance', async () => {
              let user_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => userAddress)
              let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, ids)
              for (let i = 0; i < ids.length; i++) {
                expect(userBalances[i]).to.be.eql(constants.Zero)
              }
            })

          } else {
            it('should leave factory conquest ticket balance to 0', async () => {
              let factory_balance = await userSkyweaverAssetContract.balanceOf(factory, ticketID)
              expect(factory_balance).to.be.eql(constants.Zero)
            })

            it('should update users silver cards balance', async () => {
              let factory_balance = await userSkyweaverAssetContract.balanceOf(factory, ticketID)
              expect(factory_balance).to.be.eql(constants.Zero)
            })
          }
        })
      })
    })
    
    describe('withdraw() function', () => {
      let recipient = randomWallet.address

      beforeEach(async () => {
        await userUsdcContract.transfer(factory, nUSDC)
      })

      it('should PASS if caller is owner', async () => {
        const tx = factoryContract.withdrawERC20(recipient, usdcContract.address, TX_PARAM)
        await expect(tx).to.be.fulfilled
      })
  
      it('should REVERT if caller is not owner', async () => {
        const tx = userFactoryContract.withdrawERC20(recipient, usdcContract.address, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
      })
  
      it('should REVERT if recipient is 0x0', async () => {
        const tx = factoryContract.withdrawERC20(ZERO_ADDRESS, usdcContract.address, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("ConquestPayment#withdrawERC20: INVALID_RECIPIENT"))
      })

      context('When USDC is withdrawn', () => {
        beforeEach(async () => {
          await factoryContract.withdrawERC20(recipient, usdcContract.address)
        })

        it('should update factory usdc balance', async () => {
          let factory_balance = await usdcContract.balanceOf(factory)
          expect(factory_balance).to.be.eql(constants.Zero)
        })
  
        it('should update recipient usdc balance', async () => {
          let recipient_balance = await usdcContract.balanceOf(recipient)
          expect(recipient_balance).to.be.eql(nUSDC)
        })
      })
    })
  })
})
