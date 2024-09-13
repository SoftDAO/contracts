import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import NetworkConfigModule from "./NetworkConfigModule";

export default buildModule("FlatPriceSaleFactoryV4Module", m => {
  const { networkConfig } = m.useModule(NetworkConfigModule);

  const flatPriceSale_v_4_0 = m.contract("FlatPriceSale_v_4_0", [networkConfig]);
  const flatPriceSaleFactory_v_4_0 = m.contract("FlatPriceSaleFactory_v_4_0", [flatPriceSale_v_4_0]);

  return { networkConfig, flatPriceSale_v_4_0, flatPriceSaleFactory_v_4_0 };
});
