# SoftDAO Contracts

    ███████  ██████  ███████ ████████
    ██      ██    ██ ██         ██
    ███████ ██    ██ █████      ██
         ██ ██    ██ ██         ██
    ███████  ██████  ██         ██

## Table of Contents

- [Developer Setup](#developer-setup)
- [Contracts](#contracts)
- [Testing](#testing)
- [Deploying and Verifying](#deploying-and-verifying)

## Developer Setup

Before you begin, you need to install the following tools and run the following commands: <br />
Note: Feel free to skip this section if you don't plan on deploying, verifying or testing the contracts. <br />
Note: `XXXXXXXXXX` needs to be replaced with your API key.

- Node (v18) and yarn (v3)
- Git
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Go to `packages/hardhat` and run:
  - Run `npx hardhat vars set EVM_PRIVATE_KEY_1 XXXXXXXXXX`
  - Run `npx hardhat vars set EVM_PRIVATE_KEY_2 XXXXXXXXXX`
  - Run `npx hardhat vars set ALCHEMY_API_KEY XXXXXXXXXX`
  - Run `npx hardhat vars set ETHERSCAN_API_KEY XXXXXXXXXX`

Note: Setting up multiple `EVM_PRIVATE_KEY_` is optional, contracts and contract calls which require multiple addresses will require you to set up multiple like this.

## Contracts

Key smart contracts are found in the `packages/hardhat/contracts` folder and cover several use cases:

- `claim`: contracts to distribute tokens with lockup conditions like vesting (continuous, tranche-based, or price-based) and voting power
- `governance`: contracts to create a DAO, governor, and timelock. Allowing DAO members to vote with tokens held in a vesting contract
- `sale`: contracts to sell tokens to users, can include access restrictions, fair random queues, and multiple payment methods
- `utilities`: contains other useful contracts (i.e. contract registry)

Related:

- `interfaces`: are helpful when building third-party contracts relying on Soft DAO primitives
- `mocks`: are stubbed out contracts for testing and development (not for use in production)
- `token`: are commonly used token standards

These contracts are a WIP:

- `payment`: contracts to receive arbitrary payments from users and track how much they have sent

## Testing

Setup your repository and contracts for the tests:

```shell
yarn
```

Run Hardhat tests: <br />
Note: This command also includes a compile command and may take some time to complete.

```shell
yarn test
```

Run Foundry tests: <br />
Note: This will do some setup the first time you run it and may take some time to complete.

```shell
yarn forge-test
```

## Deploying and Verifying

### Deploying a contract (using Hardhat)

Here is a real example where you can deploy an ERC20. Feel free to go to `ignition/modules/Deploy_GenericERC20.ts` and modify it to meet your needs first.

```shell
npx hardhat ignition deploy ignition/modules/Deploy_GenericERC20.ts --network <your-network>
```

`<your-network>` can be `localhost`, `sepolia`, etc. You can customize network configurations in `hardhat.config.ts`.

For key storage we utilize the configuration variables (see [Developer Setup](#developer-setup) for instructions). `EVM_PRIVATE_KEY_1` will be the deployer of any contracts you end up deploying using the commands above. The deployer account will be used to execute any function calls that are part of your deployment script.

### Verifying a contract (using Hardhat)

Simply add the `--verify` flag to the end of the `deploy` command.

```shell
npx hardhat ignition deploy ignition/modules/Deploy_GenericERC20.ts --network <your-network> --verify
```

### Deploying FlatPriceSale and FlatPriceSaleFactory

```shell
npx hardhat ignition deploy ignition/modules/Deploy_FlatPriceSaleFactory.ts --network <your-network> --verify
```

## Using Deployed Soft DAO Contracts

### Launching a Sale

This uses the FlatPriceSaleFactory contract to create a new sale with the configuration you desire.

```shell
npx hardhat ignition deploy ignition/modules/Execute_NewSale.ts --network <your-network>
```

### WIP: Reviewing the Registry

Use the registry contracts below to find other official Soft DAO contracts. The registry is used to mark specific addresses as authentic contracts supporting specific interfaces following the [ERC-165](https://eips.ethereum.org/EIPS/eip-165) standard, and the easiest way to decode the Registry contracts is via a subgraph watching the registry, such as those deployed by [Tokensoft](https://thegraph.com/hosted-service/subgraph/tokensoft/sales-mainnet).

Note: Lowercase contract addresses are used as subgraph entity IDs.

#### Subgraph Example

URL: https://thegraph.com/hosted-service/subgraph/tokensoft/sales-mainnet
Query:

```graphql
{
  registry(id: "0xc70573b924c92618e6143f6ac4c2b1ad7ba8785b") {
    addresses {
      id
      interfaceIds
      interfaceNames
    }
  }
}
```

Response:

```json
{
  "data": {
    "registry": {
      "addresses": [
        {
          "id": "0xf266195e1b30b8f536834303c555bd6aaf063f04",
          "interfaceIds": [
            "0xab85ea0e",
            "0xfc57b782",
            "0x09e04257",
            "0x35ef410e"
          ],
          "interfaceNames": [
            "IDistributor",
            "IAdvancedDistributor",
            "IContinuousVesting",
            "IMerkleSet"
          ]
        }
      ]
    }
  }
}
```

This resonse means that the address `0xf266195e1b30b8f536834303c555bd6aaf063f04` is known to the Soft DAO as a Distributor and includes advanced features, a merkle root access list, and continuous vesting. See the two files below for more information on the interfaces.

#### `./subgraph/abis/interfaces.json`

This file includes the ERC-165 interface for each Solidity contract/interface as well as the source solidity file defining the interface.

Example results:

```json
{
  "Registry": {
    "source": "contracts/utilities/Registry.sol",
    "id": "0xe711948a"
  },
  "FlatPriceSaleFactory": {
    "source": "contracts/sale/v2/FlatPriceSaleFactory.sol",
    "id": "0xfcb73502"
  },
  "FlatPriceSale": {
    "source": "contracts/sale/v2/FlatPriceSale.sol",
    "id": "0x7a6d298d"
  },
  "IERC20": {
    "source": "@openzeppelin/contracts/token/ERC20/IERC20.sol",
    "id": "0x36372b07"
  },
  "IVotes": {
    "source": "@openzeppelin/contracts/governance/utils/IVotes.sol",
    "id": "0xe90fb3f6"
  },
  ...
}
```

#### `./subgraph/build/interfaces.ts`

This file allows one to reference the interfaces when developing a subgraph.

```typescript
import { TypedMap } from "@graphprotocol/graph-ts"

class knownInterfacesClass extends TypedMap<string, string>{
  constructor(){
	super()

	// map interface names to ids AND ids to names

    this.set("Sweepable", "0xac1d7eef")
    this.set("0xac1d7eef", "Sweepable")
    ...
  }

  // convenience getters to emulate an object in AssemblyScript
  get Sweepable(): string {
    let value = this.get("Sweepable")
    return value!.toString()
  }
  ...
}

export const knownInterfaces = new knownInterfacesClass
```

Example AssemblyScript mapping file `exampleMapping.ts`

```typescript
import { knownInterfaces } from "../../generated/interfaces";

// do something based on interface ID
if (registeredAddress.interfaceIds.includes(knownInterfaces.IDistributor)) {
  log.info("Registered {} as a Distributor", [registeredAddress.id]);
  saveDistributor(distributor.id, block);
}
```

## Deployed Smart Contracts


### zkSync Mainnet

- [0x3551BA6B7b3edfF8b1c82b87D1De606270Aec24F](https://explorer.zksync.io/address/0x3551BA6B7b3edfF8b1c82b87D1De606270Aec24F)
- [0xfb563bAAaB145Bd393b36a2a76E92A1712F41f8C](https://explorer.zksync.io/address/0xfb563bAAaB145Bd393b36a2a76E92A1712F41f8C)
- [0x870C1744173498905c9a1Da624CcC9852513f90D](https://explorer.zksync.io/address/0xEaC172D6Fd56933F894176eE32Dd95b0a4abb083)
- [0xB63DC17fA834AA961aE88b6005e507Ddb60B2c53](https://explorer.zksync.io/address/0xB63DC17fA834AA961aE88b6005e507Ddb60B2c53)
- [0xc6B19D47a336d3382f57EdD768233076a27C28c2](https://explorer.zksync.io/address/0xc6B19D47a336d3382f57EdD768233076a27C28c2)
- [0xEaC172D6Fd56933F894176eE32Dd95b0a4abb083](https://explorer.zksync.io/address/0xEaC172D6Fd56933F894176eE32Dd95b0a4abb083)

### zkSync sepolia

- [0x3551BA6B7b3edfF8b1c82b87D1De606270Aec24F](https://sepolia.explorer.zksync.io/address/0x3551BA6B7b3edfF8b1c82b87D1De606270Aec24F#contract)
- [0xd1515bB65096d67895287bC180521007bc71900F](https://sepolia.explorer.zksync.io/address/0xd1515bB65096d67895287bC180521007bc71900F#contract)
- [0xf38756A27593CEd6b4bF3807b44a88908b3d8ccC](https://sepolia.explorer.zksync.io/address/0xf38756A27593CEd6b4bF3807b44a88908b3d8ccC#contract)
- [0x5CD85a2C91ba4420E0247c3bB7CEe1299EA150c8](https://sepolia.explorer.zksync.io/address/0x5CD85a2C91ba4420E0247c3bB7CEe1299EA150c8#contract)
- [0xEaC172D6Fd56933F894176eE32Dd95b0a4abb083](https://sepolia.explorer.zksync.io/address/0xEaC172D6Fd56933F894176eE32Dd95b0a4abb083#contract)
- [0x5B8a021F311BDAbE7DcA7bEf84DBF3D1FFa80846](https://sepolia.explorer.zksync.io/address/0x5B8a021F311BDAbE7DcA7bEf84DBF3D1FFa80846#contract)



### Base sepolia

- [0x4aD35755F3bC7d591CBa3D0D0Eb27C2497A73d30](https://sepolia.basescan.org/address/0x4aD35755F3bC7d591CBa3D0D0Eb27C2497A73d30)
- [0xC0A1CFc14996204C4bac28758b0A2C0d7b006fd9](https://sepolia.basescan.org/address/0xC0A1CFc14996204C4bac28758b0A2C0d7b006fd9)
- [0xab276a23b467CfDc86f59C1aF3103E526ebc38a2](https://sepolia.basescan.org/address/0xab276a23b467CfDc86f59C1aF3103E526ebc38a2)

### Base mainnet

- [0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5](https://basescan.org/address/0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5)
- [0x904C250B5B1b45274d2d7909b9394bEdA143DD5C](https://basescan.org/address/0x904C250B5B1b45274d2d7909b9394bEdA143DD5C)
- [0x5103ED418004b03a796a41c97BdaaC8FfB5aa264](https://basescan.org/address/0x5103ED418004b03a796a41c97BdaaC8FfB5aa264)

### Avalanche

- [0x9Ef415dE715c0a55AA867bcDEa00eAf914aD6cb7](https://snowtrace.io/address/0x9Ef415dE715c0a55AA867bcDEa00eAf914aD6cb7)
- [0x92DcF0aFD197E73345c893b856B93ee68CB61809](https://snowtrace.io/address/0x92DcF0aFD197E73345c893b856B93ee68CB61809)
- [0x245A9bD01ccF512D1374BE4F7A8Eb06dA21E6333](https://snowtrace.io/address/0x245A9bD01ccF512D1374BE4F7A8Eb06dA21E6333)

### Avalanche Fuji

- [0xfE245D36F8b4079C62B74eD4FfE7B055DB1B5A2D](https://testnet.snowtrace.io/address/0xfE245D36F8b4079C62B74eD4FfE7B055DB1B5A2D)
- [0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118](https://testnet.snowtrace.io/address/0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118)
- [0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A](https://testnet.snowtrace.io/address/0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A)

### Ethereum Mainnet

- [0x865D024BFd9e1C2Cd665fAc6666c5C3E4a375dd7](https://www.etherscan.io/address/0x865D024BFd9e1C2Cd665fAc6666c5C3E4a375dd7)
- [0x135D889aFF58584e12ab3bd4ce327a18aF3356Ef](https://www.etherscan.io/address/0x135D889aFF58584e12ab3bd4ce327a18aF3356Ef)
- [0xc70573B924C92618E6143F6ac4C2B1aD7ba8785b](https://www.etherscan.io/address/0xc70573B924C92618E6143F6ac4C2B1aD7ba8785b)

### Polygon

- [0x17c14f6087C62666D28361697f4a9B4D39DC3Bc5](https://polygonscan.com/address/0x17c14f6087c62666d28361697f4a9b4d39dc3bc5)
- [0x07537efBa62504425f879E9D60A25aB09D139161](https://polygonscan.com/address/0x07537efBa62504425f879E9D60A25aB09D139161)
- [0xf9d55F554175B8a18cDB167063383f5462442EAD](https://polygonscan.com/address/0xf9d55F554175B8a18cDB167063383f5462442EAD)

### Polygon Amoy

- [0x89a415207b07a739b93d4fc70a2eab67c0effaa8](https://amoy.polygonscan.com/address/0x89a415207b07a739b93d4fc70a2eab67c0effaa8)
- [0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5](https://amoy.polygonscan.com/address/0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5)
- [0x4959353534a8ecf0b698a9d3115fbce393f3435c](https://amoy.polygonscan.com/address/0x4959353534a8ecf0b698a9d3115fbce393f3435c)
- [0x904c250b5b1b45274d2d7909b9394beda143dd5c](https://amoy.polygonscan.com/address/0x904c250b5b1b45274d2d7909b9394beda143dd5c)
- [0x5103ED418004b03a796a41c97BdaaC8FfB5aa264](https://amoy.polygonscan.com/address/0x5103ED418004b03a796a41c97BdaaC8FfB5aa264)
- [0x638E9F037F8B45F9B1b20bEB890225e1e8d29B95](https://amoy.polygonscan.com/address/0x638E9F037F8B45F9B1b20bEB890225e1e8d29B95)

### Ethereum Goerli

- [0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118](https://goerli.etherscan.io/address/0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118)
- [0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A](https://goerli.etherscan.io/address/0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A)
- [0x3a03bF4106404B94d426bC31B831889f0d43960b](https://goerli.etherscan.io/address/0x3a03bF4106404B94d426bC31B831889f0d43960b)

### Polygon Mumbai

- [0x31b7625997603Ce07B349d6f0300B6CB5896959b](https://mumbai.polygonscan.com/address/0x31b7625997603Ce07B349d6f0300B6CB5896959b)
- [0x493E0a1f8304832658c461c2EaBfaeCeeE507097](https://mumbai.polygonscan.com/address/0x493E0a1f8304832658c461c2EaBfaeCeeE507097)
- [0x7afd2700F8e915ed4D39897d0D284A54e6348Ad3](https://mumbai.polygonscan.com/address/0x7afd2700F8e915ed4D39897d0D284A54e6348Ad3)

### Arbitrum Goerli

- [0x07537efBa62504425f879E9D60A25aB09D139161](https://goerli.arbiscan.io/address/0x07537efBa62504425f879E9D60A25aB09D139161)
- [0x17c14f6087C62666D28361697f4a9B4D39DC3Bc5](https://goerli.arbiscan.io/address/0x17c14f6087C62666D28361697f4a9B4D39DC3Bc5)
- [0x71bE8339023d779f2f85893761729Bb27b97891d](https://goerli.arbiscan.io/address/0x71bE8339023d779f2f85893761729Bb27b97891d)

### Celo Alfajores

- [0x9c2D86d00aFDe6e616CADfBc0fe2D47C1d22b1c8](https://alfajores.celoscan.io/address/0x9c2D86d00aFDe6e616CADfBc0fe2D47C1d22b1c8)
- [0xeEDB0e8e589F9ADf6768fc006BaA1C6462f5e563](https://alfajores.celoscan.io/address/0xeEDB0e8e589F9ADf6768fc006BaA1C6462f5e563)
- [0x000047203100A45635029eC21bbBec5EC53Cb6f6](https://alfajores.celoscan.io/address/0x000047203100A45635029eC21bbBec5EC53Cb6f6)

### Celo

- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://explorer.celo.org/mainnet/address/0xb41169Cc124298Be20e2Ca956cC46E266ab5E203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://explorer.celo.org/mainnet/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xA82d7ED01c31DD2A46681D18E3E213C9E9231605](https://explorer.celo.org/mainnet/address/0xA82d7ED01c31DD2A46681D18E3E213C9E9231605)

### Optimism

- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://optimistic.etherscan.io/address/0xb41169cc124298be20e2ca956cc46e266ab5e203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://optimistic.etherscan.io/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xA82d7ED01c31DD2A46681D18E3E213C9E9231605](https://optimistic.etherscan.io/address/0xA82d7ED01c31DD2A46681D18E3E213C9E9231605)

### Arbitrum

- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://arbiscan.io/address/0xb41169Cc124298Be20e2Ca956cC46E266ab5E203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://arbiscan.io/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xa82d7ed01c31dd2a46681d18e3e213c9e9231605](https://arbiscan.io/address/0xa82d7ed01c31dd2a46681d18e3e213c9e9231605)

### Binance Smart Chain

- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://bscscan.com/address/0xb41169Cc124298Be20e2Ca956cC46E266ab5E203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://bscscan.com/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xA82d7ED01c31DD2A46681D18E3E213C9E9231605](https://bscscan.com/address/0xA82d7ED01c31DD2A46681D18E3E213C9E9231605)

## WIP: Disabling type and linting error checks

> **Hint**
> Typescript helps you catch errors at compile time, which can save time and improve code quality, but can be challenging for those who are new to the language or who are used to the more dynamic nature of JavaScript. Below are the steps to disable type & lint check at different levels

### Disabling commit checks

We run `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which lints the staged files and don't let you commit if there is an linting error.

To disable this, go to `.husky/pre-commit` file and comment out `yarn lint-staged --verbose`

```diff
- yarn lint-staged --verbose
+ # yarn lint-staged --verbose
```

### Deploying to Vercel without any checks

By default, Vercel runs types and lint checks before building your app. The deployment will fail if there are any types or lint errors.

To ignore these checks while deploying from the CLI, use:

```shell
yarn vercel:yolo
```

If your repo is connected to Vercel, you can set `NEXT_PUBLIC_IGNORE_BUILD_ERROR` to `true` in a [environment variable](https://vercel.com/docs/concepts/projects/environment-variables).

### Disabling Github Workflow

We have github workflow setup checkout `.github/workflows/lint.yaml` which runs types and lint error checks every time code is **pushed** to `main` branch or **pull request** is made to `main` branch

To disable it, **delete `.github` directory**

## Using Soft DAO Source Code

The contracts are licensed under the MIT license. Use them however you like — we'd appreciate a note that your core primitives are based on the Soft DAO!

<!-- # Sherlock Cross-Chain Distributor Audit

## Setup
* Install: `yarn`
* Testing: `yarn chain` + `yarn test`

## About the cross-chain distributor
The two contracts that will be used in conjunction are `Satellite.sol` and `CrosschainTrancheVestingMerkle.sol`. Together, they allow an admin to set up an airdrop across multiple chains. We can safely assume that the Distributor contract owner is a trusted party.

These contracts allow the owner to:
* determine eligibility, token quantities, and domain for the airdrop using a merkle root (e.g. address A gets 100 USDC tokens on Ethereum, address B gets 200 USDC tokens on Arbitrum)
* determine vesting schedule (e.g. 10% of the tokens vest August 1, 80% vest September 1, and the final 10% vest October 1).
* update eligibility and vesting as required

The beneficiaries (i.e. those people that will receive tokens in the airdrop) can be either EOAs or smart contracts, and can claim tokens in several ways:
* with a merkle proof (`crosschainTrancheVestingMerkle.claimByMerkleProof()`) - EOA and smart contract: must receive tokens on address and chain specified in the merkle leaf
* with a signature (`crosschainTrancheVestingMerkle.claimBySignature()`) - EOA only: can receive tokens on a different address or chain because the signature proves the beneficiary in the merkle leaf wants tokens somewhere else
* through a cross-chain satellite (`satellite.initiateClaim()`) - EOA and smart contract: must receive tokens on address and chain specified in the merkle leaf

Important: these contract rely on Connext correctly passing messages between chain. Of course, Connext working correctly is out of scope for this audit.

The best place to start (including a sample merkle proof) is `test/distributor/CrosschainTrancheVestingMerkle.test.ts`.

Note on testing Connext: in practice, one Connext contract will be deployed per domain/chain, but for these tests we deploy two Connext mocks to the same chain with different domains recorded.

# Regular Readme

    ███████  ██████  ███████ ████████
    ██      ██    ██ ██         ██
    ███████ ██    ██ █████      ██
         ██ ██    ██ ██         ██
    ███████  ██████  ██         ██


# Soft DAO Core Primitives

Key smart contracts are found in the `./contracts` folder and cover several use cases:
* `./claim`: distribute tokens, including lockup conditions like vesting (continuous, tranche-based, or price-based) and voting power
* `./governance`: create a DAO, including DAO governor and timelock which allow DAO members to vote with tokens held in a vesting contract
* `./interfaces`: reference these interfaces when building third-party contracts relying on Soft DAO primitives
* `./mocks`: stubbed out contracts used for testing and development - do not use these in production
* `./payment`: receive arbitrary payments from users and track how much they have sent
* `./sale`: sell tokens to users. Sales can include access restrictions, fair random queues, multiple payment methods
* `./token`: commonly used token standards
* `./utilities`: other useful contracts such as a contract registry

## Using Deployed Soft DAO contracts
Find the right contracts in the [Deployed Smart Contracts](#Deployed-Smart-Contracts) section below.

### Launching a sale
Use the FlatPriceSaleFactory contract to create a new sale.


```typescript
import { ethers } from 'hardhat'

const SaleFactoryFactory = await ethers.getContractFactory("FlatPriceSaleFactory", admin);

[deployer, admin] = await ethers.getSigners();

config = {
    // recipient of sale proceeds
    recipient: recipient.address,
    // merkle root determining sale access
    merkleRoot: merkleRoots.public,
    // merkleRoots.public,
    // sale maximum ($1,000,000) - note the 8 decimal precision!
    saleMaximum: 1e6 * 1e8,
    // user maximum ($1,000)
    userMaximum: 1e3 * 1e8,
    // purchase minimum ($1)
    purchaseMinimum: 1 * 1e8,
    // start time: now
    startTime: Math.floor(new Date().getTime() / 1000),
    // end time (10 days from now)
    endTime: Math.floor(new Date(new Date().getTime() + 10 * 24 * 3600 * 1000).getTime() / 1000),
    // max fair queue time 1 hour
    maxQueueTime: 3600,
    // information about the sale
    URI: 'https://example.com'
}

const publicSaleTx = await saleFactory.newSale(
    // the owner of the new sale (can later modify the sale)
    deployer.address,
    // the sale configuration
    config,
    // base currency
    'USD',
    // native payments enabled
    true,
    // native price oracle
    ethOracle.address,
    // payment tokens
    [usdc.address],
    // payment token price oracles
    [usdcOracle.address],
    // payment token decimals
    [6]
)
```

### Reviewing the registry
Use the registry contracts below to find other official Soft DAO contracts. The registry is used to mark specific addresses as authentic contracts supporting specific interfaces following the [ERC-165](https://eips.ethereum.org/EIPS/eip-165) standard, and the easiest way to decode the Registry contracts is via a subgraph watching the registry, such as those deployed by [Tokensoft](https://thegraph.com/hosted-service/subgraph/tokensoft/sales-mainnet).

Note that lowercase contract addresses are used as subgraph entity IDs.

#### Subgraph Example
URL: https://thegraph.com/hosted-service/subgraph/tokensoft/sales-mainnet
Query:
```graphql
{
  registry(id: "0xc70573b924c92618e6143f6ac4c2b1ad7ba8785b") {
    addresses {
      id
      interfaceIds
      interfaceNames
    }
  }
}
```

Response:
```json
{
  "data": {
    "registry": {
      "addresses": [
        {
          "id": "0xf266195e1b30b8f536834303c555bd6aaf063f04",
          "interfaceIds": [
            "0xab85ea0e",
            "0xfc57b782",
            "0x09e04257",
            "0x35ef410e"
          ],
          "interfaceNames": [
            "IDistributor",
            "IAdvancedDistributor",
            "IContinuousVesting",
            "IMerkleSet"
          ]
        }
      ]
    }
  }
}
```

This resonse means that the address `0xf266195e1b30b8f536834303c555bd6aaf063f04` is known to the Soft DAO as a Distributor and includes advanced features, a merkle root access list, and continuous vesting. See the two files below for more information on the interfaces.

#### `./subgraph/abis/interfaces.json`
This file includes the ERC-165 interface for each Solidity contract/interface as well as the source solidity file defining the interface.

Example results:
```json
{
  "Registry": {
    "source": "contracts/utilities/Registry.sol",
    "id": "0xe711948a"
  },
  "FlatPriceSaleFactory": {
    "source": "contracts/sale/v2/FlatPriceSaleFactory.sol",
    "id": "0xfcb73502"
  },
  "FlatPriceSale": {
    "source": "contracts/sale/v2/FlatPriceSale.sol",
    "id": "0x7a6d298d"
  },
  "IERC20": {
    "source": "@openzeppelin/contracts/token/ERC20/IERC20.sol",
    "id": "0x36372b07"
  },
  "IVotes": {
    "source": "@openzeppelin/contracts/governance/utils/IVotes.sol",
    "id": "0xe90fb3f6"
  },
  ...
}
```

#### `./subgraph/build/interfaces.ts`
This file allows one to reference the interfaces when developing a subgraph.

```typescript
import { TypedMap } from "@graphprotocol/graph-ts"

class knownInterfacesClass extends TypedMap<string, string>{
  constructor(){
	super()

	// map interface names to ids AND ids to names

    this.set("Sweepable", "0xac1d7eef")
    this.set("0xac1d7eef", "Sweepable")
    ...
  }

  // convenience getters to emulate an object in AssemblyScript
  get Sweepable(): string {
    let value = this.get("Sweepable")
    return value!.toString()
  }
  ...
}

export const knownInterfaces = new knownInterfacesClass
```

Example AssemblyScript mapping file `exampleMapping.ts`
```typescript
import {knownInterfaces} from '../../generated/interfaces'

// do something based on interface ID
if (registeredAddress.interfaceIds.includes(knownInterfaces.IDistributor)) {
    log.info('Registered {} as a Distributor', [registeredAddress.id])
    saveDistributor(distributor.id, block)
}
```

## Using Soft DAO source
The contracts are licensed under the MIT license. Use them however you like - we'd appreciate a note that your core primitives are based on the Soft DAO!

# Deployed Smart Contracts

## Base sepolia
- [0x4aD35755F3bC7d591CBa3D0D0Eb27C2497A73d30](https://sepolia.basescan.org/address/0x4aD35755F3bC7d591CBa3D0D0Eb27C2497A73d30)
- [0xC0A1CFc14996204C4bac28758b0A2C0d7b006fd9](https://sepolia.basescan.org/address/0xC0A1CFc14996204C4bac28758b0A2C0d7b006fd9)
- [0xab276a23b467CfDc86f59C1aF3103E526ebc38a2](https://sepolia.basescan.org/address/0xab276a23b467CfDc86f59C1aF3103E526ebc38a2)

## Base mainnet
- [0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5](https://basescan.org/address/0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5)
- [0x904C250B5B1b45274d2d7909b9394bEdA143DD5C](https://basescan.org/address/0x904C250B5B1b45274d2d7909b9394bEdA143DD5C)
- [0x5103ED418004b03a796a41c97BdaaC8FfB5aa264](https://basescan.org/address/0x5103ED418004b03a796a41c97BdaaC8FfB5aa264)


## Avalanche
- [0x9Ef415dE715c0a55AA867bcDEa00eAf914aD6cb7](https://snowtrace.io/address/0x9Ef415dE715c0a55AA867bcDEa00eAf914aD6cb7)
- [0x92DcF0aFD197E73345c893b856B93ee68CB61809](https://snowtrace.io/address/0x92DcF0aFD197E73345c893b856B93ee68CB61809)
- [0x245A9bD01ccF512D1374BE4F7A8Eb06dA21E6333](https://snowtrace.io/address/0x245A9bD01ccF512D1374BE4F7A8Eb06dA21E6333)

## Avalanche Fuji
- [0xfE245D36F8b4079C62B74eD4FfE7B055DB1B5A2D](https://testnet.snowtrace.io/address/0xfE245D36F8b4079C62B74eD4FfE7B055DB1B5A2D)
- [0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118](https://testnet.snowtrace.io/address/0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118)
- [0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A](https://testnet.snowtrace.io/address/0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A)

## Ethereum Mainnet
- [0x865D024BFd9e1C2Cd665fAc6666c5C3E4a375dd7](https://www.etherscan.io/address/0x865D024BFd9e1C2Cd665fAc6666c5C3E4a375dd7)
- [0x135D889aFF58584e12ab3bd4ce327a18aF3356Ef](https://www.etherscan.io/address/0x135D889aFF58584e12ab3bd4ce327a18aF3356Ef)
- [0xc70573B924C92618E6143F6ac4C2B1aD7ba8785b](https://www.etherscan.io/address/0xc70573B924C92618E6143F6ac4C2B1aD7ba8785b)

## Polygon
- [0x17c14f6087C62666D28361697f4a9B4D39DC3Bc5](https://polygonscan.com/address/0x17c14f6087c62666d28361697f4a9b4d39dc3bc5)
- [0x07537efBa62504425f879E9D60A25aB09D139161](https://polygonscan.com/address/0x07537efBa62504425f879E9D60A25aB09D139161)
- [0xf9d55F554175B8a18cDB167063383f5462442EAD](https://polygonscan.com/address/0xf9d55F554175B8a18cDB167063383f5462442EAD)

## Polygon Amoy
- [0x89a415207b07a739b93d4fc70a2eab67c0effaa8](https://amoy.polygonscan.com/address/0x89a415207b07a739b93d4fc70a2eab67c0effaa8)
- [0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5](https://amoy.polygonscan.com/address/0xA5D3d9Bf9940FeaCFcC2090D35e6c1AF4892DBE5)
- [0x4959353534a8ecf0b698a9d3115fbce393f3435c](https://amoy.polygonscan.com/address/0x4959353534a8ecf0b698a9d3115fbce393f3435c)
- [0x904c250b5b1b45274d2d7909b9394beda143dd5c](https://amoy.polygonscan.com/address/0x904c250b5b1b45274d2d7909b9394beda143dd5c)
- [0x5103ED418004b03a796a41c97BdaaC8FfB5aa264](https://amoy.polygonscan.com/address/0x5103ED418004b03a796a41c97BdaaC8FfB5aa264)
- [0x638E9F037F8B45F9B1b20bEB890225e1e8d29B95](https://amoy.polygonscan.com/address/0x638E9F037F8B45F9B1b20bEB890225e1e8d29B95)

## Ethereum Goerli
- [0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118](https://goerli.etherscan.io/address/0x55ee754b2cf0ccb70b808c47321ca1ad7ef0e118)
- [0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A](https://goerli.etherscan.io/address/0xB7488893AF633EFdAEB95F496B7D2FF2C50f1A9A)
- [0x3a03bF4106404B94d426bC31B831889f0d43960b](https://goerli.etherscan.io/address/0x3a03bF4106404B94d426bC31B831889f0d43960b)

## Polygon Mumbai
- [0x31b7625997603Ce07B349d6f0300B6CB5896959b](https://mumbai.polygonscan.com/address/0x31b7625997603Ce07B349d6f0300B6CB5896959b)
- [0x493E0a1f8304832658c461c2EaBfaeCeeE507097](https://mumbai.polygonscan.com/address/0x493E0a1f8304832658c461c2EaBfaeCeeE507097)
- [0x7afd2700F8e915ed4D39897d0D284A54e6348Ad3](https://mumbai.polygonscan.com/address/0x7afd2700F8e915ed4D39897d0D284A54e6348Ad3)

## Arbitrum Goerli
- [0x07537efBa62504425f879E9D60A25aB09D139161](https://goerli.arbiscan.io/address/0x07537efBa62504425f879E9D60A25aB09D139161)
- [0x17c14f6087C62666D28361697f4a9B4D39DC3Bc5](https://goerli.arbiscan.io/address/0x17c14f6087C62666D28361697f4a9B4D39DC3Bc5)
- [0x71bE8339023d779f2f85893761729Bb27b97891d](https://goerli.arbiscan.io/address/0x71bE8339023d779f2f85893761729Bb27b97891d)

## Celo Alfajores
- [0x9c2D86d00aFDe6e616CADfBc0fe2D47C1d22b1c8](https://alfajores.celoscan.io/address/0x9c2D86d00aFDe6e616CADfBc0fe2D47C1d22b1c8)
- [0xeEDB0e8e589F9ADf6768fc006BaA1C6462f5e563](https://alfajores.celoscan.io/address/0xeEDB0e8e589F9ADf6768fc006BaA1C6462f5e563)
- [0x000047203100A45635029eC21bbBec5EC53Cb6f6](https://alfajores.celoscan.io/address/0x000047203100A45635029eC21bbBec5EC53Cb6f6)

## Celo
- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://explorer.celo.org/mainnet/address/0xb41169Cc124298Be20e2Ca956cC46E266ab5E203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://explorer.celo.org/mainnet/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xA82d7ED01c31DD2A46681D18E3E213C9E9231605](https://explorer.celo.org/mainnet/address/0xA82d7ED01c31DD2A46681D18E3E213C9E9231605)

## Optimism
- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://optimistic.etherscan.io/address/0xb41169cc124298be20e2ca956cc46e266ab5e203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://optimistic.etherscan.io/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xA82d7ED01c31DD2A46681D18E3E213C9E9231605](https://optimistic.etherscan.io/address/0xA82d7ED01c31DD2A46681D18E3E213C9E9231605)

## Arbitrum
- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://arbiscan.io/address/0xb41169Cc124298Be20e2Ca956cC46E266ab5E203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://arbiscan.io/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xa82d7ed01c31dd2a46681d18e3e213c9e9231605](https://arbiscan.io/address/0xa82d7ed01c31dd2a46681d18e3e213c9e9231605)

## Binance Smart Chain
- [0xb41169Cc124298Be20e2Ca956cC46E266ab5E203](https://bscscan.com/address/0xb41169Cc124298Be20e2Ca956cC46E266ab5E203)
- [0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20](https://bscscan.com/address/0xC61da7Db4981c8839b51B32d4c83cCdf47ca0b20)
- [0xA82d7ED01c31DD2A46681D18E3E213C9E9231605](https://bscscan.com/address/0xA82d7ED01c31DD2A46681D18E3E213C9E9231605)

# Foundry Addition

Follow the steps in these resources if you get stuck:
- Getting started: https://book.getfoundry.sh/getting-started/installation
- Internal foundry template directory: https://github.com/tokensoft/foundry

Examples
- Deploying contracts: `forge create --rpc-url arbitrum --private-key <your ethereum private key> --verify --etherscan-api-key <your api key> contracts/claim/factory/ContinuousVestingMerkleDistributor.sol:ContinuousVestingMerkleDistributor`
- Verifying contracts: `forge verify-contract <contract address> contracts/claim/factory/ContinuousVestingMerkleDistributorFactory.sol:ContinuousVestingMerkleDistributorFactory --constructor-args "00000000000000000000000081bA49a32491669851431ea0CCEdA767b1005db6" --etherscan-api-key <your api key> --optimizer-runs=100`

# 🏗 Scaffold-ETH 2

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

## Contents

- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Deploying your Smart Contracts to a Live Network](#deploying-your-smart-contracts-to-a-live-network)
- [Deploying your NextJS App](#deploying-your-nextjs-app)
  - [Scaffold App Configuration](#scaffold-app-configuration)
- [Interacting with your Smart Contracts: SE-2 Custom Hooks](#interacting-with-your-smart-contracts-se-2-custom-hooks)
- [Disabling Type & Linting Error Checks](#disabling-type-and-linting-error-checks)
  - [Disabling commit checks](#disabling-commit-checks)
  - [Deploying to Vercel without any checks](#deploying-to-vercel-without-any-checks)
  - [Disabling Github Workflow](#disabling-github-workflow)
- [Contributing to Scaffold-ETH 2](#contributing-to-scaffold-eth-2)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the contract component or the example ui in the frontend. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Deploying your Smart Contracts to a Live Network

Once you are ready to deploy your smart contracts, there are a few things you need to adjust.

1. Select the network

By default, `yarn deploy` will deploy the contract to the local network. You can change the defaultNetwork in `packages/hardhat/hardhat.config.ts.` You could also simply run `yarn deploy --network target_network` to deploy to another network.

Check the `hardhat.config.ts` for the networks that are pre-configured. You can also add other network settings to the `hardhat.config.ts` file. Here are the [Alchemy docs](https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask) for information on specific networks.

Example: To deploy the contract to the Sepolia network, run the command below:

```
yarn deploy --network sepolia
```

2. Generate a new account or add one to deploy the contract(s) from. Additionally you will need to add your Alchemy API key. Rename `.env.example` to `.env` and fill the required keys.

```
ALCHEMY_API_KEY="",
DEPLOYER_PRIVATE_KEY=""
```

The deployer account is the account that will deploy your contracts. Additionally, the deployer account will be used to execute any function calls that are part of your deployment script.

You can generate a random account / private key with `yarn generate` or add the private key of your crypto wallet. `yarn generate` will create a random account and add the DEPLOYER_PRIVATE_KEY to the .env file. You can check the generated account with `yarn account`.

3. Deploy your smart contract(s)

Run the command below to deploy the smart contract to the target network. Make sure to have some funds in your deployer account to pay for the transaction.

```
yarn deploy --network network_name
```

4. Verify your smart contract

You can verify your smart contract on Etherscan by running:

```
yarn verify --network network_name
```

## Deploying your NextJS App

**Hint**: We recommend connecting your GitHub repo to Vercel (through the Vercel UI) so it gets automatically deployed when pushing to `main`.

If you want to deploy directly from the CLI, run `yarn vercel` and follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

**Make sure to check the values of your Scaffold Configuration before deploying your NextJS App.**

### Scaffold App Configuration

You can configure different settings for your dapp at `packages/nextjs/scaffold.config.ts`.

```ts
export type ScaffoldConfig = {
  targetNetwork: chains.Chain;
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
  // your dapp custom config, eg:
  // tokenIcon : string;
};
```

The configuration parameters are described below, make sure to update the values according to your needs:

- **targetNetwork**
  Sets the blockchain network where your dapp is deployed. Use values from `wagmi/chains`.

- **pollingInterval**
  The interval in milliseconds at which your front-end application polls the RPC servers for fresh data. _Note that this setting does not affect the local network._

- **alchemyApiKey**
  Default Alchemy API key from Scaffold ETH 2 for local testing purposes.
  It's recommended to obtain your own API key from the [Alchemy Dashboard](https://dashboard.alchemyapi.io/) and store it in an environment variable: `NEXT_PUBLIC_ALCHEMY_API_KEY` at `\packages\nextjs\.env.local` file.

- **walletConnectProjectId**
  WalletConnect's default project ID from Scaffold ETH 2 for local testing purposes.
  It's recommended to obtain your own project ID from the [WalletConnect website](https://cloud.walletconnect.com) and store it in an environment variable: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` at `\packages\nextjs\.env.local` file.

- **onlyLocalBurnerWallet**
  Controls the networks where the Burner Wallet feature is available. This feature provides a lightweight wallet for users.

  - `true` => Use Burner Wallet only on hardhat network.
  - `false` => Use Burner Wallet on all networks.

- **walletAutoConnect**
  Set it to `true` to activate automatic wallet connection behavior:
  - If the user was connected into a wallet before, on page reload it reconnects automatically.
  - If user is not connected to any wallet, on reload, it connects to the burner wallet if it is enabled for the current network. See `onlyLocalBurnerWallet`

You can extend this configuration file, adding new parameters that you need to use across your dapp **(make sure you update the above type `ScaffoldConfig`)**:

```ts
  tokenIcon: "💎",
```

To use the values from the `ScaffoldConfig` in any other file of your application, you first need to import it in those files:

```ts
import scaffoldConfig from "~~/scaffold.config";
```

## Interacting with your Smart Contracts: SE-2 Custom Hooks

Scaffold-ETH 2 provides a collection of custom React hooks designed to simplify interactions with your deployed smart contracts. These hooks are wrappers around `wagmi`, automatically loading the necessary contract ABI and address. They offer an easy-to-use interface for reading from, writing to, and monitoring events emitted by your smart contracts.

To help developers get started with smart contract interaction using Scaffold-ETH 2, we've provided the following custom hooks:

- [useScaffoldContractRead](#usescaffoldcontractread): for reading public variables and getting data from read-only functions of your contract.
- [useScaffoldContractWrite](#usescaffoldcontractwrite): for sending transactions to your contract to write data or perform an action.
- [useScaffoldEventSubscriber](#usescaffoldeventsubscriber): for subscribing to your contract events and receiving real-time updates when events are emitted.
- [useScaffoldEventHistory](#usescaffoldeventhistory): for retrieving historical event logs for your contract, providing past activity data.
- [useDeployedContractInfo](#usedeployedcontractinfo): for fetching details from your contract, including the ABI and address.
- [useScaffoldContract](#usescaffoldcontract): for obtaining a contract instance that lets you interact with the methods of your deployed smart contract.

These hooks offer a simplified and streamlined interface for interacting with your smart contracts. If you need to interact with external contracts, you can use `wagmi` directly, or add external contract data to your `deployedContracts.ts` file.

### useScaffoldContractRead:

Use this hook to read public variables and get data from read-only functions of your smart contract.

```ts
const { data: totalCounter } = useScaffoldContractRead({
  contractName: "YourContract",
  functionName: "getGreeting",
  args: ["ARGUMENTS IF THE FUNCTION ACCEPTS ANY"],
});
```

This example retrieves the data returned by the `getGreeting` function of the `YourContract` smart contract. If the function accepts any arguments, they can be passed in the args array. The retrieved data is stored in the `data` property of the returned object.

### useScaffoldContractWrite:

Use this hook to send a transaction to your smart contract to write data or perform an action.

```ts
const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  contractName: "YourContract",
  functionName: "setGreeting",
  args: ["The value to set"],
  // For payable functions, expressed in ETH
  value: "0.01",
  // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
  blockConfirmations: 1,
  // The callback function to execute when the transaction is confirmed.
  onBlockConfirmation: (txnReceipt) => {
    console.log("Transaction blockHash", txnReceipt.blockHash);
  },
});
```

To send the transaction, you can call the `writeAsync` function returned by the hook. Here's an example usage:

```ts
<button className="btn btn-primary" onClick={() => writeAsync()}>
  Send TX
</button>
```

This example sends a transaction to the `YourContract` smart contract to call the `setGreeting` function with the arguments passed in `args`. The `writeAsync` function sends the transaction to the smart contract, and the `isLoading` and `isMining` properties indicate whether the transaction is currently being processed by the network.

### useScaffoldEventSubscriber:

Use this hook to subscribe to events emitted by your smart contract, and receive real-time updates when these events are emitted.

```ts
useScaffoldEventSubscriber({
  contractName: "YourContract",
  eventName: "GreetingChange",
  // The listener function is called whenever a GreetingChange event is emitted by the contract.
  // It receives the parameters emitted by the event, for this example: GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
  listener: (greetingSetter, newGreeting, premium, value) => {
    console.log(greetingSetter, newGreeting, premium, value);
  },
});
```

This example subscribes to the `GreetingChange` event emitted by the `YourContract` smart contract, and logs the parameters emitted by the event to the console whenever it is emitted. The `listener` function accepts the parameters emitted by the event, and can be customized according to your needs.

### useScaffoldEventHistory:

Use this hook to retrieve historical event logs for your smart contract, providing past activity data.

```ts
const {
  data: events,
  isLoading: isLoadingEvents,
  error: errorReadingEvents,
  } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "GreetingChange",
  // Specify the starting block number from which to read events, this is a bigint.
  fromBlock: 31231n,
  blockData: true,
  // Apply filters to the event based on parameter names and values { [parameterName]: value },
  filters: { premium: true }
  // If set to true it will return the transaction data for each event (default: false),
  transactionData: true,
  // If set to true it will return the receipt data for each event (default: false),
  receiptData: true
});
```

This example retrieves the historical event logs for the `GreetingChange` event of the `YourContract` smart contract, starting from block number 31231 and filtering events where the premium parameter is true. The data property of the returned object contains an array of event objects, each containing the event parameters and (optionally) the block, transaction, and receipt data. The `isLoading` property indicates whether the event logs are currently being fetched, and the `error` property contains any error that occurred during the fetching process (if applicable).

### useDeployedContractInfo:

Use this hook to fetch details about a deployed smart contract, including the ABI and address.

```ts
// ContractName: name of the deployed contract
const { data: deployedContractData } = useDeployedContractInfo(contractName);
```

This example retrieves the details of the deployed contract with the specified name and stores the details in the deployedContractData object.

### useScaffoldContract:

Use this hook to get your contract instance by providing the contract name. It enables you interact with your contract methods.
For reading data or sending transactions, it's recommended to use `useScaffoldContractRead` and `useScaffoldContractWrite`.

```ts
const { data: yourContract } = useScaffoldContract({
  contractName: "YourContract",
});
// Returns the greeting and can be called in any function, unlike useScaffoldContractRead
await yourContract?.read.greeting();

// Used to write to a contract and can be called in any function
import { useWalletClient } from "wagmi";

const { data: walletClient } = useWalletClient();
const { data: yourContract } = useScaffoldContract({
  contractName: "YourContract",
  walletClient,
});
const setGreeting = async () => {
  // Call the method in any function
  await yourContract?.write.setGreeting(["the greeting here"]);
};
```

This example uses the `useScaffoldContract` hook to obtain a contract instance for the `YourContract` smart contract. The data property of the returned object contains the contract instance that can be used to call any of the smart contract methods.

## Disabling type and linting error checks

> **Hint**
> Typescript helps you catch errors at compile time, which can save time and improve code quality, but can be challenging for those who are new to the language or who are used to the more dynamic nature of JavaScript. Below are the steps to disable type & lint check at different levels

### Disabling commit checks

We run `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which lints the staged files and don't let you commit if there is an linting error.

To disable this, go to `.husky/pre-commit` file and comment out `yarn lint-staged --verbose`

```diff
- yarn lint-staged --verbose
+ # yarn lint-staged --verbose
```

### Deploying to Vercel without any checks

By default, Vercel runs types and lint checks before building your app. The deployment will fail if there are any types or lint errors.

To ignore these checks while deploying from the CLI, use:

```shell
yarn vercel:yolo
```

If your repo is connected to Vercel, you can set `NEXT_PUBLIC_IGNORE_BUILD_ERROR` to `true` in a [environment variable](https://vercel.com/docs/concepts/projects/environment-variables).

### Disabling Github Workflow

We have github workflow setup checkout `.github/workflows/lint.yaml` which runs types and lint error checks every time code is **pushed** to `main` branch or **pull request** is made to `main` branch

To disable it, **delete `.github` directory**

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2. -->
