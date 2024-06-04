import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { GenericERC20, StakingContract } from "../../typechain-types";
import StakingContractDefinition from '../../artifacts/contracts/claim/Staking.sol/StakingContract.json'
import { ethers } from 'hardhat';

jest.setTimeout(30000);

type StakingConfig = {
  softTokenAddress: string;
  softMfersContractAddress: string;
  stakingContractAddress: string;
};

let deployer: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let softToken: GenericERC20;
let stakingContract: StakingContract;
let softMfersContract: GenericERC20;

// staking config
const config: StakingConfig = {
  softTokenAddress: "0xb170aE616bB78Ea5f1CC04b7c6c5931b1db7723b",
  softMfersContractAddress: "0x9bb3270be42b56117a14cae88c63415420913e53",
  stakingContractAddress: "0x667805DFb4BE4324B41FBF445EFc58eE70b98409",
};

describe("StakingContract", function () {
  beforeAll(async () => {
    [deployer, user1, user2] = await ethers.getSigners();

    softToken = await ethers.getContractAt("GenericERC20", config.softTokenAddress);
    softMfersContract = await ethers.getContractAt("GenericERC20", config.softMfersContractAddress);
    stakingContract = await ethers.getContractAt("StakingContract", config.stakingContractAddress);
  });

  it("should allow users to stake tokens", async () => {
    // const stakeAmount = ethers.parseEther("1000");
    // await softToken.connect(user1).approve(config.stakingContractAddress, stakeAmount);
    // await stakingContract.connect(user1).stake(stakeAmount, config.softTokenAddress);

    // expect(await stakingContract.stakedTokens(user1.address)).toEqual(stakeAmount);
  });

  it("should allow users to unstake tokens", async () => {
    // const stakeAmount = ethers.parseEther("1000");
    // await stakingContract.connect(user1).unstake(stakeAmount, config.softTokenAddress);

    // expect(await softToken.balanceOf(user1.address)).toEqual(stakeAmount);
    // expect(await stakingContract.stakedTokens(user1.address)).toEqual(0);
  });

});