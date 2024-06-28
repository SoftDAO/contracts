// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FlatPriceSale.sol";
import "../../config/INetworkConfig.sol";

contract FlatPriceSaleFactory_v_3 is Ownable {
	address public implementation;
	string public constant VERSION = "3.0";
	INetworkConfig networkConfig;

	event NewSale(
		address indexed implementation,
		FlatPriceSale_v_3 indexed clone,
		Config config,
		string baseCurrency,
		IOracleOrL2OracleWithSequencerCheck nativeOracle,
		bool nativePaymentsEnabled
	);

	constructor(address _implementation, address _networkConfig) {
		implementation = _implementation;
		networkConfig = INetworkConfig(_networkConfig);
	}

	function upgradeFutureSales(address _implementation) external onlyOwner() {
		implementation = _implementation;
	}

	function updateNetworkConfig(address _networkConfig) external onlyOwner() {
		networkConfig = INetworkConfig(_networkConfig);
	}

	function newSale(
		address _owner,
		Config calldata _config,
		string calldata _baseCurrency,
		bool _nativePaymentsEnabled,
		IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle,
		IERC20Upgradeable[] calldata tokens,
		IOracleOrL2OracleWithSequencerCheck[] calldata oracles,
		uint8[] calldata decimals
	) external returns (FlatPriceSale_v_3 sale) {
		sale = FlatPriceSale_v_3(Clones.clone(address(implementation)));

		emit NewSale(
			implementation,
			sale,
			_config,
			_baseCurrency,
			_nativeTokenPriceOracle,
			_nativePaymentsEnabled
		);

		sale.initialize(
			_owner,
			_config,
			_baseCurrency,
			_nativePaymentsEnabled,
			_nativeTokenPriceOracle,
			tokens,
			oracles,
			decimals
		);
	}
}
