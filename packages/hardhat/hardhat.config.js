/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();

require("hardhat-deploy");
require("hardhat-gas-reporter");
// generate typescript types upon compilation
require("@typechain/hardhat");

// this allows hardhat to use ethers for tests
require("@nomiclabs/hardhat-ethers");

// allow upgradeable contracts in tests
// require('@openzeppelin/hardhat-upgrades');

// this allows hardhat to use jest for tests
require("hardhat-jest");

const selectedNetwork = process.env.HARDHAT_NETWORK || process.env.NETWORK || "localhost";

function getApiKey(network) {
  switch (network) {
    case "avalanche":
    case "fuji": {
      return process.env.SNOWTRACE_API_KEY;
    }
    case "localhost":
    case "mainnet":
    case "goerli": {
      return process.env.ETHERSCAN_API_KEY;
    }
    case "optimism":
    case "goerliOptimism":{
      // optimism.etherscan.io: create an account at https://optimistic.etherscan.io/myapikey
      return process.env.OPTIMISM_API_KEY;
    }
    case "mumbai":
    case "matic": {
      // https://polygonscan.com/
      return process.env.POLYGONSCAN_API_KEY;
    }
    case "arbitrum":
    case "goerliArbitrum":
    case "devNetArbitrum": {
      return process.env.ARBISCAN_API_KEY;
    }
    case 'celo':
    case 'alfajores': {
      // https://celoscan.io/
      return process.env.CELOSCAN_API_KEY;
    }
    case 'bsc':
    case 'bscTestnet': {
      return process.env.BSC_API_KEY;
    }
    case 'moonbeam':
    case 'moonriver': {
      return process.env.MOONSCAN_API_KEY;
    }
    case 'baseGoerli': {
      // API keys aren't supported yet
      return ''
      // return assertEnv('BASESCAN_API_KEY')
    }
    case "localhost": {
      return undefined;
    }
    default: {
      // Add new cases to handle other networks!
      throw new Error("unknown network");
    }
  }
}

module.exports = {
  selectedNetwork,
  defaultNetwork: selectedNetwork,
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP || null,
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_KEY}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
      chainId: 5,
      gas: 10000000,
      gasPrice: 1000,
      // try to prevent a timeout
      timeout: 99999999,
      networkCheckTimeout: 99999999,
      timeoutBlocks:99999
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_KEY}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
      chainId: 80001,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true
        },
      },
    ]
  },
  ovm: {
    solcVersion: "0.7.6",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    seller: {
      default: 1,
    }
  },
  etherscan: {
    apiKey: getApiKey(selectedNetwork)
  }
};