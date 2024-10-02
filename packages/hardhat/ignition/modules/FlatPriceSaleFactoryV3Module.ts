import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import NetworkConfigModule from "./NetworkConfigModule";

export default buildModule("FlatPriceSaleFactoryV3Module", m => {
  const { networkConfig } = m.useModule(NetworkConfigModule);

  const flatPriceSale_v_3 = m.contract("FlatPriceSale_v_3", [networkConfig]);
  const flatPriceSaleFactory_v_3 = m.contract("FlatPriceSaleFactory_v_3", [flatPriceSale_v_3]);

  return { networkConfig, flatPriceSale_v_3, flatPriceSaleFactory_v_3 };
});
