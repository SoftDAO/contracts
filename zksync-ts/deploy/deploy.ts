import { Addressable, ethers } from "ethers";
import { deployContract, getWallet } from "./utils";
import * as hre from "hardhat";

async function deployNetworkConfig() {
  const networkConfigContractArtifactName = "NetworkConfig";
  const networkConfig = await deployContract(
    networkConfigContractArtifactName,
    []
  );
  console.log("NetworkConfig deployed to:", networkConfig.target);

  return networkConfig.target;
}

async function deployFeeLevelJudgeStub() {
  const feeLevelJudgeStubContractArtifactName = "FeeLevelJudgeStub";
  const feeLevelJudgeStub = await deployContract(
    feeLevelJudgeStubContractArtifactName,
    [100]
  );
  console.log("FeeLevelJudgeStub deployed to:", feeLevelJudgeStub.target);

  return feeLevelJudgeStub.target;
}

async function initializeNetworkConfig(
  deployedContracts: Record<string, string | Addressable>
) {
  const networkConfigAddress = deployedContracts.networkConfig;
  const feeLevelJudgeStubAddress = deployedContracts.feeLevelJudgeStub;

  const feeRecipient = process.env.NETWORK_CONFIG_FEE_RECIPIENT;
  const nativeTokenPriceOracleAddress =
    process.env.NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS;
  const nativeTokenPriceOracleHeartbeat =
    process.env.NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT;
  const accessAuthorityAddress =
    process.env.NETWORK_CONFIG_ACCESS_AUTHORITY_ADDRESS;

  if (
    !feeRecipient ||
    !nativeTokenPriceOracleAddress ||
    !nativeTokenPriceOracleHeartbeat ||
    !accessAuthorityAddress
  ) {
    throw new Error(
      "Missing required environment variables for NetworkConfig initialization"
    );
  }

  const networkConfigContractArtifact = await hre.artifacts.readArtifact(
    "NetworkConfig"
  );
  // Initialize contract instance for interaction
  const networkConfigContract = new ethers.Contract(
    networkConfigAddress,
    networkConfigContractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  const tx = await networkConfigContract.initialize(
    feeRecipient,
    feeLevelJudgeStubAddress,
    nativeTokenPriceOracleAddress,
    nativeTokenPriceOracleHeartbeat,
    accessAuthorityAddress
  );
  console.log(`Transaction hash of initializing NetworkConfig: ${tx.hash}`);
  await tx.wait();

  console.log("NetworkConfig initialized");
}

async function deployFlatPriceSaleFactoryV4Module(): Promise<
  Record<string, string | Addressable>
> {
  // Deploy NetworkConfig
  const networkConfigAddress = await deployNetworkConfig();

  // Deploy FlatPriceSale_v_4_0
  const flatPriceSaleV4ContractArtifactName = "FlatPriceSale_v_4_0";
  const flatPriceSaleV4ConstructorArguments = [networkConfigAddress];
  const flatPriceSaleV4 = await deployContract(
    flatPriceSaleV4ContractArtifactName,
    flatPriceSaleV4ConstructorArguments
  );
  console.log("FlatPriceSale_v_4_0 deployed to:", flatPriceSaleV4.target);

  // Deploy FlatPriceSaleFactory_v_4_0
  const flatPriceSaleFactoryV4ContractArtifactName =
    "FlatPriceSaleFactory_v_4_0";
  const flatPriceSaleFactoryV4ConstructorArguments = [flatPriceSaleV4.target];
  const flatPriceSaleFactoryV4 = await deployContract(
    flatPriceSaleFactoryV4ContractArtifactName,
    flatPriceSaleFactoryV4ConstructorArguments
  );
  console.log(
    "FlatPriceSaleFactory_v_4_0 deployed to:",
    flatPriceSaleFactoryV4.target
  );

  return {
    networkConfig: networkConfigAddress,
    flatPriceSaleV4: flatPriceSaleV4.target,
    flatPriceSaleFactoryV4: flatPriceSaleFactoryV4.target
  };
}

async function initializeNetworkConfigModule(
  deployedContracts: Record<string, string | Addressable>
) {
  // Deploy FeeLevelJudgeStub
  const feeLevelJudgeStubAddress = await deployFeeLevelJudgeStub();

  // Initialize NetworkConfig
  await initializeNetworkConfig({
    networkConfig: deployedContracts.networkConfig,
    feeLevelJudgeStub: feeLevelJudgeStubAddress
  });

  return {
    feeLevelJudgeStub: feeLevelJudgeStubAddress
  };
}

// Deploys and verifies the contracts.
export default async function () {
  // Deploy FlatPriceSaleFactoryV4 contracts
  const deployedFlatPriceSaleFactoryV4Module =
    await deployFlatPriceSaleFactoryV4Module();
  console.log(
    "Deployed FlatPriceSaleFactoryV4Module contracts:",
    deployedFlatPriceSaleFactoryV4Module
  );

  // Initialize NetworkConfigModule
  const initializedNetworkConfigModule = await initializeNetworkConfigModule(
    deployedFlatPriceSaleFactoryV4Module
  );
  console.log(
    "Initialized NetworkConfigModule contracts:",
    initializedNetworkConfigModule
  );
}
