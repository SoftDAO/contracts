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
    "0xcD7dE973264D5967D930Ef5144C59E9811ce5787",
    // distributor domain (mumbai)
    9991,
    // merkle root
    "0x8dd7736745a15706346a0ccdbd255d66380abf72b923671c092f6c489664e3b3"
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
  ],
  "optimism": [
    // connext optimism
    '0x8f7492DE823025b4CfaAB1D34c58963F2af5DEDA',
    // distributor (arbitrum)
    '0x91533b1bBBE84a3Bf6409787cA6A6515080a6F74',
    // distributor domain (arbitrum)
    1634886255,
    // merkle root
    '0xa380f169132591fe29023188206fcd19fbaade18f66af6d963fcc37a5321f5e3'
  ],
  "gnosis": [
    // connext gnosis
    '0x5bB83e95f63217CDa6aE3D181BA580Ef377D2109',
    // distributor (arbitrum)
    '0x91533b1bBBE84a3Bf6409787cA6A6515080a6F74',
    // distributor domain (arbitrum)
    1634886255,
    // merkle root
    '0xa380f169132591fe29023188206fcd19fbaade18f66af6d963fcc37a5321f5e3'
  ],
  "matic": [
    // connext matic
    '0x11984dc4465481512eb5b777E44061C158CF2259',
    // distributor (arbitrum)
    '0x91533b1bBBE84a3Bf6409787cA6A6515080a6F74',
    // distributor domain (arbitrum)
    1634886255,
    // merkle root
    '0xa380f169132591fe29023188206fcd19fbaade18f66af6d963fcc37a5321f5e3'
  ]
}

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const satellite = await deploy('Satellite', {
    from: deployer,
    args: config.optimism,
    log: true
  })
}

module.exports.tags = ['04', 'satellite']