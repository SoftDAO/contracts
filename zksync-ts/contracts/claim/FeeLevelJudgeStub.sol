// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFeeLevelJudge.sol";

contract FeeLevelJudgeStub is IFeeLevelJudge {
	uint256 feeLevel;

	constructor(uint256 _feeLevel) {
		feeLevel = _feeLevel;
	}

	function getFeeLevel(address) external view returns (uint256) {
		return feeLevel;
	}
}
