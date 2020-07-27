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
import { Conquest } from '../typings/contracts/Conquest'
import { BigNumber } from 'ethers/utils';
import { web3 } from '@nomiclabs/buidler'

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

describe('Conquest', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let ticketAbstract: AbstractContract
  let factoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: Conquest

  // Factory manager
  let userFactoryContract: Conquest

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Token Param
  const nTokenTypes    = new BigNumber(2) 
  const nTokensPerType = new BigNumber(100)

  // Ticket token Param
  const ticketID = new BigNumber(555);
  const ticketAmount = new BigNumber(10);

  // Parameters
  const DELAY = new BigNumber(5).mul(60) // 5 minutes
  const MAX_REWARDS = new BigNumber(200)

  // Range values 
  const minRange = new BigNumber(1);
  const maxRange = new BigNumber(500);

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
    factoryAbstract = await AbstractContract.fromArtifactName('Conquest')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      ticketID
    ]) as Conquest
    userFactoryContract = await factoryContract.connect(userSigner) as Conquest

    // Assing vars
    factory = factoryContract.address

    // Activate factory and authorize it
    await skyweaverAssetsContract.functions.activateFactory(factory);
    await skyweaverAssetsContract.functions.addMintPermission(factory, minRange, maxRange);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
    await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, 0, 666);

    // Mint Ticket tokens to owner and user
    await skyweaverAssetsContract.functions.batchMint(ownerAddress, [ticketID], [ticketAmount] , [])
    await skyweaverAssetsContract.functions.batchMint(userAddress, [ticketID], [ticketAmount] , [])
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

  describe('Conquest', () => {
    let amount = new BigNumber(1)

    context('Using safeBatchTransferFrom', () => {
      it('should PASS if caller sends 1 ticket', async () => {
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if token address is not ticket', async () => {
        let fakeTicketContract = await ticketAbstract.deploy(ownerWallet) as ERC1155Mock
        let userFakeTicketContract = fakeTicketContract.connect(userWallet)
        await fakeTicketContract.functions.mintMock(userAddress, ticketID, ticketAmount , [])

        const tx = userFakeTicketContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_ADDRESS"))
      })

      it('should REVERT if ids length is more than 1', async () => {
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID, ticketID], [amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("ERC1155PackedBalance#_safeBatchTransferFrom: INVALID_ARRAYS_LENGTH"))
      })

      it('should REVERT if amounts length is more than 1', async () => {
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount, amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("ERC1155PackedBalance#_safeBatchTransferFrom: INVALID_ARRAYS_LENGTH"))
      })

      it('should REVERT if ID is not ticket', async () => {
        let invalid_id = ticketID.sub(1)
        await skyweaverAssetsContract.functions.batchMint(userAddress, [invalid_id], [amount], [])

        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [invalid_id], [amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_ID"))
      })

      it('should REVERT if sent more than 1 ticket', async () => {
        let invalid_amount = 2
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [invalid_amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_AMOUNT"))
      })

      it('should REVERT if caller is already in a conquest', async () => {
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await expect(tx).to.be.fulfilled

        const tx2 = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await expect(tx2).to.be.rejectedWith(RevertError("Conquest#entry: PLAYER_ALREADY_IN_CONQUEST"))
      })

      it('should REVERT if caller tries to do conquest faster than limit', async () => {
        await userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await factoryContract.functions.exitConquest(userAddress, ids, amounts);
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: NEW_CONQUEST_TOO_EARLY"))
      })
    })

    context('Using safeTransferFrom', () => {
      it('should PASS if caller sends 1 ticket', async () => {
        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if token address is not ticket', async () => {
        let fakeTicketContract = await ticketAbstract.deploy(ownerWallet) as ERC1155Mock
        let userFakeTicketContract = fakeTicketContract.connect(userWallet)
        await fakeTicketContract.functions.mintMock(userAddress, ticketID, ticketAmount , [])

        const tx = userFakeTicketContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_ADDRESS"))
      })

      it('should REVERT if ID is not ticket', async () => {
        let invalid_id = ticketID.sub(1)
        await skyweaverAssetsContract.functions.batchMint(userAddress, [invalid_id], [amount], [])

        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, invalid_id, amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_ID"))
      })

      it('should REVERT if sent more than 1 ticket', async () => {
        let invalid_amount = 2
        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, invalid_amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_AMOUNT"))
      })

      it('should REVERT if caller is already in a conquest', async () => {
        await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: PLAYER_ALREADY_IN_CONQUEST"))
      })

      it('should REVERT if caller tries to do conquest faster than limit', async () => {
        await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        await factoryContract.functions.exitConquest(userAddress, ids, amounts)
        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: NEW_CONQUEST_TOO_EARLY"))
      })
    })

    context('When ticket was sent to factory', () => {
      let tx;
      beforeEach(async () => {
        tx = await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
      })

      it('should update factory ticket balance', async () => {
        let factory_balance = await skyweaverAssetsContract.functions.balanceOf(factory, ticketID)
        expect(factory_balance).to.be.eql(amount)
      })

      it('should update user ticket balance', async () => {
        let user_balance = await skyweaverAssetsContract.functions.balanceOf(userAddress, ticketID)
        expect(user_balance).to.be.eql(ticketAmount.sub(amount))
      })

      it('should set user as being in conquest', async () => {
        let value = await factoryContract.functions.isActiveConquest(userAddress)
        expect(value).to.be.eql(true)
      })

      it('should update user conquest count', async () => {
        let value = await factoryContract.functions.isActiveConquest(userAddress)
        expect(value).to.be.eql(true)
      })

      it('should update next conquest time for user', async () => {
        let value = await factoryContract.functions.conquestsEntered(userAddress)
        expect(value).to.be.eql(new BigNumber(1))
      })

      it('should emit ConquestEntered event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = factoryContract.filters.ConquestEntered(null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await ownerProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(factoryContract.interface.events.ConquestEntered.topic)
      })
      
      describe('ConquestEntered Event', () => {
        let args;
        beforeEach(async () => {
          let filterFromOperatorContract: ethers.ethers.EventFilter

          // Get event filter to get internal tx event
          filterFromOperatorContract = factoryContract.filters.ConquestEntered(null, null);
  
          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filterFromOperatorContract.fromBlock = 0;
          let logs = await operatorProvider.getLogs(filterFromOperatorContract);
          args = factoryContract.interface.events.ConquestEntered.decode(logs[0].data, logs[0].topics)
        })

        it('should have user address as `tx.user` field', async () => {  
          expect(args.user).to.be.eql(userAddress)
        })
        it('should have correct time value as `tx.nConquests` field', async () => {  
          expect(args.nConquests).to.be.eql(new BigNumber(1))
        })
      })
    })
  })

  describe('exitConquest()', () => {
    let amount = 1; // ticket amount
    let rewardIds;
    let rewardAmounts;

    let conditions = [
      [ [...ids], [...amounts], 'With rewards'],
      [ [], [], 'No rewards']
    ]

    it('should REVERT if caller is not in conquest', async () => {
      const tx = factoryContract.functions.exitConquest(userAddress, ids, amounts)
      await expect(tx).to.be.rejectedWith(RevertError("Conquest#exitConquest: USER_IS_NOT_IN_CONQUEST"))
    })
    context("When user is in conquest", () => {
      conditions.forEach(function(condition) {
        context(condition[2] as string, () => {
          beforeEach(async () => {
            await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
            rewardIds = condition[0]
            rewardAmounts = condition[1]
          })

          it('should PASS if caller is owner', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, rewardIds, rewardAmounts)
            await expect(tx).to.be.fulfilled
          })
      
          it('should REVERT if caller is not owner', async () => {
            const tx = userFactoryContract.functions.exitConquest(userAddress, rewardIds, rewardAmounts)
            await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
          })
      
          it('should REVERT if trying to mint more than max amount', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, [1], [MAX_REWARDS.add(1)])
            await expect(tx).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      
            const tx2 = factoryContract.functions.exitConquest(userAddress, [1, 2], [1, MAX_REWARDS])
            await expect(tx2).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
      
            const tx3 = factoryContract.functions.exitConquest(userAddress, [1, 2, 66], [1, MAX_REWARDS.sub(1), 1])
            await expect(tx3).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))

            const tx4 = factoryContract.functions.exitConquest(userAddress, [1, 2, 66], [1, 0, MAX_REWARDS])
            await expect(tx4).to.be.rejectedWith(RevertError("SafeMath#sub: UNDERFLOW"))
          })
      
          context('When exitConquest was called', () => {
            beforeEach(async () => {
              await factoryContract.functions.exitConquest(userAddress, rewardIds, rewardAmounts)
            })
      
            it('should update user conquest status', async () => {
              let value = await factoryContract.functions.isActiveConquest(userAddress)
              expect(value).to.be.eql(false)
            })
      
            it('should update user cards balance', async () => {
              let n_ids = ids.length
              let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
              let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, ids)
              for (let i = 0; i < n_ids; i++) {
                if (rewardIds.length == 0) {
                  expect(userBalances[i]).to.be.eql(new BigNumber(0))
                } else {
                  expect(userBalances[i]).to.be.eql(new BigNumber(rewardAmounts[i]))
                }
              }
            })
          })
        })
      })
    })
  })
})