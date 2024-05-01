// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct Tranche {
	uint128 time; // block.timestamp upon which the tranche vests
	uint128 vestedFraction; // fraction of tokens unlockable as basis points (e.g. 100% of vested tokens is the fraction denominator, defaulting to 10000)
}

interface IPerAddressTrancheVesting {}
