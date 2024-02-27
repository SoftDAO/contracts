// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

contract PeriodicTranches {

    struct Tranche {
        uint128 time; // Timestamp upon which the tranche vests
        uint128 vestedFraction; // Fraction of tokens unlockable as basis points
    }

    // Generate an array of tranches based on input parameters
    function generateTranches(uint256 start, uint256 end, uint256 cliff) public pure returns (Tranche[] memory) {
        require(end > start, "End must be greater than start");
        require(cliff >= start && cliff <= end, "Cliff must be between start and end");

        uint256 vestingStart = cliff > start ? cliff : start;
        uint256 vestingDuration = end - vestingStart;

        // Calculate the number of periods as months between vestingStart and end
        // 30.44 days per month, is this accurate? 
        uint256 secondsPerMonth = 30.44 days;
        uint256 periods = vestingDuration / secondsPerMonth;

        // Ensure there is at least one period
        if (periods == 0) {
            periods = 1;
        }

        Tranche[] memory tranches = new Tranche[](periods);
        uint256 periodDuration = vestingDuration / periods;
        uint256 totalVestedFraction = 0;

        for (uint256 i = 0; i < periods; i++) {
            uint256 trancheTime = vestingStart + (periodDuration * (i + 1));
            // What value should we use instead of 10,000? 
            uint256 fractionPerPeriod = (i + 1) * (10000 / periods);
            uint128 vestedFraction = uint128(fractionPerPeriod - totalVestedFraction);
            totalVestedFraction += vestedFraction;

            // Adjust the last tranche to ensure total vested fraction equals 10000
            if (i == periods - 1 && totalVestedFraction != 10000) {
                vestedFraction += (10000 - uint128(totalVestedFraction));
            }

            tranches[i] = Tranche(uint128(trancheTime), vestedFraction);
        }

        return tranches;
    }
}
