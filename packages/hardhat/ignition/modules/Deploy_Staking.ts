import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployStakingContractModule = buildModule(
  "DeployStakingContractModule",
  (m) => {
    const softTokenAddress = m.getParameter("softTokenAddress", "0x7CA877f49Ff29c5464F073c75592315ecBa67282");
    const softMfersAddress = m.getParameter("softMfersAddress", "0x9Bb3270BE42B56117a14CaE88C63415420913E53");

    const stakingContract = m.contract("StakingContract", [
      softTokenAddress,
      softMfersAddress
    ]);
    


    return { stakingContract };
  }
);

export default DeployStakingContractModule;