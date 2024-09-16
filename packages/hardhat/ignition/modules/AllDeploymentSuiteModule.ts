import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SuiteDistributorFactoryV4Module from "./SuiteDistributorFactoryV4Module";
import FlatPriceSaleFactoryV3Module from "./FlatPriceSaleFactoryV3Module";
import InitializeNetworkConfigModule from "./InitializeNetworkConfigModule";

/*
  Variables you need to set:
    - NETWORK_CONFIG_PROXY_ADMIN
    - NETWORK_CONFIG_FEE_RECIPIENT
    - NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS
    - NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT
  Example:
      npx hardhat vars set NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS 0x6bF14CB0A831078629D993FDeBcB182b21A8774C
*/

export default buildModule("AllDeploymentSuiteModule", m => {
  const suiteDistributorFactoryModule = m.useModule(SuiteDistributorFactoryV4Module);
  const flatPriceSaleFactoryV3Module = m.useModule(FlatPriceSaleFactoryV3Module);
  const initializeNetworkConfigModule = m.useModule(InitializeNetworkConfigModule);

  return {
    ...suiteDistributorFactoryModule,
    ...flatPriceSaleFactoryV3Module,
    ...initializeNetworkConfigModule,
  };
});
