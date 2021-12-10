Skyweaver Card Contracts
========================

Skyweaver trading card smart contracts built on Ethereum. Skyweaver cards follow the [ERC-1155 token standard](https://github.com/0xsequence/erc-1155).

## Production contract addresses

Skyweaver assets and market are in production on the Polygon mainnet as of Nov 25, 2021. The production contract address are:

* **Skyweaver Assets:** [0x631998e91476DA5B870D741192fc5Cbc55F5a52E](https://polygonscan.com/address/0x9B609Bf3A3977Ee7254210E0A0D835251540c4D5#tokentxns)
* **Skyweaver Niftyswap Exchange (aka Skyweaver Market):** [0x9B609Bf3A3977Ee7254210E0A0D835251540c4D5](https://polygonscan.com/address/0x9B609Bf3A3977Ee7254210E0A0D835251540c4D5#tokentxns)


## Install

`yarn add @horizongames/skyweaver-contracts` or `npm install @horizongames/skyweaver-contracts`


## Overview

### 1 Asset Contracts

* [SkyWeaverAssets.sol](https://github.com/horizon-games/Skyweaver-contracts/blob/master/contracts/tokens/SkyweaverAssets.sol): Implementation of [ERC-1155](https://github.com/ethereum/eips/issues/1155) that keeps track of all the users' Skyweaver asset balance and contains all the token functions. Assets can include cards, cosmetics, etc.


### 2 Asset Supply Manager

* [SWSupplyManager.sol](https://github.com/horizon-games/Skyweaver-contracts/blob/master/contracts/shop/SWSupplyManager.sol): This contract controls the tokens minting permissions and supply parameters. The supply manager keeps track of which factory contract can which which token id and what if the maximum supply of a given token id, if any. Factories can be added or removed and they can be granted permissions to mint some token ids. 

### 3. Factories

Factories are contracts that will submit minting request to the Asset Supply Manager. Factories contain the minting logic for different token ids.

* [SilverCardsFactory.sol](https://github.com/horizon-games/Skyweaver-contracts/blob/master/contracts/shop/SilverCardsFactory.sol): Allows players to purchase any silver card for a fixed price.

* [FreemintFactory.sol](https://github.com/horizon-games/Skyweaver-contracts/blob/master/contracts/shop/SilverConquestFactory.sol): Allows owner to mint any tokens within a given range. This factory will be 
used to mint communiy related assets, special even assets that are meant to be given away.


## Dev env & release

This repository is configured as a yarn workspace, and has multiple pacakge.json files. Specifically,
we have the root ./package.json for the development environment, contract compilation and testing. Contract
source code and distribution files are packaged in "src/package.json".

To release a new version, make sure to bump the version, tag it, and run `yarn release`. The `release` command
will publish the `@horizongames/skyweaver-contracts` package in the "src/" folder, separate from the root package. The advantage
here is that application developers who consume `@horizongames/skyweaver-contracts` aren't required to install any of the devDependencies
in their toolchains as our build and contract packages are separated.

## LICENSE

Copyright (c) 2017-present [Horizon Blockchain Games Inc](https://horizon.io).

Licensed under [Apache-2.0](./LICENSE)
