// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

contract FakeSequencerUptimeFeed is AggregatorV2V3Interface {
	int256 private answer;
	string private oracleDescription;

	constructor(int256 _answer, string memory _oracleDescription) {
		answer = _answer;
		oracleDescription = _oracleDescription;
	}

	function decimals() external pure returns (uint8) {
		return 8;
	}

	function description() external view returns (string memory) {
		return oracleDescription;
	}

	function version() external pure returns (uint256) {
		return 1;
	}

	function setAnswer(int256 _answer) public {
		answer = _answer;
	}

  function getAnswer(uint256 roundId) external view returns (int256) {
    return answer;
  }

  function getTimestamp(uint256 roundId) external pure returns (uint256) {
    return 1692820776;
  }

  function latestAnswer() external view returns (int256) {
    return answer;
  }

  function latestRound() external pure returns (uint256) {
    return 18446744073709552139;
  }

  function latestTimestamp() external pure returns (uint256) {
    return 1692820776;
  }

	function latestRoundData()
		external
		view
		returns (
			uint80 roundId,
			int256,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (18446744073709552139, answer, 1692820776, 1692820776, 18446744073709552139);
	}

	function getRoundData(uint80 _roundId)
		external
		view
		returns (
			uint80 roundId,
			int256,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (18446744073709552139, answer, 1692820776, 1692820776, 18446744073709552139);
	}
}
