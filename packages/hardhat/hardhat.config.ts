import { vars, HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-ignition-ethers";
import "hardhat-jest"; // Typescript

// Add the following variables to the configuration variables.
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const EVM_PRIVATE_KEY_1 = vars.get("EVM_PRIVATE_KEY_1");
const EVM_PRIVATE_KEY_2 = vars.get("EVM_PRIVATE_KEY_2");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");
const BASESCAN_API_KEY = vars.get("BASESCAN_API_KEY");
const COREDAO_BLOCK_EXPLORER_API_KEY = vars.get("COREDAO_BLOCK_EXPLORER_API_KEY");
const SCROLL_API_KEY = vars.get("SCROLL_API_KEY");

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
    scrollSepolia: {
      url: `https://sepolia-rpc.scroll.io`,
      accounts: [EVM_PRIVATE_KEY_1, EVM_PRIVATE_KEY_2],
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1],
    },
    scroll: {
      url: `https://scroll-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [EVM_PRIVATE_KEY_1, EVM_PRIVATE_KEY_2],
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
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com",
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
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com",
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
      scroll: SCROLL_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      baseSepolia: BASESCAN_API_KEY,
      scrollSepolia: SCROLL_API_KEY,
      coredao: COREDAO_BLOCK_EXPLORER_API_KEY,
    },
  },
};

export default config;
