# Instructions

## For testing
1. `yarn install`
2. `yarn build`
4. `yarn ganache`
5. (Different terminal) `yarn migrate:ganache`

## For deployment to dev/stg/prod
1. `yarn install`
2. `yarn build`
3. update deployer mnemonics/infura keys in `config/(dev|stg|prod).env`
5. (Different terminal) `yarn migrate:rinkeby-(deg|stg|prod)`

ps: if migration fails due to gas, try tweaking values in truffle.js network settings

`make clean` can be used to clear builds and modules.

# SkyWeaver's Smart Contracts Environment
This is a overview of all the smart contracts involved with SkyWeaver. 

## 1. Game
Currently no contracts are necessary for the game logic as the game is 100% off-chain and the assets are 100% non-custodial. A contract could be used to store a compressed, auditable history of all games that have been played offchain. This would enable easy to reach consensus on the current ranking of each player and allow anyone to audit the rewards issued.


### 2 Asset Contracts
Implementation of [ERC-1155](https://github.com/ethereum/eips/issues/1155) that keeps track of all the users' cards balance and contains all the token functions. 

### 2.1 Card Master Contract (SkyWeaverAssets.sol)
This contract is the only address that is able to mint card and should contain all the minting restriction logics (max total supply or maximum mint per day). This contract contains two main functionalities, which are delegated to two respective contracts :

### 2.2 Arcadeum Token Contract (ArcadeumToken.sol)
This contract extends `ERC1155MetaMintBurnMock` and uses token id `9999` to represent the in game currency (ARCs), tokens have 18 decimal places

## 3. Shop
The shop is built on top of [NiftySwap](https://github.com/arcadeum/niftyswap). 

details for adding liquidity can be found in `migrations/2_deploy_contracts.js`
references: [NiftySwap Unit Tests](https://github.com/arcadeum/niftyswap/blob/master/src/tests/NiftswapExchange.spec.ts)

### TODO:

## 4. Wallet contract 
A wallet contract (i.e. Smart account) could significantly improve user experience and user security. It would enable to use the same accounts with various private keys (e.g. mobile, desktop, etc.), where each key could have different permission levels (e.g. `Key A` can play, but can't trade, while `key B` can do both). It could also enable account recovery via methods like a dead man switch, third party recovery with delay. It could enable 2FA security for various actions like trading, such that a 2FA code (e.g. via Google authenticator) need to be provided before a trade can be completed. These features (and more) would greatly facilitate a seemless experience that gamers are currently used to. Importantly, using a smart account would be optional, but the features provided could help the less tech-savy to enjoy a smooth experience.

## 5. Multi-Signature Contract 

HorizonGames master key, who will ultimately have control on the cards issuance and contracts migrations, will be a multi-signature smart contract. This multi-signature smart contract will give temporary permissions to sub-keys that can be used on the daily basis without exposing the master key. 