import { usePlugin, BuidlerConfig } from '@nomiclabs/buidler/config'

usePlugin('@nomiclabs/buidler-truffle5')
usePlugin('buidler-gas-reporter')
usePlugin('solidity-coverage')

const config: BuidlerConfig = {
  paths: {
    artifacts: './artifacts'
  },
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: true,
      runs: 10000
    }
  },
  networks: {
    ganache: {
      url: 'http://127.0.0.1:8545',
      blockGasLimit: 10000000
    },
    coverage: {
      url: 'http://localhost:8555'
    }
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS === true,
    currency: 'USD',
    gasPrice: 21,
    showTimeSpent: true
  }
}

export default config
