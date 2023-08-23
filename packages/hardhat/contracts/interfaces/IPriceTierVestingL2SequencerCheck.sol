// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./IOracleWithSequencerCheck.sol";

// time and vested fraction must monotonically increase in the tranche array
struct PriceTier {
	uint128 price; // block.timestamp upon which the tranche vests
	uint128 vestedFraction; // fraction of tokens unlockable
}

interface IPriceTierVestingL2SequencerCheck {
	event SetPriceTierConfig(
		uint256 start,
		uint256 end,
		IOracleWithSequencerCheck oracle,
		PriceTier[] tiers
	);

	function getStart() external view returns (uint256);

	function getEnd() external view returns (uint256);

	function getOracle() external view returns (IOracleWithSequencerCheck);

	function getPriceTier(uint256 i) external view returns (PriceTier memory);

	function getPriceTiers() external view returns (PriceTier[] memory);

	function setPriceTiers(
		uint256 _start,
		uint256 _end,
		IOracleWithSequencerCheck _oracle,
		PriceTier[] memory _tiers
	) external;
}
