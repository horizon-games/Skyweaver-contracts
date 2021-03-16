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
  ConquestEntriesFactory
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

describe('ConquestEntriesFactory', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let ticketAbstract: AbstractContract
  let wDaiAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Wrapped DAI
  let wDaiContract: ERC1155Mock
  let userwDaiContract: ERC1155Mock

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: ConquestEntriesFactory

  // Factory manager
  let userFactoryContract: ConquestEntriesFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = BigNumber.from(30) 
  const nTokensPerType = BigNumber.from(100).mul(100)

  const nWDAI = BigNumber.from(5).mul(BigNumber.from(10).pow(18))

  // Ticket token Param
  const ticketID = BigNumber.from(555);

  // Range values 
  const silverMinRange = BigNumber.from(1);
  const silverMaxRange = BigNumber.from(500);

  // wDAI Param
  const wDaiID = BigNumber.from(2);
  const baseTokenAmount = BigNumber.from(10000000).mul(BigNumber.from(10).pow(18))

  // Arrays
  const ids = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => nTokensPerType)

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    ticketAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    wDaiAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    factoryAbstract = await AbstractContract.fromArtifactName('ConquestEntriesFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Wrapped DAI
    wDaiContract = await wDaiAbstract.deploy(ownerWallet) as ERC1155Mock
    userwDaiContract = await wDaiContract.connect(userSigner) as ERC1155Mock

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet, [ownerAddress]) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
      wDaiContract.address,
      wDaiID,
      ticketID, 
      silverMinRange, 
      silverMaxRange
    ]) as ConquestEntriesFactory
    userFactoryContract = await factoryContract.connect(userSigner) as ConquestEntriesFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.activateFactory(factory);
    await skyweaverAssetsContract.addMintPermission(factory, ticketID, ticketID);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.activateFactory(ownerAddress);
    await skyweaverAssetsContract.addMintPermission(ownerAddress, silverMinRange, silverMaxRange.add(100));

    // Mint cards tokens to user
    await skyweaverAssetsContract.batchMint(userAddress, ids, amounts , [])

    // Mint wDAI to owner and user
    await wDaiContract.mintMock(ownerAddress, wDaiID, baseTokenAmount, [])
    await wDaiContract.mintMock(userAddress, wDaiID, baseTokenAmount, [])
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

  describe('ConquestEntriesFactory', () => {

    let conditions = [
      'safeTransferFrom() with Silver Cards',
      'safeBatchTransferFrom() with Silver Cards',
      'safeTransferFrom() with ARC',
      'safeBatchTransferFrom() with ARC'
    ]

    let recipientConditions =  [
      'with sender being recipient',
      'with sender NOT being recipient'
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
            tx = userwDaiContract.safeTransferFrom(userAddress, factory, wDaiID, nWDAI, [], TX_PARAM)
          } else if (condition == conditions[3]) {
            tx = userwDaiContract.safeBatchTransferFrom(userAddress, factory, [wDaiID], [nWDAI], [], TX_PARAM)
          }

          await expect(tx).to.be.fulfilled
        })

        it('should PASS if receiver is specified', async () => {
          let tx;
          let encoded_recipient = ethers.utils.defaultAbiCoder.encode(['address'], [randomAddress])
          if (condition == conditions[0]) {
            for (let i = 0; i < ids.length; i++) {
              tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ids[i], amounts[i], encoded_recipient, TX_PARAM)
            }
          } else if (condition == conditions[1]) {
            tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids, amounts, encoded_recipient, TX_PARAM)
          } else if (condition == conditions[2]) {
            tx = userwDaiContract.safeTransferFrom(userAddress, factory, wDaiID, nWDAI, encoded_recipient, TX_PARAM)
          } else if (condition == conditions[3]) {
            tx = userwDaiContract.safeBatchTransferFrom(userAddress, factory, [wDaiID], [nWDAI], encoded_recipient, TX_PARAM)
          }

          await expect(tx).to.be.fulfilled
        })

        it('should REVERT if asset is not silver card or wDAI', async () => {
          let tx;
          await skyweaverAssetsContract.batchMint(userAddress, [silverMaxRange.add(1), silverMaxRange.add(2)], [nTokensPerType, nTokensPerType] , [])
          if (condition == conditions[0]) {
            tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, silverMaxRange.add(1), nTokensPerType, [])
          } else {
            tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [silverMaxRange.add(1), silverMaxRange.add(2)], [nTokensPerType, nTokensPerType], [])
          }
          await expect(tx).to.be.rejectedWith(RevertError("ConquestEntriesFactory#onERC1155BatchReceived: ID_IS_OUT_OF_RANGE"))
        })

        context('When assets were sent to factory', () => {
          recipientConditions.forEach(function(recipient_cond) { 
            context(recipient_cond as string, () => {
              let data;
              let recipient

              let tx;
              beforeEach(async () => {

                if (recipient_cond == recipientConditions[0]) {
                  data = []
                  recipient = userAddress
                } else {
                  data = ethers.utils.defaultAbiCoder.encode(['address'], [randomAddress])
                  recipient = randomAddress
                }
              
                if (condition == conditions[0]) {
                  for (let i = 0; i < ids.length; i++) {
                    tx = await userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ids[i], amounts[i], data, TX_PARAM)
                  }
                } else if (condition == conditions[1]) {
                  tx = await userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, ids, amounts, data, TX_PARAM)
                } else if (condition == conditions[2]) {
                  tx = await userwDaiContract.safeTransferFrom(userAddress, factory, wDaiID, nWDAI, data, TX_PARAM)
                } else if (condition == conditions[3]) {
                  tx = await userwDaiContract.safeBatchTransferFrom(userAddress, factory, [wDaiID], [nWDAI], data, TX_PARAM)
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

                it('should update recipient conquest entries balance', async () => {
                  let userBalance = await userSkyweaverAssetContract.balanceOf(recipient, ticketID)
                  expect(userBalance).to.be.eql(nTokenTypes.mul(nTokensPerType))
                })

              } else {
                it('should update factory wDAI balance', async () => {
                  let factory_balance = await wDaiContract.balanceOf(factory, wDaiID)
                  expect(factory_balance).to.be.eql(nWDAI)
                })

                it('should update user wDAI balance', async () => {
                  let factory_balance = await wDaiContract.balanceOf(userAddress, wDaiID)
                  expect(factory_balance).to.be.eql(baseTokenAmount.sub(nWDAI))
                })

                it('should update recipient conquest entries balance', async () => {
                  let userBalance = await userSkyweaverAssetContract.balanceOf(recipient, ticketID)
                  expect(userBalance).to.be.eql(nWDAI.div(BigNumber.from(10).pow(18)).mul(100))
                })
              }

              it('should not increase entry balance of factory', async () => {
                let factory_balance = await userSkyweaverAssetContract.balanceOf(factory, ticketID)
                expect(factory_balance).to.be.eql(constants.Zero)
              })
            })
          })
        })
      })
    })
    
    describe('withdraw() function', () => {

      let recipient = randomWallet.address
      let data = []

      beforeEach(async () => {
        await userwDaiContract.safeTransferFrom(userAddress, factory, wDaiID, nWDAI, [], TX_PARAM)
      })

      it('should PASS if caller is owner', async () => {
        const tx = factoryContract.withdraw(recipient, data)
        await expect(tx).to.be.fulfilled
      })
  
      it('should REVERT if caller is not owner', async () => {
        const tx = userFactoryContract.withdraw(recipient, data)
        await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
      })
  
      it('should REVERT if recipient is 0x0', async () => {
        const tx = factoryContract.withdraw(ZERO_ADDRESS, data)
        await expect(tx).to.be.rejectedWith(RevertError("ConquestEntriesFactory#withdraw: INVALID_RECIPIENT"))
      })

      context('When ARC is withdrawn', () => {
        beforeEach(async () => {
          await factoryContract.withdraw(recipient, data)
        })

        it('should update factory ARC balance', async () => {
          let factory_balance = await wDaiContract.balanceOf(factory, wDaiID)
          expect(factory_balance).to.be.eql(constants.Zero)
        })
  
        it('should update recipient ARC balance', async () => {
          let recipient_balance = await wDaiContract.balanceOf(recipient, wDaiID)
          expect(recipient_balance).to.be.eql(nWDAI)
        })
      })
    })
  })
})
