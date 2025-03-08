import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("ExecuteBuyWithNativeModule", m => {
  //  UPDATE VARIABLES
  const currentNetwork = "baseSepolia";
  const currentFPSVersion: string = "v4";
  const currentArgsVersion: keyof typeof argsDatabase = "v4";

  const addressesDatabase = {
    mainnet: {
      flatPriceSaleAddress: {},
    },
    sepolia: {
      flatPriceSaleAddress: {
        "v2.1": "0xaffd5144511fdb139e06733a7413c95a80a9c2ce",
      },
    },
    baseSepolia: {
      flatPriceSaleAddress: {
        v2: "0x0",
        "v2.1": "0xC36BA12Ef4dFD202B67CF0609dF39E5FFF693781",
        v3: "0x0",
        v4: "0x6211ef4F530C86a033A797336c8B88564b6Fc711",
      },
    },
  };

  const argsDatabase = {
    // args for FPS v2
    v2: ["0x", ["0x396a80388a635517527f4be13d6f750c956dd2c864aeb6389d22ddf2323a1029"]],
    // args for FPS v3
    v3: [
      "0x",
      ["0x396a80388a635517527f4be13d6f750c956dd2c864aeb6389d22ddf2323a1029"],
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      100000000,
    ],
    // args for FPS v4
    v4: [
      100,
      1728950399,
      "0x7b05ff4c9c69e35c6639fa82f7b849622a56d86874c6b79cf0bba9b62467faca478f0c05ad822583249abfeb2129561a40610e558ccc0fa043ef0814b093f2431b",
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      100000000,
    ],
  };

  let flatPriceSale;
  const args = argsDatabase[currentArgsVersion];
  if (currentFPSVersion == "v2") {
    flatPriceSale = m.contractAt(
      "FlatPriceSale_v_2_1",
      addressesDatabase[currentNetwork].flatPriceSaleAddress[currentFPSVersion],
    );
  } else if (currentFPSVersion == "v3") {
    flatPriceSale = m.contractAt(
      "FlatPriceSale_v_3",
      addressesDatabase[currentNetwork].flatPriceSaleAddress[currentFPSVersion],
    );
  } else if (currentFPSVersion == "v4") {
    flatPriceSale = m.contractAt(
      "FlatPriceSale_v_4_0",
      addressesDatabase[currentNetwork].flatPriceSaleAddress[currentFPSVersion],
    );
  } else {
    throw new Error(`Invalid version: ${currentFPSVersion}`);
  }

  const ethToSend = ethers.parseEther("0.005");
  m.call(flatPriceSale, "buyWithNative", args, { value: ethToSend });

  return {};
});
