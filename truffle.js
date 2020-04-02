const path = require('path')
const dotenv = require('dotenv')
const HDWalletProvider = require('truffle-hdwallet-provider')
const NonceTrackerSubprovider = require('web3-provider-engine/subproviders/nonce-tracker')

const provider = (network, environment) => () => {
  const envFile = path.resolve(__dirname, `config/${environment}.env`)
  const envLoad = dotenv.config({ path: envFile })

  if (envLoad.error) {
    console.error(envLoad.error)
    process.exit(1)
  }
  const config = envLoad.parsed

  const wallet = new HDWalletProvider(
    config['ETH_MNEMONIC'],
    `https://${network}.infura.io/v3/${config['INFURA_API_KEY']}`
  )

  //https://ethereum.stackexchange.com/a/50038
  const nonceTracker = new NonceTrackerSubprovider()

  wallet.engine._providers.unshift(nonceTracker)
  nonceTracker.setEngine(wallet.engine)

  return wallet
}

module.exports = {
  networks: {
    ganache: {
      network_id: 127001,
      host: "127.0.0.1",
      port: 8545
    }
  },
  compilers: {
    solc: {
      version: "./node_modules/solc"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
      details: {
        yul: false
      }
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      gasPrice: 21,
      outputFile: '/dev/null',
      showTimeSpent: true
    }
  }
}
