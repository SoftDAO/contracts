import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import hre from "hardhat";
import {
  GenericERC20,
  TrancheVestingMerkleDistributorFactory,
  TrancheVestingMerkleDistributor,
  TrancheVestingMerkleDistributorFactory__factory,
  TrancheVestingMerkleDistributor__factory,
} from "../../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { EventLog } from "ethers";

const ethers = (hre as any).ethers;

jest.setTimeout(30000);

let deployer: SignerWithAddress; // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
let eligible1: SignerWithAddress; // 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
let eligible2: SignerWithAddress; // 0x90F79bf6EB2c4f870365E785982E1f101E93b906
// let ineligible: SignerWithAddress; // 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
let token: GenericERC20;
let DistributorFactoryFactory: TrancheVestingMerkleDistributorFactory__factory;
let distributorFactory: TrancheVestingMerkleDistributorFactory;
let DistributorFactory: TrancheVestingMerkleDistributor__factory;
let distributorAddress: string;
// let unvestedDistributor: TrancheVestingMerkleDistributor;
// let partiallyVestedDistributor: TrancheVestingMerkle;
let fullyVestedDistributor: TrancheVestingMerkleDistributor;
// let unvestedTimes: [bigint, bigint, bigint];
// let partiallyVestedTimes: [bigint, bigint, bigint];
// let fullyVestedTimes: [bigint, bigint, bigint];

type Config = {
  total: bigint;
  uri: string;
  votingFactor: bigint;
  proof: {
    merkleRoot: string;
    claims: {
      [k: string]: {
        proof: string[];
        data: {
          name: string;
          type: string;
          value: string;
        }[];
      };
    };
  };
};
// distribute a million tokens in total
const config: Config = {
  // 1 million tokens
  total: 7500000000000000000000n,
  // any string will work for these unit tests - the uri is not used on-chain
  uri: "https://example.com",
  // 2x, denominated in fractionDenominator of 1e18
  votingFactor: 2n * 10n ** 18n,
  // created using yarn generate-merkle-root
  proof: {
    merkleRoot: "0x7bc676cc9d8db1f8fa03ca95e63b062cc08d8c0bfbdf5a0f18c3b9aadb66555e",
    claims: {
      // eligible1
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": {
        proof: ["0xc8055cac33ef83d8876a5f8eeb53a54b23b84ef8eeea1cd116d15d78cdf24993"],
        data: [
          {
            name: "index",
            type: "uint256",
            value: "0",
          },
          {
            name: "beneficiary",
            type: "address",
            value: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          },
          {
            name: "amount",
            type: "uint256",
            value: "5000000000000000000000",
          },
        ],
      },
      // eligible2
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": {
        proof: ["0xa82f515a479cbe664b37f89b05d1e13886cae562847741b55442ff8d9df08993"],
        data: [
          {
            name: "index",
            type: "uint256",
            value: "1",
          },
          {
            name: "beneficiary",
            type: "address",
            value: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          },
          {
            name: "amount",
            type: "uint256",
            value: "2500000000000000000000",
          },
        ],
      },
    },
  },
};

describe("TrancheVestingMerkle", function () {
  beforeAll(async () => {
    [deployer, eligible1, eligible2] = await ethers.getSigners();

    const GenericERC20Factory = await ethers.getContractFactory("GenericERC20", deployer);
    token = (await GenericERC20Factory.deploy(
      "Neue Crypto Token",
      "NCT",
      18,
      (10n ** 9n * 10n ** 18n).toString(),
    )) as GenericERC20;
    const tokenAddress = await token.getAddress();

    const SoftMfersMockFactory = await ethers.getContractFactory("SoftMfersMock", deployer);
    const softMfersContract = await SoftMfersMockFactory.deploy();
    const softMfersContractAddress = await softMfersContract.getAddress();

    const StakingContracyFactory = await ethers.getContractFactory("StakingContract", deployer);
    const stakingContract = await StakingContracyFactory.deploy();
    await stakingContract.waitForDeployment();
    await stakingContract.initialize(tokenAddress, softMfersContractAddress);
    const stakingContractAddress = await stakingContract.getAddress();

    const OracleMockFactory = await ethers.getContractFactory("OracleMock", deployer);
    const oracleMock = await OracleMockFactory.deploy();
    await oracleMock.waitForDeployment();
    const oracleMockAddress = await oracleMock.getAddress();

    const NetworkConfigFactory = await ethers.getContractFactory("NetworkConfig", deployer);
    const networkConfig = await NetworkConfigFactory.deploy();
    await networkConfig.waitForDeployment();
    await networkConfig.initialize(eligible2.address, stakingContractAddress, oracleMockAddress, 10 ** 8);
    const networkConfigAddress = await networkConfig.getAddress();

    DistributorFactoryFactory = await ethers.getContractFactory("TrancheVestingMerkleDistributorFactory");

    DistributorFactory = await ethers.getContractFactory("TrancheVestingMerkleDistributor", deployer);
    const distributorImplementation = await DistributorFactory.deploy();
    const distributorImplementationAddress = await distributorImplementation.getAddress();
    distributorFactory = await DistributorFactoryFactory.deploy(distributorImplementationAddress);

    // get the last block time after a recent transaction to make sure it is recent
    const now = BigInt(await time.latest());

    const fullyVestedTranches = [
      { time: now - 100n, vestedFraction: 1000n },
      { time: now - 50n, vestedFraction: 5000n },
      { time: now - 10n, vestedFraction: 10000n },
    ];

    distributorAddress = await distributorFactory.predictDistributorAddress(
      token.target,
      config.total,
      config.uri,
      fullyVestedTranches,
      config.proof.merkleRoot,
      0,
      eligible1.address,
      networkConfigAddress,
      0,
    );

    const feeAmount = config.total / 100n;
    await token.transfer(eligible1.address, feeAmount);
    await (await token.connect(eligible1).approve(distributorAddress, feeAmount)).wait();

    const deploymentResponse = await distributorFactory.deployDistributor(
      token.target,
      config.total,
      config.uri,
      fullyVestedTranches,
      config.proof.merkleRoot,
      0,
      eligible1.address,
      networkConfigAddress,
      0,
    );

    const deploymentTx = (await deploymentResponse.wait())!;

    const [
      {
        args: [loggedDistributorAddress],
      },
    ] = deploymentTx.logs as EventLog[];

    expect(loggedDistributorAddress).toEqual(distributorAddress);

    fullyVestedDistributor = TrancheVestingMerkleDistributor__factory.connect(distributorAddress, eligible1);

    // transfer tokens to the distributors
    await token.transfer(fullyVestedDistributor.target, await fullyVestedDistributor.total());
  });

  it("can handle a claim", async () => {
    const {
      data: [{ value: index }, { value: beneficiary }, { value: amount }],
      proof,
    } = config.proof.claims[eligible1.address];

    const claimResponse = await fullyVestedDistributor.claim(index, beneficiary, amount, proof, {
      value: ethers.parseEther("0.00034"),
    });

    await claimResponse.wait();

    const distributionRecord = await fullyVestedDistributor.getDistributionRecord(eligible1.address);

    expect(distributionRecord.total).toEqual(BigInt(config.proof.claims[eligible1.address].data[2].value));
    expect(distributionRecord.initialized).toEqual(true);

    expect(await ethers.provider.getBalance(distributorAddress)).toEqual(0n);
    expect(await ethers.provider.getBalance(eligible2.address)).toEqual(10000000003393626768927n);
  });
});
