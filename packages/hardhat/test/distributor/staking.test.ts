import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { GenericERC20, StakingContract, SoftMfersMock } from "../../typechain-types";
import { ethers } from "hardhat";

jest.setTimeout(30000);

let deployer: SignerWithAddress;
let user1: SignerWithAddress;
let stakingContract: StakingContract;
let softMfersContract: SoftMfersMock;
let token: GenericERC20;
let tokenAddress: string;
let softMfersContractAddress: string;
let stakingContractAddress: string;

describe("StakingContract", function () {
  beforeAll(async () => {
    [deployer, user1] = await ethers.getSigners();

    const GenericERC20Factory = await ethers.getContractFactory("GenericERC20", deployer);
    token = (await GenericERC20Factory.deploy(
      "Neue Crypto Token",
      "NCT",
      18,
      // 1B tokens
      (10n ** 9n * 10n ** 18n).toString(),
    )) as GenericERC20;
    tokenAddress = await token.getAddress();
    await token.transfer(user1.address, 500);

    const SoftMfersMockFactory = await ethers.getContractFactory("SoftMfersMock", deployer);
    softMfersContract = await SoftMfersMockFactory.deploy();
    softMfersContractAddress = await softMfersContract.getAddress();

    const StakingContracyFactory = await ethers.getContractFactory("StakingContract", deployer);
    stakingContract = await StakingContracyFactory.deploy(tokenAddress, softMfersContractAddress);
    stakingContractAddress = await stakingContract.getAddress();
  });

  it("should allow users to stake tokens", async () => {
    const stakeAmount = 500;
    await token.connect(user1).approve(stakingContractAddress, stakeAmount);
    await stakingContract.connect(user1).stake(stakeAmount, tokenAddress);

    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(stakeAmount));
  });

  it("should allow users to unstake tokens", async () => {
    const stakeAmount = 500;
    await stakingContract.connect(user1).unstake(stakeAmount, tokenAddress);

    expect(await token.balanceOf(user1.address)).toEqual(BigInt(stakeAmount));
    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(0));
  });
});
