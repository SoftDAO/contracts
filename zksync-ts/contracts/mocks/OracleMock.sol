// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "../interfaces/IOracleOrL2OracleWithSequencerCheck.sol";

contract OracleMock is IOracleOrL2OracleWithSequencerCheck {
	function decimals() external pure returns (uint8) {
		return 8;
	}

	function latestRoundData()
		external
		pure
		returns (
			uint80 roundId,
			int256 answer,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (
			18446744073709590880,
			294670000000,
			1720387410,
			1720387410,
			18446744073709590880
		);
	}
}
