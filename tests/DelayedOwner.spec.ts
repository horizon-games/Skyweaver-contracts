import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'

import { 
  OwnableMock,
  DelayedOwner
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
  wallet: randomWallet,
  provider: randomProvider,
  signer: randomSigner
} = utils.createTestWallet(web3, 5)

const getBig = (id: number) => BigNumber.from(id);

describe('TieredOwnable', () => {
  let ownerAddress: string
  let randomAddress: string

  let ownedMockAbstract: AbstractContract
  let delayedOwnerMockAbstract: AbstractContract
  let contract: DelayedOwner
  let randomContract: DelayedOwner
  let targetContract: OwnableMock
  let randomTargetContract: OwnableMock

  // Variables
  const delay = BigNumber.from(60).mul(60).mul(24) // 24h or 86,400 seconds

  let transaction = {
    status: 0,
    triggerTime: BigNumber.from(0),
    target: ZERO_ADDRESS,
    id: 0,
    data: []
  }

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    randomAddress = await randomWallet.getAddress()
    ownedMockAbstract = await AbstractContract.fromArtifactName('OwnableMock')
    delayedOwnerMockAbstract = await AbstractContract.fromArtifactName('DelayedOwner')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {

    // Deploy delayed owner contract
    contract = await delayedOwnerMockAbstract.deploy(ownerWallet, [ownerAddress, delay]) as DelayedOwner
    randomContract = await contract.connect(randomSigner) as DelayedOwner

    // Deploy Ownable contract
    targetContract = await ownedMockAbstract.deploy(ownerWallet, [ownerAddress]) as OwnableMock
    randomTargetContract = await targetContract.connect(randomSigner) as OwnableMock

    transaction.target = targetContract.address;
  })

  describe('Getter functions', () => {
 
  })

  describe('register() function', () => {

    it('should PASS if caller is owner', async () => {
      const tx = contract.register(transaction)
      await expect(tx).to.be.fulfilled
    })

    it('should REVERT if caller is not owner', async () => {
      const tx1 = randomContract.register(transaction)
      await expect(tx1).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
    })

    context('When transaction was registered', () => {
      let tx
      let blockTime;
      beforeEach(async () => {
        tx = await contract.register(transaction)
        let receipt = await ownerWallet.provider.getTransactionReceipt(tx.hash)
        let block = await ownerWallet.provider.getBlock(receipt.blockNumber!)
        blockTime = block.timestamp
        
        transaction.status = 1;
        transaction.triggerTime = delay.add(blockTime)
      })

      it('should not store the original transaction hash', async () => {
        transaction.status = 0
        transaction.triggerTime = BigNumber.from(0)
        let isvalidHash = await contract.isValidWitness(transaction)
        expect(isvalidHash).to.be.equal(false)
      })

      it('should set triggerTime to blocktime + delay', async () => {
        let isvalidHash = await contract.isValidWitness(transaction)
        expect(transaction.status).to.be.equal(1)
        expect(transaction.triggerTime).to.be.eql(delay.add(blockTime))
        expect(isvalidHash).to.be.equal(true)
      })

      it('should prevent registering the same transaction id', async () => {
        let tx2 = contract.register(transaction)
        await expect(tx2).to.be.rejectedWith(RevertError("DelayedOwner#register: TX_ALREADY_REGISTERED"))

        transaction.target = ownerAddress

        let tx3 = contract.register(transaction)
        await expect(tx3).to.be.rejectedWith(RevertError("DelayedOwner#register: TX_ALREADY_REGISTERED"))
      })

      it('should emit TransactionRegistered event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = contract.filters.TransactionRegistered(null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await ownerProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(contract.interface.getEventTopic(contract.interface.events["TransactionRegistered((uint8,uint256,address,uint256,bytes))"]))
      })
      
      describe('TransactionRegistered Event', () => {
        it('should have Pending as `tx.status` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.transaction[0]).to.be.eql(1)
        })
        it('should have correct time value as `tx.triggerTime` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.transaction[1]).to.be.eql(delay.add(blockTime))
        })
        it('should have correct target address as `tx.target` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.transaction[2]).to.be.eql(targetContract.address);
        })
        it('should have correct id as `tx.id` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.transaction[3]).to.be.eql(BigNumber.from(0))
        })
        it('should have correct data as `tx.data` field', async () => {  
          const receipt = await tx.wait(1)
          const ev = receipt.events!.pop()!

          const args = ev.args! as any
          expect(args.transaction[4]).to.be.eql("0x")
        })
      })
    })
  })

  describe('cancel() function', () => {

    it('should REVERT if transaction is not registered', async () => {
      const tx1 = contract.cancel(transaction)
      await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwner#onlyValidWitnesses: INVALID_TX_WITNESS"))
    })

    context('When transaction was registered', () => {
      let tx
      let blockTime;
      beforeEach(async () => {
        tx = await contract.register(transaction)
        let receipt = await ownerWallet.provider.getTransactionReceipt(tx.hash)
        let block = await ownerWallet.provider.getBlock(receipt.blockNumber!)
        blockTime = block.timestamp
        
        transaction.status = 1;
        transaction.triggerTime = delay.add(blockTime)
      })
    
      it('should PASS if caller is owner', async () => {
        const tx = contract.cancel(transaction)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if caller is not owner', async () => {
        const tx1 = randomContract.cancel(transaction)
        await expect(tx1).to.be.rejectedWith(RevertError("Ownable#onlyOwner: SENDER_IS_NOT_OWNER"))
      })

      it('should REVERT if tx is executed already', async () => {
        let snapshot = await ownerProvider.send('evm_snapshot', [])
        await ownerProvider.send("evm_increaseTime", [delay.toNumber()])
        await ownerProvider.send("evm_mine", [])
        await contract.execute(transaction)
        transaction.status = 2
        const tx1 = contract.cancel(transaction)
        await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwner#cancel: TX_NOT_PENDING"))

        await ownerProvider.send("evm_revert", [snapshot])
      })

      context('When transaction was cancelled', () => {
        let tx

        beforeEach(async () => {
          tx = await contract.cancel(transaction)
          transaction.status = 3;
        })

        it('should overwrite original hash', async () => {
          transaction.status = 1;
          let isvalidHash = await contract.isValidWitness(transaction)
          expect(isvalidHash).to.be.equal(false)
        })


        it('should set status to Cancelled', async () => {
          let isvalidHash = await contract.isValidWitness(transaction)
          expect(transaction.status).to.be.equal(3)
          expect(isvalidHash).to.be.equal(true)
        })

        it('should prevent registering the same transaction id', async () => {
          let tx2 = contract.register(transaction)
          await expect(tx2).to.be.rejectedWith(RevertError("DelayedOwner#register: TX_ALREADY_REGISTERED"))

          transaction.target = ownerAddress

          let tx3 = contract.register(transaction)
          await expect(tx3).to.be.rejectedWith(RevertError("DelayedOwner#register: TX_ALREADY_REGISTERED"))
        })

        it('should prevent cancelling the same transaction id', async () => {
          let tx2 = contract.cancel(transaction)
          await expect(tx2).to.be.rejectedWith(RevertError("DelayedOwner#cancel: TX_NOT_PENDING"))
        })

        it('should not be executable', async () => {
          let snapshot = await ownerProvider.send('evm_snapshot', [])
          await ownerProvider.send("evm_increaseTime", [delay.toNumber()])
          await ownerProvider.send("evm_mine", [])
          const tx1 = contract.execute(transaction)
          await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwner#execute: TX_NOT_PENDING"))
          await ownerProvider.send("evm_revert", [snapshot])
        })

        it('should emit TransactionCancelled event', async () => {
          let filterFromOperatorContract: ethers.ethers.EventFilter

          // Get event filter to get internal tx event
          filterFromOperatorContract = contract.filters.TransactionCancelled(null);

          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filterFromOperatorContract.fromBlock = 0;
          let logs = await ownerProvider.getLogs(filterFromOperatorContract);
          expect(logs[0].topics[0]).to.be.eql(contract.interface.getEventTopic(contract.interface.events["TransactionCancelled((uint8,uint256,address,uint256,bytes))"]))
        })
        
        describe('TransactionCancelled Event', () => {
          it('should have Cancelled as `tx.status` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[0]).to.be.eql(3)
          })
          it('should have correct time value as `tx.triggerTime` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[1]).to.be.eql(delay.add(blockTime))
          })
          it('should have correct target address as `tx.target` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[2]).to.be.eql(targetContract.address);
          })
          it('should have correct id as `tx.id` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[3]).to.be.eql(BigNumber.from(0))
          })
          it('should have correct data as `tx.data` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[4]).to.be.eql("0x")
          })
        })
      })
    })
  })

  describe('execute() function', () => {

    it('should REVERT if transaction is not registered', async () => {
      const tx1 = contract.execute(transaction)
      await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwner#onlyValidWitnesses: INVALID_TX_WITNESS"))
    })

    it('should REVERT if delay is not passed', async () => {
      let tx = await contract.register(transaction)
      let receipt = await ownerWallet.provider.getTransactionReceipt(tx.hash!)
      let block = await ownerWallet.provider.getBlock(receipt.blockNumber!)
      let blockTime = block.timestamp
      
      transaction.status = 1;
      transaction.triggerTime = delay.add(blockTime)

      let snapshot = await ownerProvider.send('evm_snapshot', [])
      await ownerProvider.send("evm_increaseTime", [delay.toNumber() - 60])
      await ownerProvider.send("evm_mine", [])

      const tx1 = contract.execute(transaction)
      await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwne#execute: TX_NOT_YET_EXECUTABLE"))
      await ownerProvider.send("evm_revert", [snapshot])
    })

    context('When transaction was registered and delay passed', () => {
      let tx
      let snapshot
      let blockTime

      beforeEach(async () => {
        tx = await contract.register(transaction)
        let receipt = await ownerWallet.provider.getTransactionReceipt(tx.hash)
        let block = await ownerWallet.provider.getBlock(receipt.blockNumber!)
        blockTime = block.timestamp
        
        transaction.status = 1;
        transaction.triggerTime = delay.add(blockTime)
        
        snapshot = await ownerProvider.send('evm_snapshot', []) 
        await ownerProvider.send("evm_increaseTime", [delay.toNumber()])
        await ownerProvider.send("evm_mine", [])
      })

      afterEach(async () => {
        await ownerProvider.send("evm_revert", [snapshot])
      })
    
      it('should PASS if caller is owner', async () => {
        const tx = contract.execute(transaction)
        await expect(tx).to.be.fulfilled
      })

      it('should PASS if inner tx is successful', async () => {
        let transaction2 =  Object.assign({}, transaction)
        let iface = new ethers.utils.Interface(targetContract.interface.fragments); 
        
        //@ts-ignore
        transaction2.data = iface.encodeFunctionData('call_anyone', [])
        transaction2.id = 1
        let tx0 = await contract.register(transaction2)

        let receipt = await ownerWallet.provider.getTransactionReceipt(tx0.hash!)
        let block = await ownerWallet.provider.getBlock(receipt.blockNumber!)
        blockTime = block.timestamp
        
        transaction2.status = 1;
        transaction2.triggerTime = delay.add(blockTime)

        await ownerProvider.send("evm_increaseTime", [delay.toNumber()])
        await ownerProvider.send("evm_mine", [])

        const tx = contract.execute(transaction2)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if inner tx fails', async () => {
        let transaction2 =  Object.assign({}, transaction)
        let iface = new ethers.utils.Interface(targetContract.interface.fragments); 
        
        //@ts-ignore
        transaction2.data = iface.encodeFunctionData('call_throw', [])
        transaction2.id = 1
        let tx0 = await contract.register(transaction2)

        let receipt = await ownerWallet.provider.getTransactionReceipt(tx0.hash!)
        let block = await ownerWallet.provider.getBlock(receipt.blockNumber!)
        blockTime = block.timestamp
        
        transaction2.status = 1;
        transaction2.triggerTime = delay.add(blockTime)

        await ownerProvider.send("evm_increaseTime", [delay.toNumber()])
        await ownerProvider.send("evm_mine", [])

        const tx = contract.execute(transaction2)
        await expect(tx).to.be.rejectedWith(RevertError("DelayedOwner#execute: TX_FAILED"))
      })


      it('should PASS if caller not owner', async () => {
        const tx = randomContract.execute(transaction)
        await expect(tx).to.be.fulfilled
      })

      it('should REVERT if tx was cancelled', async () => {
        await contract.cancel(transaction)
        transaction.status = 3
        const tx1 = contract.execute(transaction)
        await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwner#execute: TX_NOT_PENDING"))

        await ownerProvider.send("evm_revert", [snapshot])
      })

      context('When transaction was executed', () => {
        let tx

        beforeEach(async () => {
          tx = await contract.execute(transaction)
          transaction.status = 2;
        })

        it('should overwrite original hash', async () => {
          transaction.status = 1;
          let isvalidHash = await contract.isValidWitness(transaction)
          expect(isvalidHash).to.be.equal(false)
        })


        it('should set status to Executed', async () => {
          let isvalidHash = await contract.isValidWitness(transaction)
          expect(transaction.status).to.be.equal(2)
          expect(isvalidHash).to.be.equal(true)
        })

        it('should prevent registering the same transaction id', async () => {
          let tx2 = contract.register(transaction)
          await expect(tx2).to.be.rejectedWith(RevertError("DelayedOwner#register: TX_ALREADY_REGISTERED"))

          transaction.target = ownerAddress

          let tx3 = contract.register(transaction)
          await expect(tx3).to.be.rejectedWith(RevertError("DelayedOwner#register: TX_ALREADY_REGISTERED"))
        })

        it('should prevent cancelling the same transaction id', async () => {
          let tx2 = contract.cancel(transaction)
          await expect(tx2).to.be.rejectedWith(RevertError("DelayedOwner#cancel: TX_NOT_PENDING"))
        })

        it('should not be executable again', async () => {
          const tx1 = contract.execute(transaction)
          await expect(tx1).to.be.rejectedWith(RevertError("DelayedOwner#execute: TX_NOT_PENDING"))
        })

        it('should emit TransactionExecuted event', async () => {
          let filterFromOperatorContract: ethers.ethers.EventFilter

          // Get event filter to get internal tx event
          filterFromOperatorContract = contract.filters.TransactionExecuted(null);

          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filterFromOperatorContract.fromBlock = 0;
          let logs = await ownerProvider.getLogs(filterFromOperatorContract);
          expect(logs[0].topics[0]).to.be.eql(contract.interface.getEventTopic(contract.interface.events["TransactionExecuted((uint8,uint256,address,uint256,bytes))"]))
        })
        
        describe('TransactionExecuted Event', () => {
          it('should have Executed as `tx.status` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[0]).to.be.eql(2)
          })
          it('should have correct time value as `tx.triggerTime` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[1]).to.be.eql(delay.add(blockTime))
          })
          it('should have correct target address as `tx.target` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[2]).to.be.eql(targetContract.address);
          })
          it('should have correct id as `tx.id` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[3]).to.be.eql(BigNumber.from(0))
          })
          it('should have correct data as `tx.data` field', async () => {  
            const receipt = await tx.wait(1)
            const ev = receipt.events!.pop()!

            const args = ev.args! as any
            expect(args.transaction[4]).to.be.eql("0x")
          })
        })
      })
    })
  })
})