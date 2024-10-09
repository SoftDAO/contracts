import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ExecuteNewSaleModule", m => {
  const deployer = m.getAccount(0);
  // const recipient = m.getAccount(1);

  //  UPDATE VARIABLES
  const currentNetwork = "baseSepolia";
  const currentFPSFVersion: string = "v4";
  const currentConfigVersion: keyof typeof configsDatabase = "v1";
  const currentArgsVersion: keyof typeof argsDatabase = "v3";

  const addressesDatabase = {
    mainnet: {
      ethOracleAddress: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
      usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      usdcOracleAddress: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      flatPriceSaleFactoryAddress: {},
    },
    sepolia: {
      ethOracleAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      usdcOracleAddress: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
      flatPriceSaleFactoryAddress: {
        v2: "",
        "v2.1": "0xaffd5144511fdb139e06733a7413c95a80a9c2ce",
        v3: "",
        v4: "",
      },
    },
    baseSepolia: {
      ethOracleAddress: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
      usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      usdcOracleAddress: "0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165",
      flatPriceSaleFactoryAddress: {
        v2: "",
        "v2.1": "0x934b7D8aAf0ab08cf8dbc45839C867038BC73487",
        v3: "",
        unknown: "0xe085d549c972555b0DD37f01869F235A5Cd0B720",
        v4: "0x22d2e721Da20FE25bB37c12eD0D3aC0BD1784362",
      },
    },
  };

  const configsDatabase = {
    v1: {
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
    },
  };

  const argsDatabase = {
    v2: [
      // the owner of the new sale (can later modify the sale)
      deployer,
      // the sale configuration
      configsDatabase[currentConfigVersion],
      // base currency
      "USD",
      // native payments enabled
      true,
      // native price oracle
      addressesDatabase[currentNetwork].ethOracleAddress,
      // payment tokens
      [addressesDatabase[currentNetwork].usdcAddress],
      // payment token price oracles
      [addressesDatabase[currentNetwork].usdcOracleAddress],
      // payment token decimals
      [6],
    ],
    v3: [
      // the owner of the new sale (can later modify the sale)
      deployer,
      // the sale configuration
      configsDatabase[currentConfigVersion],
      // base currency
      "USD",
      // native payments enabled
      true,
      // native price oracle
      addressesDatabase[currentNetwork].ethOracleAddress,
      // native price oracle heartbeat
      36000,
      // payment tokens
      [addressesDatabase[currentNetwork].usdcAddress],
      // payment token price oracles
      [addressesDatabase[currentNetwork].usdcOracleAddress],
      // payment token price oracle heartbeats
      [36000],
      // payment token decimals
      [6],
    ],
  };

  let flatPriceSaleFactory;
  const args = argsDatabase[currentArgsVersion];
  if (currentFPSFVersion == "v2") {
    flatPriceSaleFactory = m.contractAt(
      "FlatPriceSaleFactory_v_2_1",
      addressesDatabase[currentNetwork].flatPriceSaleFactoryAddress.v2,
    );
  } else if (currentFPSFVersion == "v3") {
    flatPriceSaleFactory = m.contractAt(
      "FlatPriceSaleFactory_v_3",
      addressesDatabase[currentNetwork].flatPriceSaleFactoryAddress.v3,
    );
  } else if (currentFPSFVersion == "v4") {
    flatPriceSaleFactory = m.contractAt(
      "FlatPriceSaleFactory_v_4_0",
      addressesDatabase[currentNetwork].flatPriceSaleFactoryAddress.v4,
    );
  } else {
    throw new Error(`Invalid version: ${currentFPSFVersion}`);
  }

  m.call(flatPriceSaleFactory, "newSale", args);

  return {};
});
