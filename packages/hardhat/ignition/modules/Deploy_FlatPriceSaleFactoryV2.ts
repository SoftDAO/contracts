import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployFlatPriceSaleFactoryV2_v_2_1Module", m => {
  const args = [0, "0x0000000000000000000000000000000000000000"];

  const flatPriceSale_v_2_1 = m.contract("FlatPriceSale_v_2_1", args);
  const flatPriceSaleFactoryV2_v_2_1 = m.contract("FlatPriceSaleFactoryV2_v_2_1", [flatPriceSale_v_2_1]);

  return { flatPriceSale_v_2_1, flatPriceSaleFactoryV2_v_2_1 };
});
