import { TypedMap } from "@graphprotocol/graph-ts"

// new interfaces
class currentInterfacesClass extends TypedMap<string, string>{
  constructor(){
	  super()

	  // map interface names to ids AND ids to names

    this.set("Sweepable", "0xac1d7eef")
    this.set("0xac1d7eef", "Sweepable") 

    this.set("Registry", "0xe711948a")
    this.set("0xe711948a", "Registry") 

    this.set("FairQueue", "0xb0034251")
    this.set("0xb0034251", "FairQueue") 

    this.set("BatchSendEth", "0xefd5a170")
    this.set("0xefd5a170", "BatchSendEth") 

    this.set("Trader", "0x326818a6")
    this.set("0x326818a6", "Trader") 

    this.set("MyERC20Votes", "0xe3741f15")
    this.set("0xe3741f15", "MyERC20Votes") 

    this.set("FakeUSDC", "0x0929daa4")
    this.set("0x0929daa4", "FakeUSDC") 

    this.set("FakeUSDT", "0x0929daa4")
    this.set("0x0929daa4", "FakeUSDT") 

    this.set("GenericERC20", "0x0929daa4")
    this.set("0x0929daa4", "GenericERC20") 

    this.set("Sale", "0xbbe28340")
    this.set("0xbbe28340", "Sale") 

    this.set("FlatPriceSaleFactory", "0xfcb73502")
    this.set("0xfcb73502", "FlatPriceSaleFactory") 

    this.set("FlatPriceSale", "0x7a6d298d")
    this.set("0x7a6d298d", "FlatPriceSale") 

    this.set("SaleManager_v_1_3", "0xfe5511cb")
    this.set("0xfe5511cb", "SaleManager_v_1_3") 

    this.set("ISaleManager_v_1_3", "0xa9c30ae4")
    this.set("0xa9c30ae4", "ISaleManager_v_1_3") 

    this.set("SaleManager_v_1_2", "0x2a8703f3")
    this.set("0x2a8703f3", "SaleManager_v_1_2") 

    this.set("ClaimManager", "0x4b4b25dd")
    this.set("0x4b4b25dd", "ClaimManager") 

    this.set("SaleManager_v_1_0", "0x9e0385fb")
    this.set("0x9e0385fb", "SaleManager_v_1_0") 

    this.set("HashflowRouterMock", "0xef346465")
    this.set("0xef346465", "HashflowRouterMock") 

    this.set("GovernorMultiSourceUpgradeableMock", "0xba953ecc")
    this.set("0xba953ecc", "GovernorMultiSourceUpgradeableMock") 

    this.set("FakeChainlinkOracle", "0xeaa42e80")
    this.set("0xeaa42e80", "FakeChainlinkOracle") 

    this.set("FakeEthOracle", "0xeaa42e80")
    this.set("0xeaa42e80", "FakeEthOracle") 

    this.set("FakeUsdcOracle", "0xeaa42e80")
    this.set("0xeaa42e80", "FakeUsdcOracle") 

    this.set("FakeUsdtOracle", "0xeaa42e80")
    this.set("0xeaa42e80", "FakeUsdtOracle") 

    this.set("ConnextMock", "0x6b83fae1")
    this.set("0x6b83fae1", "ConnextMock") 

    this.set("IXReceiver", "0xfd614f41")
    this.set("0xfd614f41", "IXReceiver") 

    this.set("IVoting", "0xc823125b")
    this.set("0xc823125b", "IVoting") 

    this.set("IVesting", "0xb6d8f79f")
    this.set("0xb6d8f79f", "IVesting") 

    this.set("ITrancheVesting", "0x93cc7303")
    this.set("0x93cc7303", "ITrancheVesting") 

    this.set("IPriceTierVesting", "0x71f30ab2")
    this.set("0x71f30ab2", "IPriceTierVesting") 

    this.set("IMerkleSet", "0x49590657")
    this.set("0x49590657", "IMerkleSet") 

    this.set("IHashflowQuote", "0x1a33ceb6")
    this.set("0x1a33ceb6", "IHashflowQuote") 

    this.set("IERC20Extended", "0x070bce60")
    this.set("0x070bce60", "IERC20Extended") 

    this.set("IDistributor", "0x616aa576")
    this.set("0x616aa576", "IDistributor") 

    this.set("ICrosschain", "0x9c0bea37")
    this.set("0x9c0bea37", "ICrosschain") 

    this.set("IContinuousVesting", "0x7c13a6ee")
    this.set("0x7c13a6ee", "IContinuousVesting") 

    this.set("IConnext", "0x4a5364a0")
    this.set("0x4a5364a0", "IConnext") 

    this.set("IAdjustable", "0x2c597ff5")
    this.set("0x2c597ff5", "IAdjustable") 

    this.set("MyTimelockControllerUpgradeable", "0x525b4f69")
    this.set("0x525b4f69", "MyTimelockControllerUpgradeable") 

    this.set("GovernorVotesMultiSourceUpgradeable", "0x70c0c377")
    this.set("0x70c0c377", "GovernorVotesMultiSourceUpgradeable") 

    this.set("GovernorMultiSourceUpgradeable", "0xba953ecc")
    this.set("0xba953ecc", "GovernorMultiSourceUpgradeable") 

    this.set("TrancheVesting", "0x80565b75")
    this.set("0x80565b75", "TrancheVesting") 

    this.set("PriceTierVesting", "0x626922c4")
    this.set("0x626922c4", "PriceTierVesting") 

    this.set("MerkleSet", "0x49590657")
    this.set("0x49590657", "MerkleSet") 

    this.set("Distributor", "0x3f86fadd")
    this.set("0x3f86fadd", "Distributor") 

    this.set("CrosschainMerkleDistributor", "0xe7f7369b")
    this.set("0xe7f7369b", "CrosschainMerkleDistributor") 

    this.set("CrosschainDistributor", "0xf24b44d9")
    this.set("0xf24b44d9", "CrosschainDistributor") 

    this.set("ContinuousVesting", "0x6f898e98")
    this.set("0x6f898e98", "ContinuousVesting") 

    this.set("AdvancedDistributor", "0x139a2876")
    this.set("0x139a2876", "AdvancedDistributor") 

    this.set("TrancheVestingSale_2_0", "0xc67f018a")
    this.set("0xc67f018a", "TrancheVestingSale_2_0") 

    this.set("TrancheVestingSale_1_3", "0x426cedbb")
    this.set("0x426cedbb", "TrancheVestingSale_1_3") 

    this.set("TrancheVestingMerkle", "0xf38f5d61")
    this.set("0xf38f5d61", "TrancheVestingMerkle") 

    this.set("Satellite", "0xe01333e6")
    this.set("0xe01333e6", "Satellite") 

    this.set("PriceTierVestingSale_2_0", "0x2440783b")
    this.set("0x2440783b", "PriceTierVestingSale_2_0") 

    this.set("PriceTierVestingMerkle", "0x11b024d0")
    this.set("0x11b024d0", "PriceTierVestingMerkle") 

    this.set("CrosschainTrancheVestingMerkle", "0x743b4598")
    this.set("0x743b4598", "CrosschainTrancheVestingMerkle") 

    this.set("CrosschainContinuousVestingMerkle", "0x9be49075")
    this.set("0x9be49075", "CrosschainContinuousVestingMerkle") 

    this.set("ContinuousVestingMerkle", "0x1c50888c")
    this.set("0x1c50888c", "ContinuousVestingMerkle") 

    this.set("BasicDistributor", "0x0d1968ec")
    this.set("0x0d1968ec", "BasicDistributor") 

    this.set("IERC165Upgradeable", "0x01ffc9a7")
    this.set("0x01ffc9a7", "IERC165Upgradeable") 

    this.set("ERC165Upgradeable", "0x01ffc9a7")
    this.set("0x01ffc9a7", "ERC165Upgradeable") 

    this.set("EscrowUpgradeable", "0xce0715a8")
    this.set("0xce0715a8", "EscrowUpgradeable") 

    this.set("IERC721ReceiverUpgradeable", "0x150b7a02")
    this.set("0x150b7a02", "IERC721ReceiverUpgradeable") 

    this.set("IERC20PermitUpgradeable", "0x9d8ff7da")
    this.set("0x9d8ff7da", "IERC20PermitUpgradeable") 

    this.set("IERC20Upgradeable", "0x36372b07")
    this.set("0x36372b07", "IERC20Upgradeable") 

    this.set("IERC1155ReceiverUpgradeable", "0x4fdcdb47")
    this.set("0x4fdcdb47", "IERC1155ReceiverUpgradeable") 

    this.set("PullPaymentUpgradeable", "0xd32bc7b5")
    this.set("0xd32bc7b5", "PullPaymentUpgradeable") 

    this.set("UUPSUpgradeable", "0x2b96ad4d")
    this.set("0x2b96ad4d", "UUPSUpgradeable") 

    this.set("IBeaconUpgradeable", "0x5c60da1b")
    this.set("0x5c60da1b", "IBeaconUpgradeable") 

    this.set("IERC1822ProxiableUpgradeable", "0x52d1902d")
    this.set("0x52d1902d", "IERC1822ProxiableUpgradeable") 

    this.set("IVotesUpgradeable", "0xe90fb3f6")
    this.set("0xe90fb3f6", "IVotesUpgradeable") 

    this.set("IGovernorTimelockUpgradeable", "0x1644ec25")
    this.set("0x1644ec25", "IGovernorTimelockUpgradeable") 

    this.set("GovernorVotesUpgradeable", "0x59453aa7")
    this.set("0x59453aa7", "GovernorVotesUpgradeable") 

    this.set("GovernorVotesQuorumFractionUpgradeable", "0x0fc00e7a")
    this.set("0x0fc00e7a", "GovernorVotesQuorumFractionUpgradeable") 

    this.set("GovernorTimelockControlUpgradeable", "0x63bffb30")
    this.set("0x63bffb30", "GovernorTimelockControlUpgradeable") 

    this.set("GovernorCountingSimpleUpgradeable", "0xf1069251")
    this.set("0xf1069251", "GovernorCountingSimpleUpgradeable") 

    this.set("TimelockControllerUpgradeable", "0x2de736af")
    this.set("0x2de736af", "TimelockControllerUpgradeable") 

    this.set("IGovernorUpgradeable", "0x7822b0c8")
    this.set("0x7822b0c8", "IGovernorUpgradeable") 

    this.set("GovernorUpgradeable", "0xa5496ecd")
    this.set("0xa5496ecd", "GovernorUpgradeable") 

    this.set("OwnableUpgradeable", "0x0e083076")
    this.set("0x0e083076", "OwnableUpgradeable") 

    this.set("IAccessControlUpgradeable", "0x7965db0b")
    this.set("0x7965db0b", "IAccessControlUpgradeable") 

    this.set("AccessControlUpgradeable", "0xda8def73")
    this.set("0xda8def73", "AccessControlUpgradeable") 

    this.set("IERC165", "0x01ffc9a7")
    this.set("0x01ffc9a7", "IERC165") 

    this.set("ERC165", "0x01ffc9a7")
    this.set("0x01ffc9a7", "ERC165") 

    this.set("Escrow", "0x4f2ee9b4")
    this.set("0x4f2ee9b4", "Escrow") 

    this.set("IERC20Permit", "0x9d8ff7da")
    this.set("0x9d8ff7da", "IERC20Permit") 

    this.set("ERC20Permit", "0x94a62d7e")
    this.set("0x94a62d7e", "ERC20Permit") 

    this.set("IERC20Metadata", "0x942e8b22")
    this.set("0x942e8b22", "IERC20Metadata") 

    this.set("ERC20Votes", "0xe3741f15")
    this.set("0xe3741f15", "ERC20Votes") 

    this.set("IERC20", "0x36372b07")
    this.set("0x36372b07", "IERC20") 

    this.set("ERC20", "0x0929daa4")
    this.set("0x0929daa4", "ERC20") 

    this.set("PullPayment", "0xd32bc7b5")
    this.set("0xd32bc7b5", "PullPayment") 

    this.set("IVotes", "0xe90fb3f6")
    this.set("0xe90fb3f6", "IVotes") 

    this.set("Ownable", "0x0e083076")
    this.set("0x0e083076", "Ownable") 

    this.set("IAccessControl", "0x7965db0b")
    this.set("0x7965db0b", "IAccessControl") 

    this.set("AccessControl", "0xda8def73")
    this.set("0xda8def73", "AccessControl") 

    this.set("AggregatorV3Interface", "0x73851258")
    this.set("0x73851258", "AggregatorV3Interface") 
  }

