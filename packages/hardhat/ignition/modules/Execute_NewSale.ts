import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { merkleRoots } from "../../config/index";

export default buildModule("ExecuteNewSaleModule", m => {
  const deployer = m.getAccount(0);
  const recipient = m.getAccount(1);
  const ethOracleAddress = "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD";
  const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  const usdcOracleAddress = "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6";
  const FlatPriceSaleFactoryAddress = "0xaffd5144511fdb139e06733a7413c95a80a9c2ce";

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

  const flatPriceSaleFactory_v_2_1 = m.contractAt("FlatPriceSaleFactory_v_2_1", FlatPriceSaleFactoryAddress);

  m.call(flatPriceSaleFactory_v_2_1, "newSale", [
    // the owner of the new sale (can later modify the sale)
    deployer,
    // the sale configuration
    config,
    // base currency
    "USD",
    // native payments enabled
    true,
    // native price oracle
    ethOracleAddress,
    // payment tokens
    [usdcAddress],
    // payment token price oracles
    [usdcOracleAddress],
    // payment token decimals
    [6],
  ]);

  return {};
});
