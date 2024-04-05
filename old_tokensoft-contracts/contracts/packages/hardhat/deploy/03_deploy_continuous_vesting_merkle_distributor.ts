const { ethers } = require('hardhat')

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	console.log('Deploying continuous vesting merkle distributor...')
	const distributor = await deploy("ContinuousVestingMerkle", {
		from: deployer,
		// test continuous vesting config with 5000 users in merkle tree
		args: [
			// token being claimed
			'0xfdD0DF7f69B7c5DB278323f713f13ff295abF0d8',
			// total claims (18 decimals)
			'100000000000000000000000',
			// uri
			'ipfs://QmUgF8VcBTevGEmNurG3TH1fQAUF8zXoDASPsRBuCrXhDk',
			// voting factor (x1)
			'1000000000000000000',
			// start
			1690905600,
			// cliff
			1690905600,
			// end
			1754064000,
			// merkle root
			'0xae3c4fa9a768509b8e1f8dc1111579a004ad38a7a42cbc6c41df0cf8ee63b45c',
      // max delay time
      0
		],
		log: true
	});

  console.log('Transferring tokens...')
  const Distributor = await ethers.getContractAt(
    'ContinuousVestingMerkle',
    distributor.address
  )
	const Token = await ethers.getContractAt(
		'MyERC20Votes',
		'0xfdD0DF7f69B7c5DB278323f713f13ff295abF0d8'

	)
  const transferResult = await Token.transfer(
    Distributor.address,
    await Distributor.total()
  )
};

module.exports.tags = ['03', 'continuousVesting']