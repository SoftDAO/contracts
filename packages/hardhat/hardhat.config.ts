import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-jest"; // Typescript
import { HardhatUserConfig, vars } from "hardhat/config";

// Add the following variables to the configuration variables.
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const EVM_PRIVATE_KEY_1 = vars.get("EVM_PRIVATE_KEY_1");
// const EVM_PRIVATE_KEY_2 = vars.get("EVM_PRIVATE_KEY_2");
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
      accounts: [EVM_PRIVATE_KEY_1],
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

// // If not set, it uses ours Alchemy's default API key.
// // You can get your own at https://dashboard.alchemyapi.io
// const providerApiKey = process.env.ALCHEMY_API_KEY || "XXX";
// // If not set, it uses the hardhat account 0 private key.
// const deployerPrivateKey =
//   process.env.DEPLOYER_PRIVATE_KEY ?? "0x000";
// // If not set, it uses ours Etherscan default API key.
// const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "XXX";

// const selectedNetwork = process.env.HARDHAT_NETWORK || process.env.NETWORK || "localhost";

// function getApiKey(network) {
//   switch (network) {
//     case "avalanche":
//     case "fuji": {
//       return process.env.SNOWTRACE_API_KEY;
//     }
//     case "gnosis": {
//       return process.env.GNOSISSCAN_API_KEY;
//     }
//     case "mainnet":
//     case "goerli": {
//       return process.env.ETHERSCAN_API_KEY;
//     }
//     case "sepolia": {
//       return process.env.ETHERSCAN_API_KEY;
//     }
//     case "baseSepolia": {
//       return process.env.BASESCAN_API_KEY;
//     }
//     case "base": {
//       return process.env.BASESCAN_API_KEY;
//     }
//     case "optimism":
//     case "goerliOptimism":{
//       // optimism.etherscan.io: create an account at https://optimistic.etherscan.io/myapikey
//       return process.env.OPTIMISTIC_ETHERSCANSCAN_API_KEY;
//     }
//     case "mumbai":
//     case "matic": {
//       // https://polygonscan.com/
//       return process.env.POLYGONSCAN_API_KEY;
//     }
//     case "arbitrum":
//     case "goerliArbitrum":
//     case "devNetArbitrum": {
//       return process.env.ARBISCAN_API_KEY;
//     }
//     case 'celo':
//     case 'alfajores': {
//       // https://celoscan.io/
//       return process.env.CELOSCAN_API_KEY;
//     }
//     case 'bsc':
//     case 'bscTestnet': {
//       return process.env.BSC_API_KEY;
//     }
//     case 'moonbeam':
//     case 'moonriver': {
//       return process.env.MOONSCAN_API_KEY;
//     }
//     case 'baseGoerli': {
//       // API keys aren't supported yet
//       return ''
//       // return assertEnv('BASESCAN_API_KEY')
//     }
//     case "base": {
//       return process.env.BASESCAN_API_KEY;
//     }
//     case "baseSepolia": {
//       return process.env.BASESCAN_API_KEY;
//     }
//     case "polygonAmoy": {
//       return process.env.POLYGONSCAN_API_KEY;
//     }
//     case "localhost": {
//       return undefined;
//     }
//     default: {
//       // Add new cases to handle other networks!
//       throw new Error("unknown network");
//     }
//   }
// }

// const config: HardhatUserConfig = {
//   // solidity: {
//   //   version: "0.8.17",
//   //   settings: {
//   //     optimizer: {
//   //       enabled: true,
//   //       // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
//   //       runs: 200,
//   //     },
//   //   },
//   // },
//   solidity: {
//     compilers: [
//       {
//         version: "0.8.21",
//         settings: {
//           optimizer: {
//             enabled: true,
//             runs: 200,
//           },
//           viaIR: true,
//         },
//       },
//       {
//         version: "0.8.16",
//         settings: {
//           optimizer: {
//             enabled: true,
//             runs: 200,
//           },
//           viaIR: true,
//         },
//       },
//       {
//         version: "0.8.17",
//         settings: {
//           optimizer: {
//             enabled: true,
//             runs: 200,
//           },
//           viaIR: true,
//         },
//       },
//     ],
//   },
//   defaultNetwork: selectedNetwork,
//   namedAccounts: {
//     deployer: {
//       // By default, it will take the first Hardhat account as the deployer
//       default: 0,
//     },
//   },
//   networks: {
//     // View the networks that are pre-configured.
//     // If the network you are looking for is not here you can add new network settings
//     hardhat: {
//       forking: {
//         url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
//         enabled: process.env.MAINNET_FORKING_ENABLED === "true",
//       },
//     },
//     mainnet: {
//       url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     sepolia: {
//       url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     goerli: {
//       url: `https://eth-goerli.alchemyapi.io/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     arbitrum: {
//       url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     arbitrumSepolia: {
//       url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     optimism: {
//       url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     optimismSepolia: {
//       url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     polygon: {
//       url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     polygonMumbai: {
//       url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     polygonZkEvm: {
//       url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     polygonZkEvmTestnet: {
//       url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
//       accounts: [deployerPrivateKey],
//     },
//     gnosis: {
//       url: "https://rpc.gnosischain.com",
//       accounts: [deployerPrivateKey],
//     },
//     chiado: {
//       url: "https://rpc.chiadochain.net",
//       accounts: [deployerPrivateKey],
//     },
//     base: {
//       url: "https://mainnet.base.org",
//       accounts: [deployerPrivateKey],
//     },
//     baseGoerli: {
//       url: "https://goerli.base.org",
//       accounts: [deployerPrivateKey],
//     },
//     baseSepolia: {
//       url: "https://sepolia.base.org",
//       accounts: [deployerPrivateKey],
//     },
//     scrollSepolia: {
//       url: "https://sepolia-rpc.scroll.io",
//       accounts: [deployerPrivateKey],
//     },
//     scroll: {
//       url: "https://rpc.scroll.io",
//       accounts: [deployerPrivateKey],
//     },
//     pgn: {
//       url: "https://rpc.publicgoods.network",
//       accounts: [deployerPrivateKey],
//     },
//     pgnTestnet: {
//       url: "https://sepolia.publicgoods.network",
//       accounts: [deployerPrivateKey],
//     },
//   },
//   // configuration for harhdat-verify plugin
//   etherscan: {
//     apiKey: getApiKey(selectedNetwork),
//     customChains: [
//       {
//         network: "baseSepolia",
//         chainId: 84532,
//         urls: {
//           apiURL: "https://api-sepolia.basescan.org/api",
//           browserURL: "https://sepolia.basescan.org",
//         },
//       },
//     ],
//   },
//   // configuration for etherscan-verify from hardhat-deploy plugin
//   verify: {
//     etherscan: {
//       apiKey: `${etherscanApiKey}`,
//     },
//   },
//   sourcify: {
//     enabled: false,
//   },
// };

// export default config;
