import * as hre from "hardhat";
import { getWallet } from "./utils";
import { ethers } from "ethers";

//  UPDATE VARIABLES
const deployer = getWallet().address;
const saleAddress = "0x453a6bfba54bfcac121f00ab196fc579bb22ba18";

// An example of a script to interact with the contract
export default async function () {
  const FlatPriceSale_v_4_0Artifact = await hre.artifacts.readArtifact(
    "FlatPriceSale_v_4_0"
  );
  const FlatPriceSale_v_4_0Contract = new ethers.Contract(
    saleAddress,
    FlatPriceSale_v_4_0Artifact.abi,
    getWallet()
  );

  // Get the current block timestamp
  const latestBlock = await hre.ethers.provider.getBlock("latest");
  const currentTimestamp = latestBlock.timestamp;
  console.log(`Current block timestamp: ${currentTimestamp}`);

  // Read nativeTokenPriceOracle
  // const nativeTokenPriceOracle =
  //   await FlatPriceSale_v_4_0Contract.nativeTokenPriceOracle();
  // console.log(`Native Token Price Oracle: ${nativeTokenPriceOracle}`);
  const nonNativeTokenPriceOracle =
    "0x1824D297C6d6D311A204495277B63e943C2D376E";

  // Read nativeTokenPriceOracleHeartbeat
  // const nativeTokenPriceOracleHeartbeat =
  //   await FlatPriceSale_v_4_0Contract.nativeTokenPriceOracleHeartbeat();
  // console.log(
  //   `Native Token Price Oracle Heartbeat: ${nativeTokenPriceOracleHeartbeat}`
  // );
  const nonNativeTokenPriceOracleHeartbeat = 360000;

  // Call getOraclePrice function
  try {
    const oraclePrice = await FlatPriceSale_v_4_0Contract.getOraclePrice(
      nonNativeTokenPriceOracle,
      nonNativeTokenPriceOracleHeartbeat
    );
    console.log(`Oracle Price: ${oraclePrice}`);
  } catch (error) {
    console.error("Error calling getOraclePrice:", error);
  }

  // // Load compiled contract info
  // const contractArtifact = await hre.artifacts.readArtifact("Greeter");

  // // Initialize contract instance for interaction
  // const contract = new ethers.Contract(
  //   CONTRACT_ADDRESS,
  //   contractArtifact.abi,
  //   getWallet() // Interact with the contract on behalf of this wallet
  // );

  // // Run contract read function
  // const response = await contract.greet();
  // console.log(`Current message is: ${response}`);

  // // Run contract write function
  // const transaction = await contract.setGreeting("Hello people!");
  // console.log(`Transaction hash of setting new message: ${transaction.hash}`);

  // // Wait until transaction is processed
  // await transaction.wait();

  // // Read message after transaction
  // console.log(`The message now is: ${await contract.greet()}`);
}
