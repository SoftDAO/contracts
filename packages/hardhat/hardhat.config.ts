import { vars, HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-ignition-ethers";
import "hardhat-jest"; // Typescript

// Add the following variables to the configuration variables.
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const EVM_PRIVATE_KEY_1 = vars.get("EVM_PRIVATE_KEY_1");
// const EVM_PRIVATE_KEY_2 = vars.get("EVM_PRIVATE_KEY_2");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");
const BASESCAN_API_KEY = vars.get("BASESCAN_API_KEY");
const COREDAO_BLOCK_EXPLORER_API_KEY = vars.get("COREDAO_BLOCK_EXPLORER_API_KEY");
const BSCSCAN_API_KEY = vars.get("BSCSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  sourcify: {
    enabled: false,
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    baseSepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    bsc: {
      url: `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    bscTestnet: {
      url: `https://bnb-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    coredao: {
      url: "https://rpc.coredao.org/",
      accounts: [EVM_PRIVATE_KEY_1],
    },
  },
  etherscan: {
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },
      {
        network: "mainnet",
        chainId: 1,
        urls: {
          apiURL: "https://api.etherscan.io/api",
          browserURL: "https://etherscan.io",
        },
      },
      {
        network: "bsc",
        chainId: 56,
        urls: {
          apiURL: "https://api.bscscan.com/api",
          browserURL: "https://bscscan.com/",
        },
      },
      {
        network: "bscTestnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com/",
        },
      },
      {
        network: "coredao",
        chainId: 1116,
        urls: {
          apiURL: "https://openapi.coredao.org/api",
          browserURL: "https://scan.coredao.org",
        },
      },
    ],
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      base: BASESCAN_API_KEY,
      baseSepolia: BASESCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      coredao: COREDAO_BLOCK_EXPLORER_API_KEY,
      bsc: BSCSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
    },
  },
};

export default config;
