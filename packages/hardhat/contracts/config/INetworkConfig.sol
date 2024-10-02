// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface INetworkConfig {
	function getFeeRecipient() external view returns (address payable);
	function getStakingAddress() external view returns (address);
	function getNativeTokenPriceOracleAddress() external view returns (address);
	function getNativeTokenPriceOracleHeartbeat() external view returns (uint256);
}
