// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./INetworkConfig.sol";

contract NetworkConfig is OwnableUpgradeable, INetworkConfig {
	address payable public feeRecipient;
	address public stakingAddress;
	bool private initialized;
	address public nativeTokenPriceOracleAddress;

	function initialize(address payable _feeRecipient, address _stakingAddress, address _nativeTokenPriceOracleAddress) public initializer {
		require(!initialized, "Contract instance has already been initialized");
		initialized = true;
		feeRecipient = _feeRecipient;
		stakingAddress = _stakingAddress;
		nativeTokenPriceOracleAddress = _nativeTokenPriceOracleAddress;
		__Ownable_init();
	}

	function getFeeRecipient() external view returns (address payable) {
		return feeRecipient;
	}

	function getStakingAddress() external view returns (address) {
		return stakingAddress;
	}

	function getNativeTokenPriceOracleAddress() external view returns (address) {
		return nativeTokenPriceOracleAddress;
	}
}
