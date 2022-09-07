import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  getMintTokenRequestData,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'

import { 
  SkyweaverAssets,
  ERC20MintMock,
  BoundingCurveFactory
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

describe('BoundingCurveFactory ', () => {
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
  let factoryContract: BoundingCurveFactory 

  // Factory manager
  let userFactoryContract: BoundingCurveFactory 

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = BigNumber.from(50)
  const nTokensPerType = BigNumber.from(100).mul(100)

  // Minting costs 10 golds and 15 USDC
  const unitPriceItem = BigNumber.from(10) // 10 golds
  const unitPriceUSDC = BigNumber.from(15).mul(BigNumber.from(10).pow(6)).div(100) //15 USDC per 100 unit

  // Ticket token Param
  const ticketID = BigNumber.from(555);

  // Range values 
  const goldMinRange = BigNumber.from(1);
  const goldMaxRange = BigNumber.from(500);
  const itemMintMinRange = BigNumber.from(1000)
  const itemMintMaxRange = BigNumber.from(1500)

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
    factoryAbstract = await AbstractContract.fromArtifactName('BoundingCurveFactory')
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
      usdcContract.address,
      skyweaverAssetsContract.address,
      goldMinRange, 
      goldMaxRange,
      unitPriceItem,
      unitPriceUSDC
    ]) as BoundingCurveFactory 
    userFactoryContract = await factoryContract.connect(userSigner) as BoundingCurveFactory 

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.activateFactory(factory);
    await skyweaverAssetsContract.addMintPermission(factory, itemMintMinRange, itemMintMaxRange, startTime, endTime);

    // Let owner be a "factory" to mint items
    await skyweaverAssetsContract.activateFactory(ownerAddress);
    await skyweaverAssetsContract.addMintPermission(ownerAddress, goldMinRange , goldMaxRange.add(100), startTime, endTime);

    // Mint items to user
    await skyweaverAssetsContract.batchMint(userAddress, ids, amounts , [])

    // Mint usdc to owner and user
    await usdcContract.mockMint(ownerAddress, baseTokenAmount)
    await usdcContract.mockMint(userAddress, baseTokenAmount)

    // User approves factory for USDC
    await userUsdcContract.approve(factory, ethers.constants.MaxUint256)
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

  describe('BoundingCurveFactory', () => {

    let recipientConditions =  [
      'Mint with sender being recipient',
      'Mint with sender NOT being recipient'
    ]

    recipientConditions.forEach(function(condition) { 
      context(condition as string, () => {
        let data;
        let recipient;
        const ids_to_mint = [1001, 1007]
        const amounts_to_mint = [100, 200]
        const ids_to_send = [1, 2, 3, 4, 5]
        const amounts_to_send = [500, 500, 500, 500, 1000] // Total of 30 items
        const usdc_total_cost = unitPriceUSDC.mul(300)

        beforeEach(() => {
          if (condition == recipientConditions[0]) {
            recipient = userAddress
          } else {
            recipient = randomAddress
          }
          data = getMintTokenRequestData(recipient, ids_to_mint, amounts_to_mint, usdc_total_cost)
        })

        it('should PASS if caller sends assets', async () => {
          let tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.fulfilled
        })

        it('should PASS if receiver is 0x0', async () => {
          data = getMintTokenRequestData(ethers.constants.AddressZero, ids_to_mint, amounts_to_mint, usdc_total_cost)
          let tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.fulfilled

        })

        it('should REVERT if item is not correct', async () => {
          await skyweaverAssetsContract.batchMint(userAddress, [goldMaxRange.add(1), goldMaxRange.add(2)], [nTokensPerType, nTokensPerType] , [])
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [goldMaxRange.add(1), goldMaxRange.add(2)], [1500, 1500], data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#onERC1155BatchReceived: ID_IS_INVALID"))
        })

        it('should REVERT if too few items were sent', async () => {
          const bad_amounts_to_send = [500, 500, 500, 500, 900]
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, bad_amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#constructor: INCORRECT NUMBER OF ITEMS SENT"))
        })

        it('should REVERT if too many items were sent', async () => {
          const bad_amounts_to_send = [500, 500, 500, 600, 1000]
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, bad_amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#constructor: INCORRECT NUMBER OF ITEMS SENT"))
        })

        it('should REVERT if USDC needed exceeds maxUSDC', async () => {
          data = getMintTokenRequestData(userAddress, ids_to_mint, amounts_to_mint, usdc_total_cost.sub(1))
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#constructor: INSUFFICIENT USDC"))
        })

        it('should REVERT if user doesnt have enough usdc', async () => {
          const usdc_balance = await usdcContract.balanceOf(userAddress)
          await userUsdcContract.transfer(randomAddress, usdc_balance.sub(usdc_total_cost.sub(1)))
          let tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
        })

        context('When items are sent to factory', () => {
          beforeEach(async () => {
            await userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          })
          
          it('should leave factory gold cards balance to 0', async () => {
            let factory_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => factory)
            let factory_balances = await userSkyweaverAssetContract.balanceOfBatch(factory_addresses, ids)
            for (let i = 0; i < ids.length; i++) {
              expect(factory_balances[i]).to.be.eql(constants.Zero)
            }
          })

          it('should update users gold cards balance', async () => {
            let user_addresses = new Array(ids_to_send.length).fill('').map((a, i) => userAddress)
            let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, ids_to_send)
            for (let i = 0; i < ids_to_send.length; i++) {
              expect(userBalances[i]).to.be.eql(nTokensPerType.sub(amounts_to_send[i]))
            }
          })

          it('should update recipient items minted balance', async () => {
            let recipient_addresses = new Array(ids_to_mint.length).fill('').map((a, i) => recipient)
            let recipient_Balances = await userSkyweaverAssetContract.balanceOfBatch(recipient_addresses, ids_to_mint)
            for (let i = 0; i < ids_to_mint.length; i++) {
              expect(recipient_Balances[i]).to.be.eql(BigNumber.from(amounts_to_mint[i]))
            }
          })

          it('should update the factory USDC balance', async () => {
            let balance = await usdcContract.balanceOf(factory)
            expect(balance).to.be.eql(usdc_total_cost)
          })

          it('should update the user USDC balance', async () => {
            let balance = await usdcContract.balanceOf(userAddress)
            expect(balance).to.be.eql( baseTokenAmount.sub(usdc_total_cost))
          })

          describe('withdrawERC20() function', () => {
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
              await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#withdrawERC20: INVALID_RECIPIENT"))
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
                if (condition == recipientConditions[0]) {
                  expect(recipient_balance).to.be.eql(baseTokenAmount)
                } else {
                  expect(recipient_balance).to.be.eql(usdc_total_cost)
                }
              })
            })
          })
        })
      })
    })
  })
})
