import * as ethers from 'ethers'

import { 
  AbstractContract, 
  delay, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'

import { 
  SkyweaverAssets,
  RewardFactory,
  ERC1155Mock,
  Conquest,
  ConquestV2
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

describe('ConquestV2', () => {
  let ownerAddress: string
  let userAddress: string
  let randomAddress: string
  let skyweaverAssetsAbstract: AbstractContract
  let ticketAbstract: AbstractContract
  let conquestV2Abstract: AbstractContract
  let oldConquestAbstract: AbstractContract
  let rewardFactoryAbstract: AbstractContract

  // Skyweaver Assets
  let skyweaverAssetsContract: SkyweaverAssets
  let userSkyweaverAssetContract: SkyweaverAssets
  let oldConquestContract: Conquest
  let conquestV2Contract: ConquestV2
  let silverFactory: RewardFactory
  let goldFactory: RewardFactory

  // Factory manager
  let userOldConquestContract: Conquest
  let userConquestV2Contract: ConquestV2

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // Gold card id space 
  const GOLD_SPACE = BigNumber.from(2).pow(16)

  // Token Param
  const nTokenTypes    = BigNumber.from(2) 
  const nTokensPerType = BigNumber.from(100)


  // Ticket token Param
  const ticketID = BigNumber.from(555);
  const ticketAmount = BigNumber.from(10).mul(100);

  // Parameters
  const DELAY = BigNumber.from(1) // 1 seconds
  const MAX_REWARDS = BigNumber.from(200)
  const PERIOD_MINT_LIMIT = BigNumber.from(1000).mul(10).pow(2)
  const PERIOD_LENGTH = BigNumber.from(60).mul(60).mul(6) // 6 hours
  
  // Range values 
  const silver_minRange = BigNumber.from(1);
  const silver_maxRange = BigNumber.from(500);

  const gold_minRange = BigNumber.from(1).add(GOLD_SPACE)
  const gold_maxRange = BigNumber.from(500).add(GOLD_SPACE);

  const startTime = BigNumber.from(Math.floor(Date.now() / 1000))
  const endTime = BigNumber.from(startTime.add(60*60)) // 1 hour from now

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
    oldConquestAbstract = await AbstractContract.fromArtifactName('Conquest')
    conquestV2Abstract = await AbstractContract.fromArtifactName('ConquestV2')
    rewardFactoryAbstract = await AbstractContract.fromArtifactName('RewardFactory')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {

    // Deploy Skyweaver Assets Contract
    skyweaverAssetsContract = await skyweaverAssetsAbstract.deploy(ownerWallet, [ownerAddress]) as SkyweaverAssets
    userSkyweaverAssetContract = await skyweaverAssetsContract.connect(userSigner)

    // Deploy Silver and Gold cards factories
    silverFactory = await rewardFactoryAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
      PERIOD_LENGTH,
      PERIOD_MINT_LIMIT, 
      false
    ]) as RewardFactory

    goldFactory = await rewardFactoryAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
      PERIOD_LENGTH,
      PERIOD_MINT_LIMIT.div(5),
      false
    ]) as RewardFactory

    // Deploy conquest V1
    oldConquestContract = await oldConquestAbstract.deploy(ownerWallet, [
      ownerAddress,
      skyweaverAssetsContract.address,
      silverFactory.address,
      goldFactory.address,
      ticketID
    ]) as Conquest
    userOldConquestContract = await oldConquestContract.connect(userSigner) as Conquest

    // Deploy conquest V2
    conquestV2Contract = await conquestV2Abstract.deploy(ownerWallet, [
      ownerAddress,
      oldConquestContract.address,
      skyweaverAssetsContract.address,
      silverFactory.address,
      goldFactory.address,
      ticketID
    ]) as ConquestV2
    userConquestV2Contract = await conquestV2Contract.connect(userSigner) as ConquestV2

    // Allow conquest to print cards in the factories
    await silverFactory.assignOwnership(conquestV2Contract.address, 1)
    await goldFactory.assignOwnership(conquestV2Contract.address, 1)

    // Assing vars
    factory = conquestV2Contract.address

    // Activate gold and silver factories and authorize them
    await skyweaverAssetsContract.activateFactory(silverFactory.address);
    await skyweaverAssetsContract.activateFactory(goldFactory.address);
    await skyweaverAssetsContract.addMintPermission(silverFactory.address, silver_minRange, silver_maxRange, startTime, endTime);
    await skyweaverAssetsContract.addMintPermission(goldFactory.address, gold_minRange, gold_maxRange, startTime, endTime);

    // Let owner be a "factory" to mint silver cards to test conquest
    await skyweaverAssetsContract.activateFactory(ownerAddress);
    await skyweaverAssetsContract.addMintPermission(ownerAddress, ticketID, ticketID, startTime, endTime);

    // Mint Ticket tokens to owner and user
    await skyweaverAssetsContract.batchMint(ownerAddress, [ticketID], [ticketAmount] , [])
    await skyweaverAssetsContract.batchMint(userAddress, [ticketID], [ticketAmount] , [])

    // Remove owner as factory
    await skyweaverAssetsContract.shutdownFactory(ownerAddress);
  })

  let conditions = [
    'user never used old conquest',
    'user has nonce 2 in old conquest',
  ]

  conditions.forEach(function(condition) { 
    context(condition as string, () => {
      let expectedNonce

      beforeEach( async () => {
        if (condition == conditions[0]) {
          expectedNonce = 1
        } else {
          expectedNonce = 3
          await userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, oldConquestContract.address, [ticketID], [100], [], TX_PARAM)
          await oldConquestContract.exitConquest(userAddress, [], [])
          await delay(2000)
          await userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, oldConquestContract.address, [ticketID], [100], [], TX_PARAM)
          await oldConquestContract.exitConquest(userAddress, [], [])
        }
      })


      describe('Getter functions', () => {
        describe('skyweaverAssets() function', () => {
          it('should return Factory manager contract address', async () => {
            const manager = await conquestV2Contract.skyweaverAssets()
            expect(manager).to.be.eql(skyweaverAssetsContract.address)
          })
        })

        describe('supportsInterface()', () => {
          it('should return true for 0x01ffc9a7 (ERC165)', async () => {
            const support = await conquestV2Contract.supportsInterface('0x01ffc9a7')
            expect(support).to.be.eql(true)
          })

          it('should return true for 0x4e2312e0 (ERC1155Receiver)', async () => {
            const support = await conquestV2Contract.supportsInterface('0x4e2312e0')
            expect(support).to.be.eql(true)
          })
        })
      })

      describe('Conquest', () => {
        let amount = BigNumber.from(100)

        context('Using safeBatchTransferFrom', () => {
          it('should PASS if caller sends 100 ticket', async () => {
            const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
            await expect(tx).to.be.fulfilled
          })

          it('should REVERT if token address is not ticket', async () => {
            let fakeTicketContract = await ticketAbstract.deploy(ownerWallet) as ERC1155Mock
            let userFakeTicketContract = fakeTicketContract.connect(userWallet)
            await fakeTicketContract.mintMock(userAddress, ticketID, ticketAmount , [])

            const tx = userFakeTicketContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: INVALID_ENTRY_TOKEN_ADDRESS"))
          })

          it('should REVERT if ids length is more than 1', async () => {
            const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID, ticketID], [amount], [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ERC1155PackedBalance#_safeBatchTransferFrom: INVALID_ARRAYS_LENGTH"))
          })

          it('should REVERT if amounts length is more than 1', async () => {
            const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount, amount], [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ERC1155PackedBalance#_safeBatchTransferFrom: INVALID_ARRAYS_LENGTH"))
          })

          it('should REVERT if ID is not ticket', async () => {
            let invalid_id = ticketID.sub(1)

            await skyweaverAssetsContract.activateFactory(ownerAddress);
            await skyweaverAssetsContract.addMintPermission(ownerAddress, invalid_id, invalid_id, startTime, endTime);
            
            await skyweaverAssetsContract.batchMint(userAddress, [invalid_id], [amount], [])

            const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [invalid_id], [amount], [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: INVALID_ENTRY_TOKEN_ID"))
          })

          it('should REVERT if sent more than 1 ticket', async () => {
            let invalid_amount = 99
            const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [invalid_amount], [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: INVALID_ENTRY_TOKEN_AMOUNT"))
          })

          it('should REVERT if caller is already in a conquest', async () => {
            const tx = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
            await expect(tx).to.be.fulfilled

            const tx2 = userSkyweaverAssetContract.safeBatchTransferFrom(userAddress, factory, [ticketID], [amount], [], TX_PARAM)
            await expect(tx2).to.be.rejectedWith(RevertError("ConquestV2#entry: PLAYER_ALREADY_IN_CONQUEST"))
          })
        })

        context('Using safeTransferFrom', () => {
          it('should PASS if caller sends 100 ticket', async () => {
            const tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
            await expect(tx).to.be.fulfilled
          })

          it('should REVERT if token address is not ticket', async () => {
            let fakeTicketContract = await ticketAbstract.deploy(ownerWallet) as ERC1155Mock
            let userFakeTicketContract = fakeTicketContract.connect(userWallet)
            await fakeTicketContract.mintMock(userAddress, ticketID, ticketAmount , [])

            const tx = userFakeTicketContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: INVALID_ENTRY_TOKEN_ADDRESS"))
          })

          it('should REVERT if ID is not ticket', async () => {
            let invalid_id = ticketID.sub(1)

            await skyweaverAssetsContract.activateFactory(ownerAddress);
            await skyweaverAssetsContract.addMintPermission(ownerAddress, invalid_id, invalid_id, startTime, endTime);

            await skyweaverAssetsContract.batchMint(userAddress, [invalid_id], [amount], [])

            const tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, invalid_id, amount, [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: INVALID_ENTRY_TOKEN_ID"))
          })

          it('should REVERT if sent more than 1 ticket', async () => {
            let invalid_amount = 101
            const tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, invalid_amount, [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: INVALID_ENTRY_TOKEN_AMOUNT"))
          })

          it('should REVERT if caller is already in a conquest', async () => {
            await userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
            const tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
            await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#entry: PLAYER_ALREADY_IN_CONQUEST"))
          })
        })

        context('When ticket was sent to factory', () => {
          let tx;
          beforeEach(async () => {
            tx = await userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
          })

          it('should burn entry sent balance', async () => {
            let factory_balance = await skyweaverAssetsContract.balanceOf(factory, ticketID)
            expect(factory_balance).to.be.eql(constants.Zero)
          })

          it('should update user ticket balance', async () => {
            let user_balance = await skyweaverAssetsContract.balanceOf(userAddress, ticketID)
            expect(user_balance).to.be.eql(ticketAmount.sub(amount.mul(expectedNonce)))
          })

          it('should set user as being in conquest', async () => {
            let value = await conquestV2Contract.isActiveConquest(userAddress)
            expect(value).to.be.eql(true)
          })

          it('should update user conquest count', async () => {
            let value = await conquestV2Contract.conquestsEntered(userAddress)
            expect(value).to.be.eql(BigNumber.from(expectedNonce))
          })

          it('should emit ConquestEntered event', async () => {
            let filterFromOperatorContract: ethers.ethers.EventFilter

            // Get event filter to get internal tx event
            filterFromOperatorContract = conquestV2Contract.filters.ConquestEntered(null, null);

            // Get logs from internal transaction event
            // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
            filterFromOperatorContract.fromBlock = 0;
            let logs = await ownerProvider.getLogs(filterFromOperatorContract);
            expect(logs[0].topics[0]).to.be.eql(conquestV2Contract.interface.getEventTopic(conquestV2Contract.interface.events["ConquestEntered(address,uint256)"]))
          })
          
          describe('ConquestEntered Event', () => {
            let args;
            beforeEach(async () => {
              let filterFromOperatorContract: ethers.ethers.EventFilter

              // Get event filter to get internal tx event
              filterFromOperatorContract = conquestV2Contract.filters.ConquestEntered(null, null);
      
              // Get logs from internal transaction event
              // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
              filterFromOperatorContract.fromBlock = 0;
              let logs = await operatorProvider.getLogs(filterFromOperatorContract);
              args = conquestV2Contract.interface.decodeEventLog(conquestV2Contract.interface.events["ConquestEntered(address,uint256)"],logs[0].data, logs[0].topics)
            })

            it('should have user address as `tx.user` field', async () => {  
              expect(args.user).to.be.eql(userAddress)
            })
            it('should have correct time value as `tx.nConquests` field', async () => {  
              expect(args.nConquests).to.be.eql(BigNumber.from(expectedNonce))
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
          const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, silver_ids, gold_ids)
          await expect(tx).to.be.rejectedWith(RevertError("ConquestV2#exitConquest: USER_IS_NOT_IN_CONQUEST"))
        })

        context("When user is in conquest", () => {
          conditions.forEach(function(condition) {
            context(condition[2] as string, () => {
              beforeEach(async () => {
                await userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
                silverRewardIds = condition[0]
                goldRewardIds = condition[1]
              })

              it('should PASS if caller is owner', async () => {
                const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, silverRewardIds, goldRewardIds)
                await expect(tx).to.be.fulfilled
              })

              it('should PASS if rewards are duplicates', async () => {
                const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, [23, 23], [])
                await expect(tx).to.be.fulfilled
              })

              it('should PASS if rewards are unsorted', async () => {
                const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, [7, 1], [])
                await expect(tx).to.be.fulfilled
              })


              it('should REVERT if silver reward is not silver', async () => {
                const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, [GOLD_SPACE], [])
                await expect(tx).to.be.rejectedWith(RevertError('SkyweaverAssets#_validateMints: ID_OUT_OF_RANGE'))
              })

              it('should REVERT if gold reward is not gold', async () => {
                const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, [1], [GOLD_SPACE.sub(1)])
                await expect(tx).to.be.rejectedWith(RevertError('SkyweaverAssets#_validateMints: ID_OUT_OF_RANGE'))
              })

              it('should PASS if rewards are unsorted', async () => {
                const tx = conquestV2Contract.exitConquest(userAddress, expectedNonce, [7, 1], [])
                await expect(tx).to.be.fulfilled
              })
          
              it('should REVERT if caller is not owner', async () => {
                const tx = userConquestV2Contract.exitConquest(userAddress, expectedNonce, silverRewardIds, goldRewardIds)
                await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
              })
          
              it('should REVERT if trying to mint more than possible amount', async () => {
                const tx4 = conquestV2Contract.exitConquest(userAddress, expectedNonce, [1, 2, 3], [])
                await expect(tx4).to.be.rejectedWith(RevertError("ConquestV2#exitConquest: INVALID_REWARDS"))

                const tx1 = conquestV2Contract.exitConquest(userAddress, expectedNonce, [1], [GOLD_SPACE.add(1), GOLD_SPACE.add(2)])
                await expect(tx1).to.be.rejectedWith(RevertError("ConquestV2#exitConquest: INVALID_REWARDS"))

                const tx2 = conquestV2Contract.exitConquest(userAddress, expectedNonce, [1, 2], [GOLD_SPACE.add(1)])
                await expect(tx2).to.be.rejectedWith(RevertError("ConquestV2#exitConquest: INVALID_REWARDS"))

                const tx3 = conquestV2Contract.exitConquest(userAddress, expectedNonce, [], [GOLD_SPACE.add(1)])
                await expect(tx3).to.be.rejectedWith(RevertError("ConquestV2#exitConquest: INVALID_REWARDS"))

                const tx5 = conquestV2Contract.exitConquest(userAddress, expectedNonce, [1], [GOLD_SPACE.add(1)])
                await expect(tx5).to.be.fulfilled
              })
          
              context('When exitConquest was called', () => {
                beforeEach(async () => {
                  await conquestV2Contract.exitConquest(userAddress, expectedNonce, silverRewardIds, goldRewardIds)
                })
          
                it('should update user conquest status', async () => {
                  let value = await conquestV2Contract.isActiveConquest(userAddress)
                  expect(value).to.be.eql(false)
                })
          
                it('should update user silver cards balance', async () => {
                  let n_ids = silver_ids.length
                  let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
                  let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, silver_ids)
                  for (let i = 0; i < n_ids; i++) {
                    if (silverRewardIds.length == 0) {
                      expect(userBalances[i]).to.be.eql(BigNumber.from(0))
                    } else {
                      expect(userBalances[i]).to.be.eql(BigNumber.from(100))
                    }
                  }
                })

                it('should update user gold cards balance', async () => {
                  let n_ids = gold_ids.length
                  let user_addresses = new Array(n_ids).fill('').map((a, i) => userAddress)
                  let userBalances = await userSkyweaverAssetContract.balanceOfBatch(user_addresses, gold_ids)
                  for (let i = 0; i < n_ids; i++) {
                    if (goldRewardIds.length == 0) {
                      expect(userBalances[i]).to.be.eql(BigNumber.from(0))
                    } else {
                      expect(userBalances[i]).to.be.eql(BigNumber.from(100))
                    }
                  }
                })
              })
            })
          })
        })
      })
    })
  })

  describe('when old conquest has a state', () => {
    let amount = 100; // ticket amount

    // enterConquest

    it('enter should PASS if old conquest is not in conquest and conquest is not synced', async () => {
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      await oldConquestContract.exitConquest(userAddress, [], [])

      const tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
      await expect(tx).to.be.fulfilled
    })

    it('enter should REVERT on enter if old conquest is in conquest and conquest is not synced', async () => {
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
     
      const tx = userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError('ConquestV2#entry: PLAYER_ALREADY_IN_CONQUEST'));
    })

    // exitConquest

    it('exit should PASS if old conquest is in conquest and conquest is not synced', async () => {
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      
      const tx = conquestV2Contract.exitConquest(userAddress, 1, [], [])
      await expect(tx).to.be.fulfilled
    })

    it('exit should REVERT on enter if old conquest is NOT in conquest and conquest is not synced', async () => {
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      await oldConquestContract.exitConquest(userAddress, [], [])
      
      const tx = conquestV2Contract.exitConquest(userAddress, 1, [], [])
      await expect(tx).to.be.rejectedWith(RevertError('ConquestV2#exitConquest: USER_IS_NOT_IN_CONQUEST'));
    })

    // isActiveConquest()

    it('isActiveConquest() should return old status if conquest is not synced', async () => {
      const status0 = await conquestV2Contract.isActiveConquest(userAddress)
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      const status1 = await conquestV2Contract.isActiveConquest(userAddress)
      await expect(status0).to.be.eql(false)
      await expect(status1).to.be.eql(true)
    })

    it('isActiveConquest() should return new status if conquest is synced', async () => {
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      const oldStatus0 = await oldConquestContract.isActiveConquest(userAddress)
      const newStatus0 = await conquestV2Contract.isActiveConquest(userAddress)

      await conquestV2Contract.exitConquest(userAddress, 1, [], [])
      const oldStatus1 = await oldConquestContract.isActiveConquest(userAddress)
      const newStatus1 = await conquestV2Contract.isActiveConquest(userAddress)

      await expect(oldStatus0).to.be.eql(true)
      await expect(newStatus0).to.be.eql(true)
      await expect(oldStatus1).to.be.eql(true)
      await expect(newStatus1).to.be.eql(false)
    })

    // conquestsEntered()

    it('conquestsEntered() should return old status if conquest is not synced', async () => {
      const status0 = await conquestV2Contract.conquestsEntered(userAddress)
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      const status1 = await conquestV2Contract.conquestsEntered(userAddress)
      await expect(status0).to.be.eql(BigNumber.from(0))
      await expect(status1).to.be.eql(BigNumber.from(1))
    })

    it('conquestsEntered() should return new status if conquest is synced', async () => {
      await userSkyweaverAssetContract.safeTransferFrom(userAddress, oldConquestContract.address, ticketID, amount, [], TX_PARAM)
      await conquestV2Contract.exitConquest(userAddress, 1, [], [])
      const oldStatus0 = await oldConquestContract.conquestsEntered(userAddress)
      const newStatus0 = await conquestV2Contract.conquestsEntered(userAddress)

      await userSkyweaverAssetContract.safeTransferFrom(userAddress, factory, ticketID, amount, [], TX_PARAM)
      const oldStatus1 = await oldConquestContract.conquestsEntered(userAddress)
      const newStatus1 = await conquestV2Contract.conquestsEntered(userAddress)

      await expect(oldStatus0).to.be.eql(BigNumber.from(1))
      await expect(newStatus0).to.be.eql(BigNumber.from(1))
      await expect(oldStatus1).to.be.eql(BigNumber.from(1))
      await expect(newStatus1).to.be.eql(BigNumber.from(2))
    })

  })
})