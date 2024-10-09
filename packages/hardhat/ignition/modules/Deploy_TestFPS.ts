import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployTestFPSModule = buildModule("DeployTestFlatPriceSaleModule", m => {
  const testFPS = m.contract("Test_FlatPriceSale", []);

  return { testFPS };
});

export default DeployTestFPSModule;
