// SPDX-License-Identifier: BSL-1.1
pragma solidity 0.8.16;

interface IVesting {
	function getVestedFraction(
		address, /*beneficiary*/
		uint256 time // time is in seconds past the epoch (e.g. block.timestamp)
	) external returns (uint256);
}
