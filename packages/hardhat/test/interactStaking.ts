import readline from "readline";
import { ethers } from "hardhat";

const SOFT_TOKEN_ADDRESS = "0x7CA877f49Ff29c5464F073c75592315ecBa67282";
const STAKING_CONTRACT_ADDRESS = "0xeFc2C5294A2913b31B294325153B1C8446145173";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  const softToken = await ethers.getContractAt("GenericERC20", SOFT_TOKEN_ADDRESS);
  const stakingContract = await ethers.getContractAt("StakingContract", STAKING_CONTRACT_ADDRESS);

  async function checkBalance() {
    try {
      const signerBalance = await softToken.balanceOf(signer.address);
      console.log("Signer balance:", signerBalance.toString());
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  }

  async function approveTokens() {
    try {
      const amount = await promptInput("Enter the amount of tokens to approve: ");
      const tx = await softToken.approve(STAKING_CONTRACT_ADDRESS, amount);
      await tx.wait();
      console.log("Tokens approved successfully!");
    } catch (error) {
      console.error("Error approving tokens:", error);
    }
  }

  async function checkOwnership() {
    try {
      const owner = await stakingContract.owner();
      console.log("Contract owner:", owner);
    } catch (error) {
      console.error("Error checking contract ownership:", error);
    }
  }

  async function redeemNFTs() {
    try {
      const tx = await stakingContract.redeemNFTs();
      await tx.wait();
      console.log("NFTs redeemed successfully!");
    } catch (error) {
      console.error("Error redeeming NFTs:", error);
    }
  }

  async function stakeTokens() {
    try {
      const amount = await promptInput("Enter the amount of tokens to stake: ");
      console.log("Staking tokens...");

      const gasLimit = 300000;
      const gasPrice = ethers.parseUnits("10", "gwei");
      console.log("Gas limit:", gasLimit);
      console.log("Gas price:", gasPrice.toString());

      const tx = await stakingContract.stake(amount, { gasLimit, gasPrice });
      await tx.wait();
      console.log("Tokens staked successfully!");
    } catch (error) {
      if (error.message.includes("Insufficient token balance")) {
        console.error("Error: Insufficient token balance");
      } else if (error.message.includes("Insufficient token allowance")) {
        console.error("Error: Insufficient token allowance");
      } else if (error.message.includes("Token transfer failed")) {
        console.error("Error: Token transfer failed");
      } else {
        console.error("Error staking tokens:", error);
      }
    }
  }

  async function unstakeTokens() {
    try {
      const amount = await promptInput("Enter the amount of tokens to unstake: ");
      const tx = await stakingContract.unstake(amount);
      await tx.wait();
      console.log("Tokens unstaked successfully!");
    } catch (error) {
      console.error("Error unstaking tokens:", error);
    }
  }


  async function getStakedBalance() {
    const stakedAmount = await stakingContract.getStakedAmount(signer.address);
    console.log("Staked amount for user", signer.address, "is:", stakedAmount.toString());
  }

  async function sendTokens() {
    try {
      const recipientAddress = await promptInput("Enter the recipient address: ");
      const amount = await promptInput("Enter the amount of tokens to send: ");

      const tx = await softToken.transfer(recipientAddress, amount);
      await tx.wait();
      console.log("Tokens sent successfully!");
    } catch (error) {
      console.error("Error sending tokens:", error);
    }
  }

  async function promptInput(message) {
    return new Promise((resolve) => {
      rl.question(message, (input) => {
        resolve(input);
      });
    });
  }

  async function displayMenu() {
    console.log("\nSelect an action:");
    console.log("1. Check balance");
    console.log("2. Approve tokens");
    console.log("3. Stake tokens");
    console.log("4. Unstake tokens");
    console.log("5. Check contract ownership");
    console.log("6. Get staked balance");
    console.log("7. Redeem NFTs");
    console.log("8. Send tokens");
    console.log("9. Exit");

    const choice = await promptInput("Enter your choice: ");
    console.log();

    switch (choice) {
      case "1":
        await checkBalance();
        break;
      case "2":
        await approveTokens();
        break;
      case "3":
        await stakeTokens();
        break;
      case "4":
        await unstakeTokens();
        break;
      case "5":
        await checkOwnership();
        break;
      case "6":
        await getStakedBalance();
        break;
      case "7":
        await redeemNFTs();
        break;
      case "8":
        await sendTokens();
        break;
      case "9":
        rl.close();
        process.exit(0);
      default:
        console.log("Invalid choice!");
    }

    await displayMenu();
  }

  await displayMenu();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });