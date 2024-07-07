// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./INetworkConfig.sol";

contract NetworkConfig is OwnableUpgradeable, INetworkConfig {
	address payable public feeRecipient;
	address public stakingAddress;
	bool private initialized;

	function initialize(address payable _feeRecipient, address _stakingAddress) public initializer {
		require(!initialized, "Contract instance has already been initialized");
		initialized = true;
		feeRecipient = _feeRecipient;
		stakingAddress = _stakingAddress;
		__Ownable_init();
	}

	function getFeeRecipient() external view returns (address payable) {
		return feeRecipient;
	}

	function getStakingAddress() external view returns (address) {
		return stakingAddress;
	}
}
