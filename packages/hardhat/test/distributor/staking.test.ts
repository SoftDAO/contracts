import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { GenericERC20, StakingContract, SoftMfersMock } from "../../typechain-types";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

jest.setTimeout(30000);

let deployer: SignerWithAddress;
let user1: SignerWithAddress;
let stakingContract: StakingContract;
let softMfersContract: SoftMfersMock;
let token: GenericERC20;
let tokenAddress: string;
let softMfersContractAddress: string;
let stakingContractAddress: string;

// 2500  15 days	10%
// 5000  30 Days	10%
// 10000 30 Days	5%
// 25000 45 Days	5%
// 50000 60 Days	2%
// 75000 90 Days	2%
const spec = [
  {
    name: "base",
    maximumAmount: BigInt(5000e18) - BigInt(1),
    maximumPenaltyPeriod: 86400 * 15 - 60,
    expectedPenalty: 10,
    expectedFeeLevelAfterPenaltyPeriodElapses: 85n,
  },
  {
    name: "over 5000",
    maximumAmount: BigInt(10000e18) - BigInt(1),
    maximumPenaltyPeriod: 86400 * 30 - 60,
    expectedPenalty: 10,
    expectedFeeLevelAfterPenaltyPeriodElapses: 75n,
  },
  {
    name: "over 10000",
    maximumAmount: BigInt(25000e18) - BigInt(1),
    maximumPenaltyPeriod: 86400 * 30 - 60,
    expectedPenalty: 5,
    expectedFeeLevelAfterPenaltyPeriodElapses: 65n,
  },
  {
    name: "over 25000",
    maximumAmount: BigInt(50000e18) - BigInt(1),
    maximumPenaltyPeriod: 86400 * 45 - 60,
    expectedPenalty: 5,
    expectedFeeLevelAfterPenaltyPeriodElapses: 50n,
  },
  {
    name: "over 50000",
    maximumAmount: BigInt(75000e18) - BigInt(1e18), // 1e18 because precision is lossed somehow
    maximumPenaltyPeriod: 86400 * 60 - 60,
    expectedPenalty: 2,
    expectedFeeLevelAfterPenaltyPeriodElapses: 25n,
  },
  {
    name: "over 75000",
    maximumAmount: BigInt(10000000e18),
    maximumPenaltyPeriod: 86400 * 90 - 60,
    expectedPenalty: 2,
    expectedFeeLevelAfterPenaltyPeriodElapses: 10n,
  },
];

describe("StakingContract", function () {
  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();

    const GenericERC20Factory = await ethers.getContractFactory("GenericERC20", deployer);
    token = (await GenericERC20Factory.deploy(
      "Neue Crypto Token",
      "NCT",
      18,
      (10n ** 9n * 10n ** 18n).toString(),
    )) as GenericERC20;
    tokenAddress = await token.getAddress();

    const SoftMfersMockFactory = await ethers.getContractFactory("SoftMfersMock", deployer);
    softMfersContract = await SoftMfersMockFactory.deploy();
    softMfersContractAddress = await softMfersContract.getAddress();

    const StakingContracyFactory = await ethers.getContractFactory("StakingContract", deployer);
    stakingContract = await StakingContracyFactory.deploy(tokenAddress, softMfersContractAddress);
    stakingContractAddress = await stakingContract.getAddress();
  });

  it("should allow users to stake tokens", async () => {
    const stakeAmount = 500;
    await token.transfer(user1.address, stakeAmount);
    await token.connect(user1).approve(stakingContractAddress, stakeAmount);
    await stakingContract.connect(user1).stake(stakeAmount);

    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(stakeAmount));
  });

  it("should incur penalty for withdrawal", async () => {
    const stakeAmount = 500;
    await token.transfer(user1.address, stakeAmount);
    await token.connect(user1).approve(stakingContractAddress, stakeAmount);
    await stakingContract.connect(user1).stake(stakeAmount);

    await time.increase(86400 * 15 - 30);
    await stakingContract.connect(user1).unstake(stakeAmount);

    expect(await token.balanceOf(user1.address)).toEqual(BigInt(stakeAmount * 0.9));
    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(0));
  });

  it("should not incur penalty for withdrawal after penalty period passes", async () => {
    const stakeAmount = 500;
    await token.transfer(user1.address, stakeAmount);

    await token.connect(user1).approve(stakingContractAddress, stakeAmount);
    await stakingContract.connect(user1).stake(stakeAmount);
    await time.increase(86400 * 30);
    await stakingContract.connect(user1).unstake(stakeAmount);
    expect(await token.balanceOf(user1.address)).toEqual(BigInt(stakeAmount));
    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(0));
  });

  for (const tier of spec) {
    it(`should handle penalized unstaking for tier ${tier.name}`, async () => {
      const stakeAmount = tier.maximumAmount;
      await token.transfer(user1.address, stakeAmount);

      await token.connect(user1).approve(stakingContractAddress, stakeAmount);
      await stakingContract.connect(user1).stake(stakeAmount);
      const balance = await token.balanceOf(user1);
      expect(balance).toEqual(BigInt(0));
      await time.increase(tier.maximumPenaltyPeriod);
      await stakingContract.connect(user1).unstake(stakeAmount);
      expect(await token.balanceOf(user1.address)).toEqual(
        stakeAmount - BigInt((stakeAmount * BigInt(tier.expectedPenalty)) / BigInt(100)),
      );
      const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
      expect(stakedAmount).toEqual(BigInt(0));
    });
  }

  for (const tier of spec) {
    it(`should handle post-penalty fee level for tier ${tier.name}`, async () => {
      const stakeAmount = tier.maximumAmount;
      await token.transfer(user1.address, stakeAmount);

      await token.connect(user1).approve(stakingContractAddress, stakeAmount);
      await stakingContract.connect(user1).stake(stakeAmount);
      const initialFeeLevel = await stakingContract.getFeeLevel(user1);
      expect(initialFeeLevel).toEqual(100n);
      await time.increase(tier.maximumPenaltyPeriod + 60);
      expect(await stakingContract.hasPenaltyPeriodElapsed(user1)).toEqual(true);
      const feeLevel = await stakingContract.getFeeLevel(user1);
      expect(feeLevel).toEqual(tier.expectedFeeLevelAfterPenaltyPeriodElapses);
    });
  }
});