  // convenience getters to emulate an object in AssemblyScript 

  get Sweepable(): string {
    let value = this.get("Sweepable")
	  return value!.toString()
  }

  get Registry(): string {
    let value = this.get("Registry")
	  return value!.toString()
  }

  get FairQueue(): string {
    let value = this.get("FairQueue")
	  return value!.toString()
  }

  get BatchSendEth(): string {
    let value = this.get("BatchSendEth")
	  return value!.toString()
  }

  get Trader(): string {
    let value = this.get("Trader")
	  return value!.toString()
  }

  get MyERC20Votes(): string {
    let value = this.get("MyERC20Votes")
	  return value!.toString()
  }

  get FakeUSDC(): string {
    let value = this.get("FakeUSDC")
	  return value!.toString()
  }

  get FakeUSDT(): string {
    let value = this.get("FakeUSDT")
	  return value!.toString()
  }

  get GenericERC20(): string {
    let value = this.get("GenericERC20")
	  return value!.toString()
  }

  get Sale(): string {
    let value = this.get("Sale")
	  return value!.toString()
  }

  get FlatPriceSaleFactory(): string {
    let value = this.get("FlatPriceSaleFactory")
	  return value!.toString()
  }

  get FlatPriceSale(): string {
    let value = this.get("FlatPriceSale")
	  return value!.toString()
  }

