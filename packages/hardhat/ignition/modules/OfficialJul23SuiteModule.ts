import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import SuiteDistributorFactoryV4Module from "./SuiteDistributorFactoryV4Module";
import FlatPriceSaleFactoryV3Module from "./FlatPriceSaleFactoryV3Module";
import InitializeNetworkConfigModule from "./InitializeNetworkConfigModule";

export default buildModule("OfficialJul23SuiteModule", m => {
  const suiteDistributorFactoryModule = m.useModule(SuiteDistributorFactoryV4Module);
  const flatPriceSaleFactoryV3Module = m.useModule(FlatPriceSaleFactoryV3Module);
  const initializeNetworkConfigModule = m.useModule(InitializeNetworkConfigModule);

  return {
    ...suiteDistributorFactoryModule,
    ...flatPriceSaleFactoryV3Module,
    ...initializeNetworkConfigModule,
  };
});
