// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "./FlatPriceSale.sol";

contract FlatPriceSaleFeeCollectionProxy_v_2_1 {
	FlatPriceSale_v_2_1 upstream;
	address payable treasury;

	constructor(FlatPriceSale_v_2_1 _upstream, address payable _treasury) {
		upstream = _upstream;
		treasury = _treasury;
	}

	function buyWithTokenAndCollectFee(
		uint256 feeLevel,
		IERC20Upgradeable token,
		uint256 quantity,
		bytes calldata data,
		bytes32[] calldata proof
	) external {
		uint256 feeAmount = quantity * feeLevel / 10000;
		upstream.buyWithToken(token, quantity - feeAmount, data, proof);
		token.transfer(treasury, feeAmount);
	}

	function buyWithNativeAndCollectFee(
		uint256 feeLevel,
		bytes calldata data,
		bytes32[] calldata proof
	) external payable {
		uint256 feeAmount = msg.value * feeLevel / 10000;
		upstream.buyWithNative{ value: msg.value - feeAmount }(data, proof);
		(bool sent, ) = treasury.call{ value: feeAmount }("");
		require(sent, "Failed to pay treasury fee");
	}

	function getUpstream() public view returns (FlatPriceSale_v_2_1) {
		return upstream;
	}
}
