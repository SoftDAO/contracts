import { encodePacked, keccak256 } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const contractAddress = "0xB278E83ED314c6E42f80D33Eb55Df4c21Cf90497"; // Address of the contract containing verifyAccessSignature
const memberAddress = "0xb4B95fC47Bb797AcC777e5A2AA27c23C294637eE"; // Address of the member
const userLimit = 2000000000n; // Example user limit
// Expires in 7 days
// const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);
// Expires at October 13th, 2024 at 11:59pm.
const expiresAt = BigInt(1728950399);

console.log(
  `values used: contractAddress: ${contractAddress}, memberAddress: ${memberAddress}, userLimit: ${userLimit}, expiresAt: ${expiresAt}`
);

const message = encodePacked(
  ["address", "address", "uint256", "uint64"],
  [contractAddress, memberAddress, userLimit, expiresAt]
);
console.log(`message is: ${message}`);
const messageHash = keccak256(message);
console.log(`messageHash is: ${messageHash}`);

// Add error checking for the private key
const privateKey = process.env.EVM_PRIVATE_KEY_1; // Replace with your actual private key
if (!privateKey || !privateKey.startsWith("0x")) {
  throw new Error(
    'Invalid or missing private key. Make sure EVM_PRIVATE_KEY_1 is set in your .env file and starts with "0x".'
  );
}
const account = privateKeyToAccount(privateKey as `0x${string}`);

async function signMessage() {
  const signature = await account.signMessage({
    message: { raw: messageHash }
  });
  console.log("Signature:", signature);
}

signMessage().catch(console.error);
