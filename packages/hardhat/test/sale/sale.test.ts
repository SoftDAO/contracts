import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  GenericERC20,
  StakingContract,
  SoftMfersMock,
  FlatPriceSale_v_3,
  FlatPriceSale_v_3__factory,
} from "../../typechain-types";
import { ConfigStruct } from "../../typechain-types/contracts/sale/v3/FlatPriceSale.sol/FlatPriceSale_v_3";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

jest.setTimeout(30000);

let deployer: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
// let user3: SignerWithAddress;
let stakingContract: StakingContract;
let softMfersContract: SoftMfersMock;
let token: GenericERC20;
let tokenAddress: string;
let softMfersContractAddress: string;
let stakingContractAddress: string;
let sale: FlatPriceSale_v_3;

describe("FlatPriceSale V3", function () {
  beforeEach(async () => {
    [deployer, user1, user2] = await ethers.getSigners();

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
    stakingContract = await StakingContracyFactory.deploy();
    await stakingContract.waitForDeployment();
    await stakingContract.initialize(tokenAddress, softMfersContractAddress);
    stakingContractAddress = await stakingContract.getAddress();

    const OracleMockFactory = await ethers.getContractFactory("OracleMock", deployer);
    const oracleMock = await OracleMockFactory.deploy();
    await oracleMock.waitForDeployment();
    const oracleMockAddress = await oracleMock.getAddress();

    const NetworkConfigFactory = await ethers.getContractFactory("NetworkConfig", deployer);
    const networkConfig = await NetworkConfigFactory.deploy();
    await networkConfig.waitForDeployment();
    networkConfig.initialize(user2.address, stakingContractAddress, oracleMockAddress, 100);
    const networkConfigAddress = await networkConfig.getAddress();

    const FlatPriceSaleFactory = await ethers.getContractFactory("FlatPriceSale_v_3", deployer);
    const flatPriceSaleImplementation = await FlatPriceSaleFactory.deploy(networkConfigAddress);
    await flatPriceSaleImplementation.waitForDeployment();

    const FlatPriceSaleFactoryFactory = await ethers.getContractFactory("FlatPriceSaleFactory_v_3", deployer);
    const flatPriceSaleFactory = await FlatPriceSaleFactoryFactory.deploy(flatPriceSaleImplementation);
    await flatPriceSaleFactory.waitForDeployment();

    const saleStartTime = Math.floor(Date.now() / 1000);

    const config: ConfigStruct = {
      recipient: user1.address,
      merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
      saleMaximum: "100000000000000",
      userMaximum: "10000000000000",
      purchaseMinimum: "0",
      startTime: saleStartTime,
      endTime: saleStartTime + 86400 * 90,
      maxQueueTime: 0,
      URI: "",
    };

    const saleTx = await flatPriceSaleFactory.newSale(
      user1.address,
      config,
      "USD",
      true,
      oracleMockAddress,
      [],
      [],
      [],
    );

    const response = await saleTx.wait();
    const saleAddress = `0x${response?.logs[0].topics[2].slice(26)}`;
    sale = FlatPriceSale_v_3__factory.connect(saleAddress, user1);
  });

  it("should handle a purchase", async () => {
    const tokenAmount = BigInt(5000e18);
    await token.transfer(user1.address, tokenAmount);

    await token.connect(user1).approve(stakingContractAddress, tokenAmount);
    const stakeTx = await stakingContract.connect(user1).stake(tokenAmount);
    await stakeTx.wait();
    const initialFeeLevel = await stakingContract.getFeeLevel(user1);
    expect(initialFeeLevel).toEqual(100n);
    await time.increase(86400 * 30);
    expect(await stakingContract.hasPenaltyPeriodElapsed(user1)).toEqual(true);
    const feeLevel = await stakingContract.getFeeLevel(user1);
    expect(feeLevel).toEqual(75n);

    const purchaseTx = await sale.buyWithNative("0x", [], { value: BigInt("100000000000000000") });
    await purchaseTx.wait();
    await sale.withdrawPayments(user2);
    expect(await ethers.provider.getBalance(user2)).toEqual(10000000750000000000000n);
  });
});
