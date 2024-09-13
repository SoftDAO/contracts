import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SuiteDistributorFactoryV5Module", m => {
  const continuousVestingMerkleDistributor_v_5_0 = m.contract("ContinuousVestingMerkleDistributor_v_5_0", []);
  const trancheVestingMerkleDistributor_v_5_0 = m.contract("TrancheVestingMerkleDistributor_v_5_0", []);

  const continuousVestingMerkleDistributorFactory_v_5_0 = m.contract(
    "ContinuousVestingMerkleDistributorFactory_v_5_0",
    [continuousVestingMerkleDistributor_v_5_0],
  );
  const trancheVestingMerkleDistributorFactory_v_5_0 = m.contract("TrancheVestingMerkleDistributorFactory_v_5_0", [
    trancheVestingMerkleDistributor_v_5_0,
  ]);

  return {
    continuousVestingMerkleDistributor_v_5_0,
    trancheVestingMerkleDistributor_v_5_0,
    continuousVestingMerkleDistributorFactory_v_5_0,
    trancheVestingMerkleDistributorFactory_v_5_0,
  };
});
