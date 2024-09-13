// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./INetworkConfig.sol";

contract NetworkConfig is OwnableUpgradeable, INetworkConfig {
	address payable public feeRecipient;
	address public stakingAddress;
	bool private initialized;
	address public nativeTokenPriceOracleAddress;
	uint256 public nativeTokenPriceOracleHeartbeat;
	address public accessAuthorityAddress;

	function initialize(address payable _feeRecipient, address _stakingAddress, address _nativeTokenPriceOracleAddress, uint256 _nativeTokenPriceOracleHeartbeat, address _accessAuthorityAddress) public initializer {
		require(!initialized, "Contract instance has already been initialized");
		initialized = true;
		feeRecipient = _feeRecipient;
		stakingAddress = _stakingAddress;
		nativeTokenPriceOracleAddress = _nativeTokenPriceOracleAddress;
		nativeTokenPriceOracleHeartbeat = _nativeTokenPriceOracleHeartbeat;
		accessAuthorityAddress = _accessAuthorityAddress;
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

	function getNativeTokenPriceOracleHeartbeat() external view returns (uint256) {
		return nativeTokenPriceOracleHeartbeat;
	}

	function getAccessAuthorityAddress() external view returns (address) {
		return accessAuthorityAddress;
	}
}
