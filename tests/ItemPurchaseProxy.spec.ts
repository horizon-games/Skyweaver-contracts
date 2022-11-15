import * as ethers from 'ethers'

import { 
  AbstractContract, 
  expect,
  getBurnOrderRequestData,
  RevertError,
  ZERO_ADDRESS
} from './utils'

import * as utils from './utils'

import {
  ERC1155Mock,
  ERC20MintMock,
  ItemPurchaseProxy
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
  wallet: recipientWallet,
  provider: recipientProvider,
  signer: recipientSigner
} = utils.createTestWallet(web3, 4)

const getBig = (id: number) => BigNumber.from(id);

describe.only('ItemPurchaseProxy', () => {
  let ownerAddress: string
  let userAddress: string
  let recipientAddress: string
  let erc20Abstract: AbstractContract
  let paymentAbstract: AbstractContract
  let erc1155Abstract: AbstractContract

  // ERC-20 currency contract
  let erc20Contract: ERC20MintMock
  let userUsdcContract: ERC20MintMock

  // ERC-1155 currency contract
  let erc1155Contract: ERC1155Mock
  let userErc1155Contract: ERC1155Mock
  

  // Skyweaver Assets
  let paymentContract: ItemPurchaseProxy

  // Factory manager
  let userPaymentContract: ItemPurchaseProxy

  // Pass gas since ganache can't figure it out
  let TX_PARAM = {gasLimit: 2000000}

  // ERC-1155 Token Param
  const nTokenTypes    = BigNumber.from(30).add(1) 
  const nTokensPerType = BigNumber.from(100).mul(100)

  const unitPrice = BigNumber.from(15).mul(BigNumber.from(10).pow(5)) //1.5 USDC
  const nUSDC = BigNumber.from(5).mul(unitPrice)

  // erc20 Param, 6 decimals
  const baseTokenAmount = BigNumber.from(10000000).mul(BigNumber.from(10).pow(6))

  // Item ID to purchase
  const purchasedItemID = 999;

  // Arrays for ERC-1155
  const ids = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => getBig(i+1))
  const amounts = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => nTokensPerType)

  // Init
  let proxy;

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    recipientAddress = await recipientWallet.getAddress()
    erc20Abstract = await AbstractContract.fromArtifactName('ERC20MintMock')
    erc1155Abstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    paymentAbstract = await AbstractContract.fromArtifactName('ItemPurchaseProxy')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy ERC20 contract
    erc20Contract = await erc20Abstract.deploy(ownerWallet) as ERC20MintMock
    userUsdcContract = await erc20Contract.connect(userSigner) as ERC20MintMock

    // Deploy ERC-1155 Contract
    erc1155Contract = await erc1155Abstract.deploy(ownerWallet) as ERC1155Mock
    userErc1155Contract = await erc1155Contract.connect(userSigner)

    // Deploy factory
    paymentContract = await paymentAbstract.deploy(ownerWallet, [ownerAddress]) as ItemPurchaseProxy
    userPaymentContract = await paymentContract.connect(userSigner) as ItemPurchaseProxy

    // Assing vars
    proxy = paymentContract.address

    // Mint tokens to user
    await erc20Contract.mockMint(userAddress, baseTokenAmount)
    await erc1155Contract.batchMintMock(userAddress, ids, amounts , [])
  })

  describe('Getter functions', () => {
    describe('supportsInterface()', () => {
      it('should return true for 0x01ffc9a7 (ERC165)', async () => {
        const support = await paymentContract.supportsInterface('0x01ffc9a7')
        expect(support).to.be.eql(true)
      })

      it('should return true for 0x4e2312e0 (ERC1155Receiver)', async () => {
        const support = await paymentContract.supportsInterface('0x4e2312e0')
        expect(support).to.be.eql(true)
      })
    })
  })

  describe.only('ERC-1155 Burn', () => {
    let data

    before(async () => {
     data = getBurnOrderRequestData(userAddress, 0, [purchasedItemID])
    })

    it.only('should PASS if caller sends items', async () => {
      console.log(userErc1155Contract.address)
      console.log(proxy)
      const tx = userErc1155Contract.safeBatchTransferFrom(userAddress, recipientAddress, ids, amounts, data, TX_PARAM)
      await expect(tx).to.be.fulfilled
    })

    it('should PASS if recipient is 0x0', async () => {
      const data2 = getBurnOrderRequestData(ethers.constants.AddressZero, 0, [purchasedItemID])
      const tx = userErc1155Contract.safeBatchTransferFrom(userAddress, proxy, ids, amounts, data2, TX_PARAM)
      await expect(tx).to.be.fulfilled

      // Check event
      let filterFromOperatorContract: ethers.ethers.EventFilter

      // Get event filter to get internal tx event
      filterFromOperatorContract = paymentContract.filters.ItemBurn(null, null, null);

      // Get logs from internal transaction event
      // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
      filterFromOperatorContract.fromBlock = 0;
      const logs = await ownerProvider.getLogs(filterFromOperatorContract);
      let args = paymentContract.interface.decodeEventLog(paymentContract.interface.events["ItemBurn(address,uint32,uint256[])"],logs[0].data, logs[0].topics)
      expect(args.itemRecipient).to.be.eql(userAddress)
    })

    it('should REVERT if nonce is incorrect', async () => {
      const badData = getBurnOrderRequestData(userAddress, 1, [purchasedItemID])
      const tx = userErc1155Contract.safeBatchTransferFrom(userAddress, proxy, ids, amounts, badData, TX_PARAM)
      await expect(tx).to.be.rejectedWith(RevertError("ItemPurchaseProxy#onERC1155BatchReceived: INVALID_NONCE"))

      const badData2 = getBurnOrderRequestData(userAddress, BigNumber.from(2).pow(32).sub(1), [purchasedItemID])
      const tx2 = userErc1155Contract.safeBatchTransferFrom(userAddress, proxy, ids, amounts, badData2, TX_PARAM)
      await expect(tx2).to.be.rejectedWith(RevertError("ItemPurchaseProxy#onERC1155BatchReceived: INVALID_NONCE"))
    })

    context('When assets were sent to proxy', () => {
      let tx;
      
      beforeEach(async () => {
        tx = userErc1155Contract.safeBatchTransferFrom(userAddress, proxy, ids, amounts, data, TX_PARAM)
      })

      it('should update user payment nonce', async () => {
        const nonce = await paymentContract.nonces(userAddress)
        expect(nonce).to.be.eql(BigNumber.from(1))
      })
      
      it('should leave proxy ERC-1155 balance of 0', async () => {
        let proxy_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => proxy)
        let proxy_balances = await userErc1155Contract.balanceOfBatch(proxy_addresses, ids)
        for (let i = 0; i < ids.length; i++) {
          expect(proxy_balances[i]).to.be.eql(constants.Zero)
        }
      })

      it('should update users ERC-1155 balance', async () => {
        let user_addresses = new Array(nTokenTypes.toNumber()).fill('').map((a, i) => userAddress)
        let userBalances = await userErc1155Contract.balanceOfBatch(user_addresses, ids)
        for (let i = 0; i < ids.length; i++) {
          expect(userBalances[i]).to.be.eql(constants.Zero)
        }
      })

      it('should emit ItemBurn event', async () => {
        let filterFromOperatorContract: ethers.ethers.EventFilter

        // Get event filter to get internal tx event
        filterFromOperatorContract = paymentContract.filters.ItemBurn(null, null, null);

        // Get logs from internal transaction event
        // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
        filterFromOperatorContract.fromBlock = 0;
        let logs = await ownerProvider.getLogs(filterFromOperatorContract);
        expect(logs[0].topics[0]).to.be.eql(paymentContract.interface.getEventTopic(paymentContract.interface.events["ItemBurn(address,uint32,uint256[])"]))
      })
      
      describe('ItemBurn Event', () => {
        let args;
        beforeEach(async () => {
          let filterFromOperatorContract: ethers.ethers.EventFilter

          // Get event filter to get internal tx event
          filterFromOperatorContract = paymentContract.filters.ItemBurn(null, null, null);
  
          // Get logs from internal transaction event
          // @ts-ignore (https://github.com/ethers-io/ethers.js/issues/204#issuecomment-427059031)
          filterFromOperatorContract.fromBlock = 0;
          let logs = await ownerProvider.getLogs(filterFromOperatorContract);
          args = paymentContract.interface.decodeEventLog(paymentContract.interface.events["ItemBurn(address,uint32,uint256[])"],logs[0].data, logs[0].topics)
        })

        it('should have recipient as right address as `itemRecipient` field', async () => {  
          expect(args.itemRecipient).to.be.eql(recipientAddress)
        })

        it('should have correct nonce as `nonce` field', async () => {  
          expect(args.nonce).to.be.eql(BigNumber.from(0))
        })

        it('should have correct item purchased as `itemIDsPurchased` field', async () => {  
          expect(args.itemIDsPurchased[0]).to.be.eql(purchasedItemID)
        })

      })
    
    })
    
    describe('withdrawERC20() function', () => {
      let recipient = recipientWallet.address

      beforeEach(async () => {
        await userUsdcContract.transfer(proxy, nUSDC)
      })

      it('should PASS if caller is owner', async () => {
        const tx = paymentContract.withdrawERC20(recipient, erc20Contract.address, TX_PARAM)
        await expect(tx).to.be.fulfilled
      })
  
      it('should REVERT if caller is not owner', async () => {
        const tx = userPaymentContract.withdrawERC20(recipient, erc20Contract.address, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("TieredOwnable#onlyOwnerTier: OWNER_TIER_IS_TOO_LOW"))
      })
  
      it('should REVERT if recipient is 0x0', async () => {
        const tx = paymentContract.withdrawERC20(ZERO_ADDRESS, erc20Contract.address, TX_PARAM)
        await expect(tx).to.be.rejectedWith(RevertError("ItemPurchaseProxy#withdrawERC20: INVALID_RECIPIENT"))
      })

      context('When USDC is withdrawn', () => {
        beforeEach(async () => {
          await paymentContract.withdrawERC20(recipient, erc20Contract.address)
        })

        it('should update proxy usdc balance', async () => {
          let proxy_balance = await erc20Contract.balanceOf(proxy)
          expect(proxy_balance).to.be.eql(constants.Zero)
        })
  
        it('should update recipient usdc balance', async () => {
          let recipient_balance = await erc20Contract.balanceOf(recipient)
          expect(recipient_balance).to.be.eql(nUSDC)
        })
      })
    })
  })
})
