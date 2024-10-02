import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { vars } from "hardhat/config";

// TODO: Figure out whether to use this or FlatPriceSaleFactoryV3Module.ts
//    which does a similar task.
export default buildModule("DeployFlatPriceSaleFactory_v_3Module", m => {
  // TODO: Update this with grabbing it from the parameters file.
  const args = [vars.get("NETWORK_CONFIG_FEE_RECIPIENT", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")];

  const networkConfig = m.contract("NetworkConfig");
  m.call(networkConfig, "initialize", args);

  const flatPriceSale_v_3 = m.contract("FlatPriceSale_v_3", [networkConfig]);
  const flatPriceSaleFactory_v_3 = m.contract("FlatPriceSaleFactory_v_3", [flatPriceSale_v_3]);

  return { networkConfig, flatPriceSale_v_3, flatPriceSaleFactory_v_3 };
});
