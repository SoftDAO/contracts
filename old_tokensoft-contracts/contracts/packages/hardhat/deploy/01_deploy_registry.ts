module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  
  console.log('Deploying registry...')
  const registryResult = await deploy("Registry", {
		from: deployer,
		args: [],
		log: true
	});
}

module.exports.tags = ['01', 'registry']
