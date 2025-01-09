import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import DeployGenericERC20Module from "./Deploy_GenericERC20";
import FlatPriceSaleFactoryV2Module from "./FlatPriceSaleFactoryV2Module";
import FlatPriceSaleFactoryV3Module from "./FlatPriceSaleFactoryV3Module";
import FlatPriceSaleFactoryV4Module from "./FlatPriceSaleFactoryV4Module";
import InitializeNetworkConfigModule from "./InitializeNetworkConfigModule";
import SuiteDistributorFactoryV3Module from "./SuiteDistributorFactoryV3Module";
import SuiteDistributorFactoryV4Module from "./SuiteDistributorFactoryV4Module";
import SuiteDistributorFactoryV5Module from "./SuiteDistributorFactoryV5Module";

export default buildModule("LocalDevDeploymentModule", m => {
  const GenericERC20 = m.useModule(DeployGenericERC20Module);
  const flatPriceSaleFactoryV2Module = m.useModule(FlatPriceSaleFactoryV2Module);
  const flatPriceSaleFactoryV3Module = m.useModule(FlatPriceSaleFactoryV3Module);
  const flatPriceSaleFactoryV4Module = m.useModule(FlatPriceSaleFactoryV4Module);
  const initializeNetworkConfigModule = m.useModule(InitializeNetworkConfigModule);
  const suiteDistributorFactoryV3Module = m.useModule(SuiteDistributorFactoryV3Module);
  const suiteDistributorFactoryV4Module = m.useModule(SuiteDistributorFactoryV4Module);
  const suiteDistributorFactoryV5Module = m.useModule(SuiteDistributorFactoryV5Module);

  return {
    ...GenericERC20,
    ...flatPriceSaleFactoryV2Module,
    ...flatPriceSaleFactoryV3Module,
    ...flatPriceSaleFactoryV4Module,
    ...initializeNetworkConfigModule,
    ...suiteDistributorFactoryV3Module,
    ...suiteDistributorFactoryV4Module,
    ...suiteDistributorFactoryV5Module,
  };
});
