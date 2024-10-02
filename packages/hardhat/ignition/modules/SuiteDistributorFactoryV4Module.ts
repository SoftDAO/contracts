import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SuiteDistributorFactoryV4Module", m => {
  const continuousVestingMerkleDistributor_v_4_0 = m.contract("ContinuousVestingMerkleDistributor_v_4_0", []);
  const trancheVestingMerkleDistributor_v_4_0 = m.contract("TrancheVestingMerkleDistributor_v_4_0", []);

  const continuousVestingMerkleDistributorFactory_v_4_0 = m.contract(
    "ContinuousVestingMerkleDistributorFactory_v_4_0",
    [continuousVestingMerkleDistributor_v_4_0],
  );
  const trancheVestingMerkleDistributorFactory_v_4_0 = m.contract("TrancheVestingMerkleDistributorFactory_v_4_0", [
    trancheVestingMerkleDistributor_v_4_0,
  ]);

  return {
    continuousVestingMerkleDistributor_v_4_0,
    trancheVestingMerkleDistributor_v_4_0,
    continuousVestingMerkleDistributorFactory_v_4_0,
    trancheVestingMerkleDistributorFactory_v_4_0,
  };
});
