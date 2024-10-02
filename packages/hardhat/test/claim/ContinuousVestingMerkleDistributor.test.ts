import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import hre from "hardhat";
import {
  GenericERC20,
  ContinuousVestingMerkleDistributorFactory_v_4_0,
  ContinuousVestingMerkleDistributor_v_4_0,
  ContinuousVestingMerkleDistributorFactory_v_4_0__factory,
  ContinuousVestingMerkleDistributor_v_4_0__factory,
} from "../../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { EventLog } from "ethers";

const ethers = (hre as any).ethers;

jest.setTimeout(30000);

let deployer: SignerWithAddress; // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
let eligible1: SignerWithAddress; // 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
let eligible2: SignerWithAddress; // 0x90F79bf6EB2c4f870365E785982E1f101E93b906
let token: GenericERC20;
let DistributorFactoryFactory: ContinuousVestingMerkleDistributorFactory_v_4_0__factory;
let distributorFactory: ContinuousVestingMerkleDistributorFactory_v_4_0;
let DistributorFactory: ContinuousVestingMerkleDistributor_v_4_0__factory;
let distributorAddress: string;
// let unvestedDistributor: ContinuousVestingMerkleDistributor;
// let partiallyVestedDistributor: ContinuousVestingMerkle;
let fullyVestedDistributor: ContinuousVestingMerkleDistributor_v_4_0;
// let unvestedTimes: [bigint, bigint, bigint];
// let partiallyVestedTimes: [bigint, bigint, bigint];
let fullyVestedTimes: [bigint, bigint, bigint];

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

describe("ContinuousVestingMerkle", function () {
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

    const FeeLevelJudgeStubFactory = await ethers.getContractFactory("FeeLevelJudgeStub", deployer);
    const feeLevelJudgeContract = await FeeLevelJudgeStubFactory.deploy(100);
    await feeLevelJudgeContract.waitForDeployment();
    const feeLevelJudgeContractAddress = await feeLevelJudgeContract.getAddress();

    const OracleMockFactory = await ethers.getContractFactory("OracleMock", deployer);
    const oracleMock = await OracleMockFactory.deploy();
    await oracleMock.waitForDeployment();
    const oracleMockAddress = await oracleMock.getAddress();

    const NetworkConfigFactory = await ethers.getContractFactory("NetworkConfig", deployer);
    const networkConfig = await NetworkConfigFactory.deploy();
    await networkConfig.waitForDeployment();
    await networkConfig.initialize(eligible2.address, feeLevelJudgeContractAddress, oracleMockAddress, 10 ** 8);
    const networkConfigAddress = await networkConfig.getAddress();

    DistributorFactoryFactory = await ethers.getContractFactory("ContinuousVestingMerkleDistributorFactory_v_4_0");

    DistributorFactory = await ethers.getContractFactory("ContinuousVestingMerkleDistributor_v_4_0", deployer);
    const distributorImplementation = await DistributorFactory.deploy();
    const distributorImplementationAddress = await distributorImplementation.getAddress();
    distributorFactory = await DistributorFactoryFactory.deploy(distributorImplementationAddress);

    // get the last block time after a recent transaction to make sure it is recent
    const now = BigInt(await time.latest());

    fullyVestedTimes = [
      now - 100n, // start: 100 seconds ago
      now - 50n, // cliff: 50 seconds ago
      now, // end: now
    ];

    distributorAddress = await distributorFactory.predictDistributorAddress(
      tokenAddress,
      config.total,
      config.uri,
      ...fullyVestedTimes,
      config.proof.merkleRoot,
      0,
      eligible1.address,
      eligible1.address,
      true,
      networkConfigAddress,
      0,
    );

    const feeAmount = config.total / 100n;
    await (await token.transfer(eligible1.address, config.total + feeAmount)).wait();
    await (await token.connect(eligible1).approve(distributorAddress, config.total + feeAmount)).wait();

    const deploymentResponse = await distributorFactory
      .connect(eligible1)
      .deployDistributor(
        tokenAddress,
        config.total,
        config.uri,
        ...fullyVestedTimes,
        config.proof.merkleRoot,
        0,
        eligible1.address,
        eligible1.address,
        true,
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

    fullyVestedDistributor = ContinuousVestingMerkleDistributor_v_4_0__factory.connect(distributorAddress, eligible1);

    // transfer tokens to the distributors
    // await token.transfer(fullyVestedDistributor.target, await fullyVestedDistributor.total());
  });

  it("can handle a claim", async () => {
    const eligible2Balance = await ethers.provider.getBalance(eligible2.address);

    const {
      data: [{ value: index }, { value: beneficiary }, { value: amount }],
      proof,
    } = config.proof.claims[eligible1.address];

    const feeAmountInWei = 339362676892795n; // 1 USD according to oracle mock
    const feeAmountInUSD = 10n ** 8n;
    const claimResponse = await fullyVestedDistributor.claim(
      index,
      beneficiary,
      amount,
      proof,
      eligible2.address,
      feeAmountInUSD,
      {
        value: ethers.parseEther("0.00034") + feeAmountInWei,
      },
    );

    await claimResponse.wait();

    const distributionRecord = await fullyVestedDistributor.getDistributionRecord(eligible1.address);

    expect(distributionRecord.total).toEqual(BigInt(config.proof.claims[eligible1.address].data[2].value));
    expect(distributionRecord.initialized).toEqual(true);

    expect({
      eligible2BalanceDiff: (await ethers.provider.getBalance(eligible2.address)) - eligible2Balance,
    }).toEqual({
      eligible2BalanceDiff: feeAmountInWei,
    });
  });
});
