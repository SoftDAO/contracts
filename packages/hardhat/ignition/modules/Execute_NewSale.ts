import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ExecuteNewSaleModule", m => {
  const deployer = m.getAccount(0);
  // const recipient = m.getAccount(1);

  /** ETHEREUM MAINNET */
  // const ethOracleAddress = "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD";
  // const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  // const usdcOracleAddress = "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6";
  // const FlatPriceSaleFactoryAddress = "0xaffd5144511fdb139e06733a7413c95a80a9c2ce";

  /** BASE SEPOLIA */
  const baseSepolia_ethOracleAddress = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
  const baseSepolia_usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const baseSepolia_usdcOracleAddress = "0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165";
  const baseSepolia_FlatPriceSaleFactoryAddress_v2 = "0x934b7D8aAf0ab08cf8dbc45839C867038BC73487";
  const baseSepolia_FlatPriceSaleFactoryAddress_v3 = "0xe085d549c972555b0DD37f01869F235A5Cd0B720";

  /**
   * UPDATE VARIABLES
   */
  // const networkChosen = "baseSepolia";
  const versionChosen: string = "v3";
  /**
   *
   */

  const config = {
    // recipient of sale proceeds
    recipient: deployer,
    // merkle root determining sale access
    merkleRoot: "0x38e08c198f919ebfa9a16d4e54821b360241e6a43aac9e9845dfcd3f85153433",
    // sale maximum ($1,000,000) - note the 8 decimal precision!
    saleMaximum: 10000000000,
    // user maximum ($1,000)
    userMaximum: 2000000000,
    // purchase minimum ($1)
    purchaseMinimum: 1000000000,
    // start time: now
    startTime: Math.floor(new Date().getTime() / 1000),
    // end time (10 days from now)
    endTime: Math.floor(new Date(new Date().getTime() + 10 * 24 * 3600 * 1000).getTime() / 1000),
    // max fair queue time 1 hour
    maxQueueTime: 0,
    // information about the sale
    URI: "ipfs://QmZPtoVLFC8HBzEcJ6hoUsXuaQGF5bdQPr7LeQcSFkNMbA",
  };

  const argsForV2 = [
    // the owner of the new sale (can later modify the sale)
    deployer,
    // the sale configuration
    config,
    // base currency
    "USD",
    // native payments enabled
    true,
    // native price oracle
    baseSepolia_ethOracleAddress,
    // payment tokens
    [baseSepolia_usdcAddress],
    // payment token price oracles
    [baseSepolia_usdcOracleAddress],
    // payment token decimals
    [6],
  ];

  const argsForV3 = [
    // the owner of the new sale (can later modify the sale)
    deployer,
    // the sale configuration
    config,
    // base currency
    "USD",
    // native payments enabled
    true,
    // native price oracle
    baseSepolia_ethOracleAddress,
    // native price oracle heartbeat
    360000,
    // payment tokens
    [baseSepolia_usdcAddress],
    // payment token price oracles
    [baseSepolia_usdcOracleAddress],
    // payment token price oracle heartbeats
    [360000],
    // payment token decimals
    [6],
  ];

  let flatPriceSaleFactory;
  let args;
  if (versionChosen == "v2") {
    flatPriceSaleFactory = m.contractAt("FlatPriceSaleFactory_v_2_1", baseSepolia_FlatPriceSaleFactoryAddress_v2);
    args = argsForV2;
  } else if (versionChosen == "v3") {
    flatPriceSaleFactory = m.contractAt("FlatPriceSaleFactory_v_3", baseSepolia_FlatPriceSaleFactoryAddress_v3);
    args = argsForV3;
  } else {
    throw new Error(`Invalid version: ${versionChosen}`);
  }

  m.call(flatPriceSaleFactory, "newSale", args);

  return {};
});
