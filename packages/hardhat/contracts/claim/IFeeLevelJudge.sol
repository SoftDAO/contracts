// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IFeeLevelJudge {
	function getFeeLevel(address user) external view returns (uint256);
}
