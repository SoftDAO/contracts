import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployStakingContractModule = buildModule(
  "DeployStakingContractModule",
  (m) => {
    // on base network
    const softTokenAddress = m.getParameter("softTokenAddress", "0x04D1963C76EB1BEc59d0eEb249Ed86F736B82993");

    // set this later
    const softMfersAddress = m.getParameter("softMfersAddress", "0x0000000000000000000000000000000000000000");

    // base network ledger wallet
    const owner = m.getParameter("owner", "0x510898f396B2FB1d7E82f233C0224b641075B08d")

    const stakingContract = m.contract("StakingContract", [
      softTokenAddress,
      softMfersAddress,
      owner
    ]);
    


    return { stakingContract };
  }
);

export default DeployStakingContractModule;
