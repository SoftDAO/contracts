// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./FlatPriceSale.sol";
import "./FlatPriceSaleFeeCollectionProxy.sol";

contract FlatPriceSaleFactoryV2_v_2_1 {
	address public immutable implementation;
	string public constant VERSION = "2.0";

	event NewSale(
		address indexed implementation,
		FlatPriceSale_v_2_1 indexed clone,
		FlatPriceSaleFeeCollectionProxy_v_2_1 indexed feeCollectionProxy,
		Config config,
		string baseCurrency,
		IOracleOrL2OracleWithSequencerCheck nativeOracle,
		bool nativePaymentsEnabled
	);

	constructor(address _implementation) {
		implementation = _implementation;
	}

	function newSale(
		address _owner,
		Config calldata _config,
		string calldata _baseCurrency,
		bool _nativePaymentsEnabled,
		IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle,
		IERC20Upgradeable[] calldata tokens,
		IOracleOrL2OracleWithSequencerCheck[] calldata oracles,
		uint8[] calldata decimals,
		address payable treasury
	) external returns (FlatPriceSaleFeeCollectionProxy_v_2_1 feeCollectionProxy) {
		FlatPriceSale_v_2_1 sale = FlatPriceSale_v_2_1(Clones.clone(address(implementation)));

		feeCollectionProxy = new FlatPriceSaleFeeCollectionProxy_v_2_1(sale, treasury);

		emit NewSale(
			implementation,
			sale,
			feeCollectionProxy,
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
