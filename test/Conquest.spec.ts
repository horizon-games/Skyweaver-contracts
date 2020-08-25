import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'
import { SkyweaverAssets } from '../typings/contracts/SkyweaverAssets'
import { RewardFactory } from '../typings/contracts/RewardFactory'
import { ERC1155Mock } from '../typings/contracts/ERC1155Mock'
import { Conquest } from '../typings/contracts/Conquest'
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

describe('Conquest', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let ticketAbstract: AbstractContract
  let factoryAbstract: AbstractContract
  let rewardFactoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let factoryContract: Conquest
  let silverFactory: RewardFactory
  let goldFactory: RewardFactory

  // Factory manager
  let userFactoryContract: Conquest

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Gold card id space 
  const GOLD_SPACE = new BigNumber(2).pow(16)

  // Token Param
  const nTokenTypes    = new BigNumber(2) 
  const nTokensPerType = new BigNumber(100)

  // Ticket token Param
  const ticketID = new BigNumber(555);
  const ticketAmount = new BigNumber(10).mul(100);

  // Parameters
  const DELAY = new BigNumber(2).mul(60) // 2 minutes
  const MAX_REWARDS = new BigNumber(200)
  const PERIOD_MINT_LIMIT = new BigNumber(1000).mul(10).pow(2)
  
  // Range values 
  const silver_minRange = new BigNumber(1);
  const silver_maxRange = new BigNumber(500);

  const gold_minRange = new BigNumber(1).add(GOLD_SPACE)
  const gold_maxRange = new BigNumber(500).add(GOLD_SPACE);

  // Arrays
  const silver_ids = [77]
  const gold_ids = [GOLD_SPACE.add(123)]

  let factory;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    skyweaverAssetsAbstract = await AbstractContract.fromArtifactName('SkyweaverAssets')
    ticketAbstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    factoryAbstract = await AbstractContract.fromArtifactName('Conquest')
    rewardFactoryAbstract = await AbstractContract.fromArtifactName('RewardFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy Silver and Gold cards factories
    silverFactory = await rewardFactoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      PERIOD_MINT_LIMIT
    ]) as RewardFactory

    goldFactory = await rewardFactoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      PERIOD_MINT_LIMIT.div(5)
    ]) as RewardFactory

    // Deploy silver card factory
    factoryContract = await factoryAbstract.deploy(ownerWallet, [
      skyweaverAssetsContract.address,
      silverFactory.address,
      goldFactory.address,
      ticketID
    ]) as Conquest
    userFactoryContract = await factoryContract.connect(userSigner) as Conquest

    // Allow conquest to print cards in the factories
    await silverFactory.functions.assignOwnership(factoryContract.address, 1)
    await goldFactory.functions.assignOwnership(factoryContract.address, 1)

    // Assing vars
    factory = factoryContract.address

    // Activate gold and silver factories and authorize them
    await skyweaverAssetsContract.functions.activateFactory(silverFactory.address);
    await skyweaverAssetsContract.functions.activateFactory(goldFactory.address);
    await skyweaverAssetsContract.functions.addMintPermission(silverFactory.address, silver_minRange, silver_maxRange);
    await skyweaverAssetsContract.functions.addMintPermission(goldFactory.address, gold_minRange, gold_maxRange);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
    await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, ticketID, ticketID);

    // Mint Ticket tokens to owner and user
    await skyweaverAssetsContract.functions.batchMint(ownerAddress, [ticketID], [ticketAmount] , [])
    await skyweaverAssetsContract.functions.batchMint(userAddress, [ticketID], [ticketAmount] , [])

    // Remove owner as factory
    await skyweaverAssetsContract.functions.shutdownFactory(ownerAddress);
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
    let amount = new BigNumber(100)

    context('Using safeBatchTransferFrom', () => {
      it('should PASS if caller sends 100 ticket', async () => {
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

        await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
        await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, invalid_id, invalid_id);
        
        await skyweaverAssetsContract.functions.batchMint(userAddress, [invalid_id], [amount], [])

        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [invalid_id], [amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_ID"))
      })

      it('should REVERT if sent more than 1 ticket', async () => {
        let invalid_amount = 99
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
        await factoryContract.functions.exitConquest(userAddress, silver_ids, gold_ids);
        const tx = userSkyweaverAssetContract.functions.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: NEW_CONQUEST_TOO_EARLY"))
      })
    })

    context('Using safeTransferFrom', () => {
      it('should PASS if caller sends 100 ticket', async () => {
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

        await skyweaverAssetsContract.functions.activateFactory(ownerAddress);
        await skyweaverAssetsContract.functions.addMintPermission(ownerAddress, invalid_id, invalid_id);

        await skyweaverAssetsContract.functions.batchMint(userAddress, [invalid_id], [amount], [])

        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, invalid_id, amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: INVALID_ENTRY_TOKEN_ID"))
      })

      it('should REVERT if sent more than 1 ticket', async () => {
        let invalid_amount = 101
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
        await factoryContract.functions.exitConquest(userAddress, silver_ids, gold_ids)
        const tx = userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("Conquest#entry: NEW_CONQUEST_TOO_EARLY"))
      })
    })

    context('When ticket was sent to factory', () => {
      let tx;
      beforeEach(async () => {
        tx = await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
      })

      it('should burn entry sent balance', async () => {
        let factory_balance = await skyweaverAssetsContract.functions.balanceOf(factory, ticketID)
        expect(factory_balance).to.be.eql(Zero)
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
        let value = await factoryContract.functions.conquestsEntered(userAddress)
        expect(value).to.be.eql(new BigNumber(1))
      })

      it('should update next conquest time for user', async () => {
        let timeStamp = (await ownerProvider.getBlock(tx.blockHash)).timestamp
        let value = await factoryContract.functions.nextConquestTime(userAddress)
        expect(value).to.be.eql(new BigNumber(timeStamp).add(DELAY))
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
    let amount = 100; // ticket amount
    let silverRewardIds;
    let goldRewardIds;

    let conditions = [
      [ [...silver_ids], [...gold_ids], 'With rewards'],
      [ [], [], 'No rewards']
    ]

    it('should REVERT if caller is not in conquest', async () => {
      const tx = factoryContract.functions.exitConquest(userAddress, silver_ids, gold_ids)
      await expect(tx).to.be.rejectedWith(RevertError("Conquest#exitConquest: USER_IS_NOT_IN_CONQUEST"))
    })
    context("When user is in conquest", () => {
      conditions.forEach(function(condition) {
        context(condition[2] as string, () => {
          beforeEach(async () => {
            await userSkyweaverAssetContract.functions.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
            silverRewardIds = condition[0]
            goldRewardIds = condition[1]
          })

          it('should PASS if caller is owner', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, silverRewardIds, goldRewardIds)
            await expect(tx).to.be.fulfilled
          })

          it('should PASS if rewards are duplicates', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, [23, 23], [])
            await expect(tx).to.be.fulfilled
          })

          it('should PASS if rewards are unsorted', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, [7, 1], [])
            await expect(tx).to.be.fulfilled
          })


          it('should REVERT if silver reward is not silver', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, [GOLD_SPACE], [])
            await expect(tx).to.be.rejectedWith(RevertError('SkyweaverAssets#_validateMints: ID_OUT_OF_RANGE'))
          })

          it('should REVERT if gold reward is not gold', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, [1], [GOLD_SPACE.sub(1)])
            await expect(tx).to.be.rejectedWith(RevertError('SkyweaverAssets#_validateMints: ID_OUT_OF_RANGE'))
          })

          it('should PASS if rewards are unsorted', async () => {
            const tx = factoryContract.functions.exitConquest(userAddress, [7, 1], [])
            await expect(tx).to.be.fulfilled
          })
      
          it('should REVERT if caller is not owner', async () => {
            const tx = userFactoryContract.functions.exitConquest(userAddress, silverRewardIds, goldRewardIds)
            await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
          })
      
          it('should REVERT if trying to mint more than possible amount', async () => {
            const tx4 = factoryContract.functions.exitConquest(userAddress, [1, 2, 3], [])
            await expect(tx4).to.be.rejectedWith(RevertError("Conquest#exitConquest: INVALID_REWARDS"))

            const tx1 = factoryContract.functions.exitConquest(userAddress, [1], [GOLD_SPACE.add(1), GOLD_SPACE.add(2)])
            await expect(tx1).to.be.rejectedWith(RevertError("Conquest#exitConquest: INVALID_REWARDS"))

            const tx2 = factoryContract.functions.exitConquest(userAddress, [1, 2], [GOLD_SPACE.add(1)])
            await expect(tx2).to.be.rejectedWith(RevertError("Conquest#exitConquest: INVALID_REWARDS"))

            const tx3 = factoryContract.functions.exitConquest(userAddress, [], [GOLD_SPACE.add(1)])
            await expect(tx3).to.be.rejectedWith(RevertError("Conquest#exitConquest: INVALID_REWARDS"))

            const tx5 = factoryContract.functions.exitConquest(userAddress, [1], [GOLD_SPACE.add(1)])
            await expect(tx5).to.be.fulfilled
          })
      
          context('When exitConquest was called', () => {
            beforeEach(async () => {
              await factoryContract.functions.exitConquest(userAddress, silverRewardIds, goldRewardIds)
            })
      
            it('should update user conquest status', async () => {
              let value = await factoryContract.functions.isActiveConquest(userAddress)
              expect(value).to.be.eql(false)
            })
      
            it('should update user silver cards balance', async () => {
              let n_ids = silver_ids.length
              let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
              let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, silver_ids)
              for (let i = 0; i < n_ids; i++) {
                if (silverRewardIds.length == 0) {
                  expect(userBalances[i]).to.be.eql(new BigNumber(0))
                } else {
                  expect(userBalances[i]).to.be.eql(new BigNumber(100))
                }
              }
            })

            it('should update user gold cards balance', async () => {
              let n_ids = gold_ids.length
              let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
              let userBalances = await userSkyweaverAssetContract.functions.balanceOfBatch(user_addresses, gold_ids)
              for (let i = 0; i < n_ids; i++) {
                if (goldRewardIds.length == 0) {
                  expect(userBalances[i]).to.be.eql(new BigNumber(0))
                } else {
                  expect(userBalances[i]).to.be.eql(new BigNumber(100))
                }
              }
            })
          })
        })
      })
    })
  })
})