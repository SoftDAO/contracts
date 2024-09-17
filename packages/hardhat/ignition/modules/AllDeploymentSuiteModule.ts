import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SuiteDistributorFactoryV4Module from "./SuiteDistributorFactoryV4Module";
import FlatPriceSaleFactoryV3Module from "./FlatPriceSaleFactoryV3Module";
import InitializeNetworkConfigModule from "./InitializeNetworkConfigModule";

/*
  Variables you need to set:
    - NETWORK_CONFIG_PROXY_ADMIN (0x52c263698B5B11AaCAf0f74333DC921B26FFA5b7)
    - NETWORK_CONFIG_FEE_RECIPIENT (0x52c263698B5B11AaCAf0f74333DC921B26FFA5b7)
    - NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_ADDRESS (0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
    - NETWORK_CONFIG_NATIVE_TOKEN_PRICE_ORACLE_HEARTBEAT (36000)
  Optional:
    - EVM_PRIVATE_KEY_1
  Example:
      npx hardhat vars set EVM_PRIVATE_KEY_1 XXXXXXXXXX
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
