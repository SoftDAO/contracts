// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

contract L2OracleWithSequencerCheck {
    AggregatorV2V3Interface internal dataFeed;
    AggregatorV2V3Interface internal sequencerUptimeFeed;

    uint256 private constant GRACE_PERIOD_TIME = 3600;

    error SequencerDown();
    error GracePeriodNotOver();

    /**
     * For a list of available Sequencer Uptime Feed proxy addresses, see:
     * https://docs.chain.link/docs/data-feeds/l2-sequencer-feeds
     */
    constructor(address _dataFeed, address _sequencerUptimeFeed) {
        dataFeed = AggregatorV2V3Interface(
            _dataFeed
        );
        sequencerUptimeFeed = AggregatorV2V3Interface(
            _sequencerUptimeFeed
        );
    }

    // Check the sequencer status and return the latest data
    function latestRoundData() public view returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) {
        (
            /*uint80 roundID*/,
            int256 _answer,
            uint256 _startedAt,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = sequencerUptimeFeed.latestRoundData();

        // Answer == 0: Sequencer is up
        // Answer == 1: Sequencer is down
        bool isSequencerUp = _answer == 0;
        if (!isSequencerUp) {
            revert SequencerDown();
        }

        // Make sure the grace period has passed after the
        // sequencer is back up.
        uint256 timeSinceUp = block.timestamp - _startedAt;
        if (timeSinceUp <= GRACE_PERIOD_TIME) {
            revert GracePeriodNotOver();
        }

        return dataFeed.latestRoundData();
    }
}
