import { deployContract } from "./utils";

// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
export default async function () {

  const {contract, address, constructorArgs, fullContractSource} = await deployContract("TrancheVestingMerkleDistributor", []);
  await deployContract("TrancheVestingMerkleDistributorFactory", [contract.target])

  // const {contract, address, constructorArgs, fullContractSource} = await deployContract("ContinuousVestingMerkleDistributor", []);
  // await deployContract("ContinuousVestingMerkleDistributorFactory", [contract.target])

  // const {contract, address, constructorArgs, fullContractSource} = await deployContract("GenericERC20", ["jack", "jd", 18, "1000000000000000000000000000"]);

  // const {contract, address, constructorArgs, fullContractSource} = await deployContract("FlatPriceSale_v_2_1", [0, "0x0000000000000000000000000000000000000000"]);
  // await deployContract("FlatPriceSaleFactory_v_2_1", [contract.target])

}
