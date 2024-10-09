import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// import SuiteDistributorFactoryV4Module from "./SuiteDistributorFactoryV4Module";
import FlatPriceSaleFactoryV4Module from "./FlatPriceSaleFactoryV4Module";
import InitializeNetworkConfigModule from "./InitializeNetworkConfigModule";

/*
  Update these variables in the ../parameters/ folder prior to running this module:
    - NETWORK_CONFIG_PROXY_ADMIN
    - NETWORK_CONFIG_FEE_RECIPIENT
    - NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS
    - NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT
    - NETWORK_CONFIG_ACCESS_AUTHORITY_ADDRESS
*/

export default buildModule("Oct6SuiteModule", m => {
  // const suiteDistributorFactoryModule = m.useModule(SuiteDistributorFactoryV4Module);
  const flatPriceSaleFactoryV4Module = m.useModule(FlatPriceSaleFactoryV4Module);
  const initializeNetworkConfigModule = m.useModule(InitializeNetworkConfigModule);

  return {
    // ...suiteDistributorFactoryModule,
    ...flatPriceSaleFactoryV4Module,
    ...initializeNetworkConfigModule,
  };
});