  get SaleManager_v_1_3(): string {
    let value = this.get("SaleManager_v_1_3")
	  return value!.toString()
  }

  get ISaleManager_v_1_3(): string {
    let value = this.get("ISaleManager_v_1_3")
	  return value!.toString()
  }

  get SaleManager_v_1_2(): string {
    let value = this.get("SaleManager_v_1_2")
	  return value!.toString()
  }

  get ClaimManager(): string {
    let value = this.get("ClaimManager")
	  return value!.toString()
  }

  get SaleManager_v_1_0(): string {
    let value = this.get("SaleManager_v_1_0")
	  return value!.toString()
  }

  get HashflowRouterMock(): string {
    let value = this.get("HashflowRouterMock")
	  return value!.toString()
  }

  get GovernorMultiSourceUpgradeableMock(): string {
    let value = this.get("GovernorMultiSourceUpgradeableMock")
	  return value!.toString()
  }

  get FakeChainlinkOracle(): string {
    let value = this.get("FakeChainlinkOracle")
	  return value!.toString()
  }

  get FakeEthOracle(): string {
    let value = this.get("FakeEthOracle")
	  return value!.toString()
  }

  get FakeUsdcOracle(): string {
    let value = this.get("FakeUsdcOracle")
	  return value!.toString()
  }

