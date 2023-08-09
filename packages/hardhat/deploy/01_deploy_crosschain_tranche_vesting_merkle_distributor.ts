const { ethers } = require('hardhat')

const ONE_BILLION = '1000000000000000000000000000'
const ONE_MILLION = '1000000000000000000000000'

const MERKLE_TREE = {
  "merkleRoot": "0x25e9b9b2a57375a5b6bad1c2575126b6307c93a5816b1d636a3a2fe07fd88a40",
  "claims": {
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc": {
      "proof": [
        "0x4e0a7d895052a7a3f15aab83c8eaf07f6aeedecf80180b939afcd04a1da90054",
        "0xb8cb8af04efd13b603589588a13c9e63474c4d79452a944db4e9c7d2d2c7ec2f"
      ],
      "data": [
        {
          "name": "beneficiary",
          "type": "address",
          "value": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
        },
        {
          "name": "amount",
          "type": "uint256",
          "value": "1000"
        },
        {
          "name": "domain",
          "type": "uint32",
          "value": "1735353714"
        }
      ]
    },
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8": {
      "proof": [
        "0xe145d106ff02c844826547fa4d1f5786f19c0d5d73f948c91add31ae7b94c2f5"
      ],
      "data": [
        {
          "name": "beneficiary",
          "type": "address",
          "value": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
        },
        {
          "name": "amount",
          "type": "uint256",
          "value": "1000"
        },
        {
          "name": "domain",
          "type": "uint32",
          "value": "1735353714"
        }
      ]
    },
    "0x90f79bf6eb2c4f870365e785982e1f101e93b906": {
      "proof": [
        "0x73df9df38ba48b812d2bad1c95fa3ba5390bdc5c3aec13e4c598a893c8af4811",
        "0xb8cb8af04efd13b603589588a13c9e63474c4d79452a944db4e9c7d2d2c7ec2f"
      ],
      "data": [
        {
          "name": "beneficiary",
          "type": "address",
          "value": "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
        },
        {
          "name": "amount",
          "type": "uint256",
          "value": "1000"
        },
        {
          "name": "domain",
          "type": "uint32",
          "value": "1735353714"
        }
      ]
    }
  }
}

