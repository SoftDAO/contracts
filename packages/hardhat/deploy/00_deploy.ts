module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	// deploy a distributor implementation
	const continuousVestingMerkleDistributorContract = await deploy("ContinuousVestingMerkleDistributor", {
		from: deployer,
		args: [],
		log: true
  });
  
  console.log('continuousVestingMerkleDistributorContract', continuousVestingMerkleDistributorContract.address)

	const continuousVestingMerkleDistributorFactoryContract =  await deploy("ContinuousVestingMerkleDistributorFactory", {
		from: deployer,
		args: [continuousVestingMerkleDistributorContract.address], 
		log: true
	});

	console.log('continuousVestingMerkleDistributorFactoryContract', continuousVestingMerkleDistributorFactoryContract.address)

};

module.exports.tags = ["00", "deploy"]
