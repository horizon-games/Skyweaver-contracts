This repository includes smart contracts that are specific to Skyweaver. These contracts depend on the ERC-1155 token implementation that can be found [here](https://github.com/arcadeum/multi-token-standard).

# Instructions

## For testing
1. `yarn install`
2. `yarn build`
4. `yarn ganache`
5. (Different terminal) `yarn test`

# SkyWeaver's Smart Contracts Environment
This is a overview of all the smart contracts in this repository. 

### 1 Asset Contracts
[SkyWeaverAssets.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/tokens/SkyweaverAssets.sol): Implementation of [ERC-1155](https://github.com/ethereum/eips/issues/1155) that keeps track of all the users' Skyweaver asset balance and contains all the token functions. Assets can include cards, cosmetics, etc.

[SkyweaverCurrencies.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/tokens/SkyweaverCurrencies.sol): Implementation of [ERC-1155](https://github.com/ethereum/eips/issues/1155) that keeps track of all the users' Skyweaver currencies. Currencies could be Weave for example.


### 2 Asset Supply Manager
[SWSupplyManager.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/shop/SWSupplyManager.sol): This contract controls the tokens minting permissions and supply parameters. The supply manager keeps track of which factory contract can which which token id and what if the maximum supply of a given token id, if any. Factories can be added or removed and they can be granted permissions to mint some token ids. 

## 3. Factories
Factories are contracts that will submit minting request to the Asset Supply Manager. Factories contain the minting logic for different token ids.

[SilverCardsFactory.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/shop/SilverCardsFactory.sol): Allows players to purchase any silver card for a fixed price.

[EternalHeroesFactory.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/shop/EternalHeroesFactory.sol): Allows players to purchase Eternal Heroes for a given price depending on its current price tier. The price of an Eternal Hero will increase every N copies sold, until the maximum supply is reached for that Eternal Hero.

[WeaveFactory.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/shop/WeaveFactory.sol): Allows owner of the factory to mint a given number of weave as a function of time. Curent target is to allow for 1m Weave to be mintable per week.

[GoldCardsFactory.sol](https://github.com/horizon-games/SkyWeaver-contracts/blob/master/contracts/shop/GoldCardsFactory.sol): Allows players to convert weave into a random gold card. Players first have to commit their weave (deposit) and have to mint the gold card in a subsequent transaction, after N blocks have passed. Anyone can execute the second transaction on behalf of a user.






