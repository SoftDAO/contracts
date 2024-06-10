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
    maximumAmount: BigInt(10000e18) - BigInt(1),
    maximumPenaltyPeriod: 86400 * 30 - 1,
    expectedPenalty: 0.1,
  },
  {
    maximumAmount: BigInt(25000e18) - BigInt(1),
    maximumPenaltyPeriod: 86400 * 30 - 1,
    expectedPenalty: 0.05,
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

  it("should incur penalty for withdrawal", async () => {
    const stakeAmount = 500;
    await token.connect(user1).approve(stakingContractAddress, stakeAmount);
    await stakingContract.connect(user1).stake(stakeAmount, tokenAddress);

    await time.increase(86400 * 30 - 30);
    await stakingContract.connect(user1).unstake(stakeAmount, tokenAddress);

    expect(await token.balanceOf(user1.address)).toEqual(BigInt(stakeAmount * 0.9));
    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(0));
  });

  it("should not incur penalty for withdrawal after penalty period passes", async () => {
    const stakeAmount = 500;

    await token.connect(user1).approve(stakingContractAddress, stakeAmount);
    await stakingContract.connect(user1).stake(stakeAmount, tokenAddress);
    await time.increase(86400 * 30);
    await stakingContract.connect(user1).unstake(stakeAmount, tokenAddress);
    expect(await token.balanceOf(user1.address)).toEqual(BigInt(stakeAmount));
    const [stakedAmount] = await stakingContract.stakedTokens(user1.address);
    expect(stakedAmount).toEqual(BigInt(0));
  });
});