  get FakeUsdtOracle(): string {
    let value = this.get("FakeUsdtOracle")
	  return value!.toString()
  }

  get ConnextMock(): string {
    let value = this.get("ConnextMock")
	  return value!.toString()
  }

  get IXReceiver(): string {
    let value = this.get("IXReceiver")
	  return value!.toString()
  }

  get IVoting(): string {
    let value = this.get("IVoting")
	  return value!.toString()
  }

  get IVesting(): string {
    let value = this.get("IVesting")
	  return value!.toString()
  }

  get ITrancheVesting(): string {
    let value = this.get("ITrancheVesting")
	  return value!.toString()
  }

  get IPriceTierVesting(): string {
    let value = this.get("IPriceTierVesting")
	  return value!.toString()
  }

  get IMerkleSet(): string {
    let value = this.get("IMerkleSet")
	  return value!.toString()
  }

  get IHashflowQuote(): string {
    let value = this.get("IHashflowQuote")
	  return value!.toString()
  }

  get IERC20Extended(): string {
    let value = this.get("IERC20Extended")
	  return value!.toString()
  }

  get IDistributor(): string {
    let value = this.get("IDistributor")
	  return value!.toString()
  }

  get ICrosschain(): string {
    let value = this.get("ICrosschain")
	  return value!.toString()
  }

  get IContinuousVesting(): string {
    let value = this.get("IContinuousVesting")
	  return value!.toString()
  }

  get IConnext(): string {
    let value = this.get("IConnext")
	  return value!.toString()
  }

  get IAdjustable(): string {
    let value = this.get("IAdjustable")
	  return value!.toString()
  }

  get MyTimelockControllerUpgradeable(): string {
    let value = this.get("MyTimelockControllerUpgradeable")
	  return value!.toString()
  }

