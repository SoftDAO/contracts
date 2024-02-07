/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();

require("hardhat-deploy");
require("hardhat-gas-reporter");
// generate typescript types upon compilation
require("@typechain/hardhat");

// this allows hardhat to use ethers for tests
require("@nomiclabs/hardhat-ethers");

require("@nomicfoundation/hardhat-foundry");

require("@nomiclabs/hardhat-etherscan");

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
    case "gnosis": {
      return process.env.GNOSISSCAN_API_KEY;
    }
    case "mainnet":
    case "goerli": {
      return process.env.ETHERSCAN_API_KEY;
    }
    case "optimism":
    case "goerliOptimism":{
      // optimism.etherscan.io: create an account at https://optimistic.etherscan.io/myapikey
      return process.env.OPTIMISTIC_ETHERSCANSCAN_API_KEY;
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
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 1
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 42161
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`]
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`]
    },
    gnosis: {
      url: `https://rpc.ankr.com/gnosis`,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 100
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_KEY}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
      chainId: 5,
      gas: 10000000,
      gasPrice: 400000,
      // try to prevent a timeout
      timeout: 999999999,
      networkCheckTimeout: 99999999,
      timeoutBlocks:99999
    },
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 137,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_KEY}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
      chainId: 80001,
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 10,
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 43114,
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [`${process.env.TS_DEPLOYER_PRIVATE_KEY}`],
      chainId: 43113,
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true
        },
      },
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