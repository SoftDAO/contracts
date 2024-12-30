import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FlatPriceSaleFactoryV2Module", m => {
  const flatPriceSale_v_2_1 = m.contract("FlatPriceSale_v_2_1", [0, "0x0000000000000000000000000000000000000000"]);
  const flatPriceSaleFactory_v_2_1 = m.contract("FlatPriceSaleFactory_v_2_1", [flatPriceSale_v_2_1]);

  return { flatPriceSale_v_2_1, flatPriceSaleFactory_v_2_1 };
});
