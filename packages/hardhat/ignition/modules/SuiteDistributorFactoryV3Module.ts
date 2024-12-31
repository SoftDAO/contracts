import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SuiteDistributorFactoryV3Module", m => {
  const continuousVestingMerkleDistributor_v_3_0 = m.contract("ContinuousVestingMerkleDistributor", []);
  const trancheVestingMerkleDistributor_v_3_0 = m.contract("TrancheVestingMerkleDistributor", []);

  const continuousVestingMerkleDistributorFactory_v_3_0 = m.contract(
    "ContinuousVestingMerkleDistributorFactory",
    [continuousVestingMerkleDistributor_v_3_0],
  );
  const trancheVestingMerkleDistributorFactory_v_3_0 = m.contract("TrancheVestingMerkleDistributorFactory", [
    trancheVestingMerkleDistributor_v_3_0,
  ]);

  return {
    continuousVestingMerkleDistributor_v_3_0,
    trancheVestingMerkleDistributor_v_3_0,
    continuousVestingMerkleDistributorFactory_v_3_0,
    trancheVestingMerkleDistributorFactory_v_3_0,
  };
});