module.exports = async ({ deployments, getNamedAccounts }) => {
  const tranches = [{ time: '1690480800', vestedFraction: 10000 }]

  const { deploy } = deployments
  const { deployer, seller: user } = await getNamedAccounts()
  // const userAddress = user.toLowerCase()
  const deployerSigner = await ethers.getSigner(deployer)
  // const userSigner = await ethers.getSigner(user)
  
  // const registryResult = await deploy("Registry", {
	// 	from: deployer,
	// 	args: [],
	// 	log: true
	// });

	// const Registry = await ethers.getContractAt("Registry", registryResult.address)
  
  // const tokenResult = await deploy('MyERC20Votes', {
  //   from: deployer,
  //   args: ['Test ERC20 Votes TOken', 'TST', ONE_MILLION],
  //   log: true
  // })
  // const Token = await ethers.getContractAt('MyERC20Votes', tokenResult.address)

  const config = {
    "goerli": [
      // erc20 TVOTES token
      "0xC15bAC780f7702E83d421955132d192c8841B13f",
      // connext
      "0xFCa08024A6D4bCc87275b1E4A1E22B71fAD7f649",
      // uint256 total
      ONE_MILLION,
      // string uri
      "ipfs://QmPpxuZCarq8NNPAJPszVUS7ZgfhidpoqgAvhp2CWFgHuV",
      // uint256 voteFactor
      "10000",
      // Tranche[] tranches
      [{ time: '1690822800', vestedFraction: 10000 }],
      // bytes32 merkleRoot
      "0xef3630f9185143cc739673d209043bcc12106ff99ba874a38816946e0becb213",
      // uint160 maxDelayTime
      '300'
    ],
    "mumbai": [
      // erc20 token - TVOTES
      "0x0466310B91743Da33A0ACa64bDAb0e7F5559e36c",
      // connext
      "0x2334937846Ab2A3FCE747b32587e1A1A2f6EEC5a",
      // uint256 total
      '5800000000000000000000',
      // string uri
      "ipfs://QmURf2AeBea2VJ7sqprWpsCssURHYM8jDJ5i2cKMS644bp",
      // uint256 voteFactor
      "10000",
      // Tranche[] tranches
      [{ time: '1691172000', vestedFraction: 10000 }],
      // bytes32 merkleRoot
      "0xe501675c033e054c5b1eb881fb4826c38bc03b9871c967fe803d9917e9c61f60",
      // uint160 maxDelayTime
      '300'
    ]
  }

  // const connextMockSource = await deploy('ConnextMock', {
  //   from: deployer,
  //   args: [1735353714],
  //   log: true
  // })

  const distributor = await deploy('CrosschainTrancheVestingMerkle', {
    from: deployer,
    args: config.mumbai,
    
    // local args
  //   args: [
  //     Token.address,
  //     connextMockSource.address,
  //     ONE_MILLION,
  //     'https://example.com',
  //     '10000',
  //     tranches,
  //     '0x25e9b9b2a57375a5b6bad1c2575126b6307c93a5816b1d636a3a2fe07fd88a40',
  //     '0'
  //   ],

    log: true,
  })

  // console.log('Transferring tokens...')
  // const Distributor = await ethers.getContractAt(
  //   'CrosschainTrancheVestingMerkle',
  //   distributor.address
  // )
  // const transferResult = await Token.transfer(
  //   Distributor.address,
  //   await Distributor.total()
  // )

  // await Registry.connect(deployerSigner).addAdmin(deployer);
  // const registerDistributorResult = await Registry.connect(deployerSigner).register(
  //   Distributor.address,
  //   // TODO: generate new interface ids
    
  //   // CrosschainDistributor, IDistributor, ITrancheVesting, AdvancedDistributor, IMerkleSet, ERC20Votes, IVoting: ["0x0cab5d00", "0x616aa576", "0x93cc7303", "0xed7a31af", "0x49590657", "0xe3741f15", "0xc823125b"]
  //   // new interface ids for crosschain/advanced distributor as of 7/28: ["0x1f743925", "0x616aa576", "0x93cc7303", "0xfea5558a", "0x49590657", "0xe3741f15", "0xc823125b"]
  //   // new interface ids for crosschain/advanced distributor as of 7/30:
  //   ["0x4d91fe87", "0x616aa576", "0x93cc7303", "0xac409228", "0x49590657", "0xe3741f15", "0xc823125b"]
  // )
  // const registerTokenResult = await Registry.connect(deployerSigner).register(
  //   Token.address,
  //   // ERC20Votes
  //   ["0xe3741f15"]
  // )

  // const [beneficiary, amount, domain] = MERKLE_TREE.claims[userAddress].data.map(d => d.value)
  //   const { proof } = MERKLE_TREE.claims[userAddress]
    
  //   const txData = [
  //     { name: "recipient", type: "address", value: user },
  //     { name: "recipientDomain", type: "uint32", value: domain },
  //     { name: "beneficiary", type: "address", value: user },
  //     { name: "beneficiaryDomain", type: "uint32", value: domain },
  //     { name: "amount", type: "uint256", value: amount }
  //   ]

  //   const hash = ethers.utils.arrayify(ethers.utils.solidityKeccak256(txData.map(t => t.type), txData.map(t => t.value)))
  //   const signature = await userSigner.signMessage(hash)

  // await Distributor.connect(userSigner).claimBySignature(
  //   user,
  //   domain,
  //   user,
  //   domain,
  //   amount,
  //   signature,
  //   proof
  // )
}

module.exports.tags = ['01', 'crosschain claims']
