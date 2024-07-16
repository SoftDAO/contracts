import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployFlatPriceSaleFactory_v_2_1Module", m => {
  const args = [100, "0xC4BFc1Ad6dbB85191867a6E0f9dA2EA1668B5a6F"];

  const flatPriceSale_v_2_1 = m.contract("FlatPriceSale_v_2_1", args);
  const flatPriceSaleFactory_v_2_1 = m.contract("FlatPriceSaleFactory_v_2_1", [flatPriceSale_v_2_1]);

  return { flatPriceSale_v_2_1, flatPriceSaleFactory_v_2_1 };
});
