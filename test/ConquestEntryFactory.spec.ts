import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from '../typings/contracts/SkyweaverAssets'
import { ConquestEntryFactory } from '../typings/contracts/ConquestEntryFactory'
import { BigNumber } from 'ethers/utils';
import { web3 } from '@nomiclabs/buidler'
import { Zero } from 'ethers/constants'

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

const getBig = (id: number) => new BigNumber(id);

describe('ConquestEntryFactory', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let ticketAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: ConquestEntryFactory

  // Factory manager
  let userFactoryContract: ConquestEntryFactory

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = new BigNumber(30) 
  const nTokensPerType = new BigNumber(100).mul(100)

  // Ticket token Param
  const ticketID = new BigNumber(555);
  const ticketAmount = new BigNumber(10).mul(100);

  // Range values 
  const silverMinRange = new BigNumber(1);
  const silverMaxRange = new BigNumber(500);

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
    factoryAbstract = await AbstractContract.fromArtifactName('ConquestEntryFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      ticketID, 
      [silverMinRange, silverMaxRange]
    ]) as ConquestEntryFactory
    userFactoryContract = await factoryContract.connect(userSigner) as ConquestEntryFactory

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, ticketID, ticketID);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
    await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, silverMinRange, silverMaxRange.add(100));

    // Mint cards tokens to user
    await skyweaverAssetsContract.functions.batchMint(userAddress, ids, amounts , [])
  })

  describe('Getter functions', () => {
    describe('skyweaverAssets() function', () => {
      it('should return Factory manager contract address', async () => {
        const manager = await factoryContract.functions.skyweaverAssets()
        expect(manager).to.be.eql(skyweaverAssetsContract.address)
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

  describe('ConquestEntryFactory', () => {

    let conditions = [
      'safeTransferFrom()',
      'safeBatchTransferFrom()'  
    ]

    conditions.forEach(function(condition) { 
      context(condition as string, () => {

        it('should PASS if caller sends silver cards', async () => {
          let tx;
          if (condition == conditions[0]) {
            for (let i = 0; i < ids.length; i++) {
              tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ids[i], amounts[i], [], TX_PARAM)
            }
          } else {
            tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
          }
          await expect(tx).to.be.fulfilled
        })

        it('should PASS if caller sends silver cards', async () => {
          let tx;
          if (condition == conditions[0]) {
            tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ids[0], amounts[0], [], TX_PARAM)
          } else {
            tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
          }
          await expect(tx).to.be.fulfilled
        })

        it('should REVERT if asset is not silver card', async () => {
          let tx;
          await skyweaverAssetsContract.functions.batchMint(userAddress, [silverMaxRange.add(1), silverMaxRange.add(2)], [nTokensPerType, nTokensPerType] , [])
          if (condition == conditions[0]) {
            tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, silverMaxRange.add(1), nTokensPerType, [])
          } else {
            tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [silverMaxRange.add(1), silverMaxRange.add(2)], [nTokensPerType, nTokensPerType], [])
          }
          await expect(tx).to.be.rejectedWith(RevertError("ConquestEntryFactory#onERC1155BatchReceived: ID_IS_OUT_OF_RANGE"))
        })

        context('When cards were sent to factory', () => {
          let tx;
          beforeEach(async () => {
            if (condition == conditions[0]) {
              for (let i = 0; i < ids.length; i++) {
                tx = await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ids[i], amounts[i], [], TX_PARAM)
              }
            } else {
              tx = await userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, ids, amounts, [], TX_PARAM)
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

          it('should update user conquest entries balance', async () => {
            let userBalance = await userSkyweaverAssetContract.functions.balanceOf(userAddress, ticketID)
            expect(userBalance).to.be.eql(nTokenTypes.mul(nTokensPerType))
          })
        })
      })
    })
  })
})
