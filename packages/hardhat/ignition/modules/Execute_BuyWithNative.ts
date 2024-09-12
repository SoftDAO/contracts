import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("ExecuteNewSaleModule", m => {
  // const deployer = m.getAccount(0);
  // const recipient = m.getAccount(1);

  /** ETHEREUM MAINNET */
  // const FlatPriceSaleFactoryAddress = "0xaffd5144511fdb139e06733a7413c95a80a9c2ce";

  /** BASE SEPOLIA */
  const baseSepolia_FlatPriceSaleAddress_v2 = "0xC36BA12Ef4dFD202B67CF0609dF39E5FFF693781";
  const baseSepolia_FlatPriceSaleAddress_v3 = "0x51bEF78ce0f48b816F065A48B3966e3cbEaA1045";

  /**
   * UPDATE VARIABLES
   */
  // const networkChosen = "baseSepolia";
  const versionChosen: string = "v3";
  /**
   *
   */
  const argsForV2 = ["0x", ["0x396a80388a635517527f4be13d6f750c956dd2c864aeb6389d22ddf2323a1029"]];

  const argsForV3 = [
    "0x",
    ["0x396a80388a635517527f4be13d6f750c956dd2c864aeb6389d22ddf2323a1029"],
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    100000000,
  ];

  let flatPriceSale;
  let args;
  if (versionChosen == "v2") {
    flatPriceSale = m.contractAt("FlatPriceSale_v_2_1", baseSepolia_FlatPriceSaleAddress_v2);
    args = argsForV2;
  } else if (versionChosen == "v3") {
    flatPriceSale = m.contractAt("FlatPriceSale_v_3", baseSepolia_FlatPriceSaleAddress_v3);
    args = argsForV3;
  } else {
    throw new Error(`Invalid version: ${versionChosen}`);
  }

  // Add this line to specify the amount of ETH to send
  const ethToSend = ethers.parseEther("0.005"); // Adjust this value as needed

  m.call(flatPriceSale, "buyWithNative", args, { value: ethToSend });

  return {};
});
