import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy SoftToken contract
  // await deploy("ERC20", {
  //   from: deployer,
  //   args: ["SoftToken", "SOFT", 18, ethers.utils.parseEther("1000000")],
  //   log: true,
  //   autoMine: true,
  // });

  // const softToken = await hre.ethers.getContract<Contract>("ERC20", deployer);
  // console.log("SoftToken deployed at:", softToken.address);

  // Deploy StakingContract
  await deploy("StakingContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const stakingContract = await hre.ethers.getContract<Contract>("StakingContract", deployer);
  console.log("Staking Contract deployed at:", stakingContract.address);
};

export default deployContracts;
deployContracts.tags = ["StakingContract"];