// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./INetworkConfig.sol";

contract NetworkConfig is OwnableUpgradeable, INetworkConfig {
	address payable public feeRecipient;
	bool private initialized;

	function initialize(address payable _feeRecipient) public initializer {
		require(!initialized, "Contract instance has already been initialized");
		initialized = true;
		feeRecipient = _feeRecipient;
		__Ownable_init();
	}

	function getFeeRecipient() external view returns (address payable) {
		return feeRecipient;
	}
}
