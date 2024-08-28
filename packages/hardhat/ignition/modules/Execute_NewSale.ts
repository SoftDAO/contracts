import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { merkleRoots } from "../../config/index";

export default buildModule("ExecuteNewSaleModule", m => {
  const deployer = m.getAccount(0);
  const recipient = m.getAccount(1);

  /** Mainnet */
  // const ethOracleAddress = "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD";
  // const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  // const usdcOracleAddress = "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6";
  // const FlatPriceSaleFactoryAddress = "0xaffd5144511fdb139e06733a7413c95a80a9c2ce";

  /** Base Sepolia */
  const baseSepolia_ethOracleAddress = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
  const baseSepolia_usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const baseSepolia_usdcOracleAddress = "0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165";
  const baseSepolia_FlatPriceSaleFactoryAddress = "0xAE085C6c5F2208C1959c0DB8515370fA54840A4b";

  const config = {
    // recipient of sale proceeds
    recipient: recipient,
    // merkle root determining sale access
    merkleRoot: merkleRoots.public,
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
    URI: "https://example.com",
  };

  const flatPriceSaleFactory_v_3 = m.contractAt("FlatPriceSaleFactory_v_3", baseSepolia_FlatPriceSaleFactoryAddress);

  m.call(flatPriceSaleFactory_v_3, "newSale", [
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
  ]);

  return {};
});
