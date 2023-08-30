const { ethers } = require('hardhat')

const config = {
  "mumbai": [
    // connext mumbai
    "0x2334937846Ab2A3FCE747b32587e1A1A2f6EEC5a",
    // distributor (goerli)
    "0x4Fe0c446aa63E7755bA5B5a881364dE8c88f9D6c",
    // distributor domain (goerli)
    1735353714,
    // merkle root
    "0xef3630f9185143cc739673d209043bcc12106ff99ba874a38816946e0becb213"
  ],
  "goerli": [
    // connext goerli
    "0xFCa08024A6D4bCc87275b1E4A1E22B71fAD7f649",
    // distributor (mumbai)
    "0xcde1bc5306684f5e1303C50925622c1b095DB79A",
    // distributor domain (mumbai)
    9991,
    // merkle root
    "0x84cdf46e26483edc0b5c02b32c560087c6964920041e12f88a8d168ff24f603e"
  ],
  "goerliOptimism": [
    // connext optimism goerli
    "0x2b6488d408d1999c71936eE642f0fAD136f8582d",
    // distributor (goerli)
    "0x4a09eaee8587425811189deB323B59C1A4985089",
    // distributor domain (goerli)
    1735353714,
    // merkle root
    "0x45c403f18dff39004d1b6b6915739d85e921934f31b01b51f3ecd5540372537a"
  ],
  "goerliArbitrum": [
    // connext arbitrum goerli
    "0x2075c9E31f973bb53CAE5BAC36a8eeB4B082ADC2",
    // distributor (goerli)
    "0x4a09eaee8587425811189deB323B59C1A4985089",
    // distributor domain (goerli)
    1735353714,
    // merkle root
    "0x45c403f18dff39004d1b6b6915739d85e921934f31b01b51f3ecd5540372537a"
  ]
}

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const satellite = await deploy('Satellite', {
    from: deployer,
    args: config.goerli,
    log: true
  })
}

module.exports.tags = ['04', 'satellite']