  get GovernorVotesMultiSourceUpgradeable(): string {
    let value = this.get("GovernorVotesMultiSourceUpgradeable")
	  return value!.toString()
  }

  get GovernorMultiSourceUpgradeable(): string {
    let value = this.get("GovernorMultiSourceUpgradeable")
	  return value!.toString()
  }

  get TrancheVesting(): string {
    let value = this.get("TrancheVesting")
	  return value!.toString()
  }

  get PriceTierVesting(): string {
    let value = this.get("PriceTierVesting")
	  return value!.toString()
  }

  get MerkleSet(): string {
    let value = this.get("MerkleSet")
	  return value!.toString()
  }

  get Distributor(): string {
    let value = this.get("Distributor")
	  return value!.toString()
  }

  get CrosschainMerkleDistributor(): string {
    let value = this.get("CrosschainMerkleDistributor")
	  return value!.toString()
  }

  get CrosschainDistributor(): string {
    let value = this.get("CrosschainDistributor")
	  return value!.toString()
  }

  get ContinuousVesting(): string {
    let value = this.get("ContinuousVesting")
	  return value!.toString()
  }

  get AdvancedDistributor(): string {
    let value = this.get("AdvancedDistributor")
	  return value!.toString()
  }

  get TrancheVestingSale_2_0(): string {
    let value = this.get("TrancheVestingSale_2_0")
	  return value!.toString()
  }

  get TrancheVestingSale_1_3(): string {
    let value = this.get("TrancheVestingSale_1_3")
	  return value!.toString()
  }

  get TrancheVestingMerkle(): string {
    let value = this.get("TrancheVestingMerkle")
	  return value!.toString()
  }

  get Satellite(): string {
    let value = this.get("Satellite")
	  return value!.toString()
  }

  get PriceTierVestingSale_2_0(): string {
    let value = this.get("PriceTierVestingSale_2_0")
	  return value!.toString()
  }

  get PriceTierVestingMerkle(): string {
    let value = this.get("PriceTierVestingMerkle")
	  return value!.toString()
  }

  get CrosschainTrancheVestingMerkle(): string {
    let value = this.get("CrosschainTrancheVestingMerkle")
	  return value!.toString()
  }

  get CrosschainContinuousVestingMerkle(): string {
    let value = this.get("CrosschainContinuousVestingMerkle")
	  return value!.toString()
  }

  get ContinuousVestingMerkle(): string {
    let value = this.get("ContinuousVestingMerkle")
	  return value!.toString()
  }

  get BasicDistributor(): string {
    let value = this.get("BasicDistributor")
	  return value!.toString()
  }

  get IERC165Upgradeable(): string {
    let value = this.get("IERC165Upgradeable")
	  return value!.toString()
  }

  get ERC165Upgradeable(): string {
    let value = this.get("ERC165Upgradeable")
	  return value!.toString()
  }

  get EscrowUpgradeable(): string {
    let value = this.get("EscrowUpgradeable")
	  return value!.toString()
  }

  get IERC721ReceiverUpgradeable(): string {
    let value = this.get("IERC721ReceiverUpgradeable")
	  return value!.toString()
  }

  get IERC20PermitUpgradeable(): string {
    let value = this.get("IERC20PermitUpgradeable")
	  return value!.toString()
  }

  get IERC20Upgradeable(): string {
    let value = this.get("IERC20Upgradeable")
	  return value!.toString()
  }

  get IERC1155ReceiverUpgradeable(): string {
    let value = this.get("IERC1155ReceiverUpgradeable")
	  return value!.toString()
  }

  get PullPaymentUpgradeable(): string {
    let value = this.get("PullPaymentUpgradeable")
	  return value!.toString()
  }

  get UUPSUpgradeable(): string {
    let value = this.get("UUPSUpgradeable")
	  return value!.toString()
  }

  get IBeaconUpgradeable(): string {
    let value = this.get("IBeaconUpgradeable")
	  return value!.toString()
  }

  get IERC1822ProxiableUpgradeable(): string {
    let value = this.get("IERC1822ProxiableUpgradeable")
	  return value!.toString()
  }

  get IVotesUpgradeable(): string {
    let value = this.get("IVotesUpgradeable")
	  return value!.toString()
  }

  get IGovernorTimelockUpgradeable(): string {
    let value = this.get("IGovernorTimelockUpgradeable")
	  return value!.toString()
  }

