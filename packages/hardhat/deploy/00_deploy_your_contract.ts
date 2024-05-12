import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployStakingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const softTokenAddress = (await hre.deployments.get("SoftToken")).address;

  await deploy("StakingContract", {
    from: deployer,
    args: [softTokenAddress],
    log: true,
    autoMine: true,
  });

  const stakingContract = await hre.ethers.getContract<Contract>(
    "StakingContract",
    deployer,
  );

  console.log("Staking Contract deployed at:", stakingContract.address);
};

export default deployStakingContract;

deployStakingContract.tags = ["StakingContract"];