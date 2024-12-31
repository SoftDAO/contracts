import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import DeployGenericERC20Module from "./Deploy_GenericERC20";
import SuiteDistributorFactoryV3Module from "./SuiteDistributorFactoryV3Module";
import SuiteDistributorFactoryV4Module from "./SuiteDistributorFactoryV4Module";
import FlatPriceSaleFactoryV3Module from "./FlatPriceSaleFactoryV3Module";
import FlatPriceSaleFactoryV2Module from "./FlatPriceSaleFactoryV2Module";
import InitializeNetworkConfigModule from "./InitializeNetworkConfigModule";

export default buildModule("LocalDevDeploymentModule", m => {
  const GenericERC20 = m.useModule(DeployGenericERC20Module);
  const suiteDistributorFactoryV3Module = m.useModule(SuiteDistributorFactoryV3Module);
  const suiteDistributorFactoryV4Module = m.useModule(SuiteDistributorFactoryV4Module);
  const flatPriceSaleFactoryV3Module = m.useModule(FlatPriceSaleFactoryV3Module);
  const flatPriceSaleFactoryV2Module = m.useModule(FlatPriceSaleFactoryV2Module);
  const initializeNetworkConfigModule = m.useModule(InitializeNetworkConfigModule);

  return {
    ...GenericERC20,
    ...suiteDistributorFactoryV3Module,
    ...suiteDistributorFactoryV4Module,
    ...flatPriceSaleFactoryV3Module,
    ...flatPriceSaleFactoryV2Module,
    ...initializeNetworkConfigModule,
  };
});