  get GovernorVotesUpgradeable(): string {
    let value = this.get("GovernorVotesUpgradeable")
	  return value!.toString()
  }

  get GovernorVotesQuorumFractionUpgradeable(): string {
    let value = this.get("GovernorVotesQuorumFractionUpgradeable")
	  return value!.toString()
  }

  get GovernorTimelockControlUpgradeable(): string {
    let value = this.get("GovernorTimelockControlUpgradeable")
	  return value!.toString()
  }

  get GovernorCountingSimpleUpgradeable(): string {
    let value = this.get("GovernorCountingSimpleUpgradeable")
	  return value!.toString()
  }

  get TimelockControllerUpgradeable(): string {
    let value = this.get("TimelockControllerUpgradeable")
	  return value!.toString()
  }

  get IGovernorUpgradeable(): string {
    let value = this.get("IGovernorUpgradeable")
	  return value!.toString()
  }

  get GovernorUpgradeable(): string {
    let value = this.get("GovernorUpgradeable")
	  return value!.toString()
  }

  get OwnableUpgradeable(): string {
    let value = this.get("OwnableUpgradeable")
	  return value!.toString()
  }

  get IAccessControlUpgradeable(): string {
    let value = this.get("IAccessControlUpgradeable")
	  return value!.toString()
  }

  get AccessControlUpgradeable(): string {
    let value = this.get("AccessControlUpgradeable")
	  return value!.toString()
  }

  get IERC165(): string {
    let value = this.get("IERC165")
	  return value!.toString()
  }

  get ERC165(): string {
    let value = this.get("ERC165")
	  return value!.toString()
  }

  get Escrow(): string {
    let value = this.get("Escrow")
	  return value!.toString()
  }

  get IERC20Permit(): string {
    let value = this.get("IERC20Permit")
	  return value!.toString()
  }

  get ERC20Permit(): string {
    let value = this.get("ERC20Permit")
	  return value!.toString()
  }

  get IERC20Metadata(): string {
    let value = this.get("IERC20Metadata")
	  return value!.toString()
  }

  get ERC20Votes(): string {
    let value = this.get("ERC20Votes")
	  return value!.toString()
  }

  get IERC20(): string {
    let value = this.get("IERC20")
	  return value!.toString()
  }

  get ERC20(): string {
    let value = this.get("ERC20")
	  return value!.toString()
  }

  get PullPayment(): string {
    let value = this.get("PullPayment")
	  return value!.toString()
  }

  get IVotes(): string {
    let value = this.get("IVotes")
	  return value!.toString()
  }

  get Ownable(): string {
    let value = this.get("Ownable")
	  return value!.toString()
  }

  get IAccessControl(): string {
    let value = this.get("IAccessControl")
	  return value!.toString()
  }

  get AccessControl(): string {
    let value = this.get("AccessControl")
	  return value!.toString()
  }

  get AggregatorV3Interface(): string {
    let value = this.get("AggregatorV3Interface")
	  return value!.toString()
  }
}

export const currentInterfaces = new currentInterfacesClass


// legacy interfaces
class legacyInterfacesClass extends TypedMap<string, string>{
  constructor(){
	  super()

	  // map interface names to ids AND ids to names

    this.set("IDistributor", "0xab85ea0e")
    this.set("0xab85ea0e", "IDistributor") 

    this.set("AdvancedDistributor", "0xfc57b782")
    this.set("0xfc57b782", "AdvancedDistributor") 

    this.set("IContinuousVesting", "0x09e04257")
    this.set("0x09e04257", "IContinuousVesting") 

    this.set("IMerkleSet", "0x35ef410e")
    this.set("0x35ef410e", "IMerkleSet") 
  }

  // convenience getters to emulate an object in AssemblyScript 

  get IDistributor(): string {
    let value = this.get("IDistributor")
	  return value!.toString()
  }

  get AdvancedDistributor(): string {
    let value = this.get("AdvancedDistributor")
	  return value!.toString()
  }

  get IContinuousVesting(): string {
    let value = this.get("IContinuousVesting")
	  return value!.toString()
  }

  get IMerkleSet(): string {
    let value = this.get("IMerkleSet")
	  return value!.toString()
  }
}

export const legacyInterfaces = new legacyInterfacesClass

