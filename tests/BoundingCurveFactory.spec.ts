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

const {
  wallet: treasuryWallet,
  provider: treasuryProvider,
  signer: treasurySigner
} = utils.createTestWallet(web3, 4)

const getBig = (id: number) => BigNumber.from(id);

describe('BoundingCurveFactory ', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let treasuryAddress: string
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
  const nTokensPerType = BigNumber.from(500).mul(100)

  // Minting costs 10 golds and scaling USDC
  const COST_IN_ITEMS = BigNumber.from(10) // 10 golds
  const USDC_CURVE_CONSTANT = 4375      // 43.75
  const USDC_CURVE_SCALE_DOWN = 1       // No scaling
  const USDC_CURVE_TICK_SIZE = 10 * 100 // 10 mint per tick

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
    treasuryAddress = await treasuryWallet.getAddress()
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
      COST_IN_ITEMS,
      USDC_CURVE_CONSTANT,
      USDC_CURVE_SCALE_DOWN,
      USDC_CURVE_TICK_SIZE
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

    describe('usdcCurve()', () => {
      it('Returns same value for x in same tick', async () => {
        const val1 = await factoryContract.usdcCurve(0)
        const val2 = await factoryContract.usdcCurve(USDC_CURVE_TICK_SIZE - 1)
        expect(val1).to.be.eql(val2)
      })

      it('value increases for x in higher ticks', async () => {
        const val1 = await factoryContract.usdcCurve(0)
        const val2 = await factoryContract.usdcCurve(USDC_CURVE_TICK_SIZE)
        const diff = val2.sub(val1).toNumber()
        expect(diff).to.be.gt(0)
      })

      it('value should match spreadsheet', async () => {
        const val1 = await factoryContract.usdcCurve(0)
        const val2 = await factoryContract.usdcCurve(10 * 100)
        const val3 = await factoryContract.usdcCurve(30 * 100)
        const val4 = await factoryContract.usdcCurve(40 * 100)
        const val5 = await factoryContract.usdcCurve(100 * 100)
        const val6 = await factoryContract.usdcCurve(250 * 100)
        const val7 = await factoryContract.usdcCurve(1000 * 100)

        expect(val1.toNumber()).to.be.eql(19140625)
        expect(val2.toNumber()).to.be.eql(28890625)
        expect(val3.toNumber()).to.be.eql(54390625)
        expect(val4.toNumber()).to.be.eql(70140625)
        expect(val5.toNumber()).to.be.eql(206640625)
        expect(val6.toNumber()).to.be.eql(862890625)
        expect(val7.toNumber()).to.be.eql(10894140625)
      })

    })

    describe('usdcCost()', () => {
      it('Returns same value for x in same tick', async () => {
        const id = 1001
        const val1 = (await factoryContract.usdcCost(id, 1)).mul(USDC_CURVE_TICK_SIZE - 1)
        const val2 = await factoryContract.usdcCost(id, USDC_CURVE_TICK_SIZE - 1)
        expect(val1).to.be.eql(val2)
      })

      it('value increases for x in higher ticks', async () => {
        const id = 1001
        const val1 = (await factoryContract.usdcCost(id, 1)).mul(USDC_CURVE_TICK_SIZE + 1)
        const val2 = await factoryContract.usdcCost(id, USDC_CURVE_TICK_SIZE + 1)
        const diff = val2.sub(val1).toNumber()
        expect(diff).to.be.gt(0)
      })
    })

  })

  describe('BoundingCurveFactory', () => {

    let conditions =  [
      'Mint with sender being recipient',
      'Mint with sender NOT being recipient',
      'Mint more than tick size'
    ]

    conditions.forEach(function(condition) { 
      context(condition as string, () => {
        let data;
        let recipient;
        let ids_to_mint
        let amounts_to_mint
        let ids_to_send
        let amounts_to_send
        let usdc_total_cost: BigNumber

        beforeEach(async () => {
          if (condition == conditions[1]) {
            recipient = randomAddress 
          } else {
            recipient = userAddress
          }

          // Mint more or less
          ids_to_mint = [1001, 1003, 1007]
          if (condition == conditions[2]) {
            amounts_to_mint = [1100, 3100, 4200]
            ids_to_send = [1, 2, 3, 4, 5]
            amounts_to_send = [15000, 15000, 15000, 15000, 24000] // Total of 420 items

            // Going over the curve manually to be safe
            // ID 1001
            usdc_total_cost = (await factoryContract.usdcCurve(0)).mul(1000)
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(1000)).mul(100))

            // ID 1003
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(0)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(1000)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(2000)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(3000)).mul(100))

            // ID 1007
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(0)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(1000)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(2000)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(3000)).mul(1000))
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(4000)).mul(200))

          } else {
            amounts_to_mint = [100, 200, 300]
            ids_to_send = [1, 2, 3, 4, 5]
            amounts_to_send = [1000, 1000, 1000, 1000, 2000] // Total of 60 items
            usdc_total_cost = (await factoryContract.usdcCurve(0)).mul(600)
          }

          
          data = getMintTokenRequestData(recipient, ids_to_mint, amounts_to_mint, usdc_total_cost)
        })

        it('should PASS if caller sends assets', async () => {
          let tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.fulfilled
        })

        it('should PASS if buying hero fraction', async () => {
          amounts_to_mint[0] = amounts_to_mint[0] + 1
          amounts_to_send[0] = amounts_to_send[0] + 10
          if (condition == conditions[2]) {
            usdc_total_cost = usdc_total_cost.add((await factoryContract.usdcCurve(1100)).mul(1))
          } else {
            usdc_total_cost = (await factoryContract.usdcCurve(0)).mul(601)
          }
          data = getMintTokenRequestData(recipient, ids_to_mint, amounts_to_mint, usdc_total_cost)

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

        it('should REVERT if items are not sorted by ascending order', async () => {
          const unsortedIDsToMint = [1001, 1007, 1003]
          const unsortedData = getMintTokenRequestData(recipient, unsortedIDsToMint, amounts_to_mint, usdc_total_cost)
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, unsortedData, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#onERC1155BatchReceived: UNSORTED itemsBoughtIDs ARRAY OR CONTAIN DUPLICATES"))
        })

        it('should REVERT if items contain duplicate', async () => {
          const dupIds = [1001, 1003, 1003]
          const dupData = getMintTokenRequestData(recipient, dupIds, amounts_to_mint, usdc_total_cost)
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, dupData, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#onERC1155BatchReceived: UNSORTED itemsBoughtIDs ARRAY OR CONTAIN DUPLICATES"))
        })

        it('should REVERT if too few items were sent', async () => {
          let bad_amounts_to_send
          if (condition == conditions[2]) {
            bad_amounts_to_send = [7400, 7500, 7500, 7500, 12000] 
          } else {
            bad_amounts_to_send = [500, 500, 500, 500, 900]
          }
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, bad_amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#onERC1155BatchReceived: INCORRECT NUMBER OF ITEMS SENT"))
        })

        it('should REVERT if too many items were sent', async () => {
          let bad_amounts_to_send
          if (condition == conditions[2]) {
            bad_amounts_to_send = [7500, 7500, 7500, 7600, 12000] 
          } else {
            bad_amounts_to_send = [500, 500, 500, 600, 1000]
          }
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, bad_amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#onERC1155BatchReceived: INCORRECT NUMBER OF ITEMS SENT"))
        })

        it('should REVERT if USDC needed exceeds maxUSDC', async () => {
          data = getMintTokenRequestData(userAddress, ids_to_mint, amounts_to_mint, usdc_total_cost.sub(1))
          const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids_to_send, amounts_to_send, data, TX_PARAM)
          await expect(tx).to.be.rejectedWith(RevertError("BoundingCurveFactory#onERC1155BatchReceived: MAX USDC EXCEEDED"))
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

          it('should update minted supplies', async () => {
            for (let i = 0; i < ids_to_mint.length; i++) {
              const supply = await factoryContract.mintedAmounts(ids_to_mint[i])
              expect(supply).to.be.eql(BigNumber.from(amounts_to_mint[i]))
            }
          })

          it('should increase cost to mint further hero if new tick', async () => {
            if (condition == conditions[2]) {
              const newCost = await factoryContract.usdcTotalCost(ids_to_mint, amounts_to_mint)
              const diff = newCost.sub(usdc_total_cost).toNumber()
              expect(diff).to.be.gt(0)
            } else {
              const newCost = await factoryContract.usdcTotalCost(ids_to_mint, amounts_to_mint)
              expect(newCost).to.be.eql(usdc_total_cost)
            }
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
                await factoryContract.withdrawERC20(treasuryAddress, usdcContract.address)
              })
      
              it('should update factory usdc balance', async () => {
                let factory_balance = await usdcContract.balanceOf(factory)
                expect(factory_balance).to.be.eql(constants.Zero)
              })
        
              it('should update recipient usdc balance', async () => {
                let recipient_balance = await usdcContract.balanceOf(treasuryAddress)
                expect(recipient_balance).to.be.eql(usdc_total_cost)
              })
            })
          })
        })
      })
    })
  })
})
