// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FlatPriceSale.sol";

contract FlatPriceSaleFactory_v_3 is Ownable {
	address public implementation;
	string public constant VERSION = "3.0";

	event NewSale(
		address indexed implementation,
		FlatPriceSale_v_3 indexed clone,
		Config config,
		string baseCurrency,
		IOracleOrL2OracleWithSequencerCheck nativeOracle,
		uint256 nativeOracleHeartbeat,
		bool nativePaymentsEnabled
	);

	constructor(address _implementation) {
		implementation = _implementation;
	}

	function upgradeFutureSales(address _implementation) external onlyOwner() {
		implementation = _implementation;
	}

	function newSale(
		address _owner,
		Config calldata _config,
		string calldata _baseCurrency,
		bool _nativePaymentsEnabled,
		IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle,
		uint256 _nativeTokenPriceOracleHeartbeat,
		IERC20Upgradeable[] calldata tokens,
		IOracleOrL2OracleWithSequencerCheck[] calldata oracles,
		uint256[] calldata oracleHeartbeats,
		uint8[] calldata decimals
	) external returns (FlatPriceSale_v_3 sale) {
		sale = FlatPriceSale_v_3(Clones.clone(address(implementation)));

		emit NewSale(
			implementation,
			sale,
			_config,
			_baseCurrency,
			_nativeTokenPriceOracle,
			_nativeTokenPriceOracleHeartbeat,
			_nativePaymentsEnabled
		);

		sale.initialize(
			_owner,
			_config,
			_baseCurrency,
			_nativePaymentsEnabled,
			_nativeTokenPriceOracle,
			_nativeTokenPriceOracleHeartbeat,
			tokens,
			oracles,
			oracleHeartbeats,
			decimals
		);
	}
}
