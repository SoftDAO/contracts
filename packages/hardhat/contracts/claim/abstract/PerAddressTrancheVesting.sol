// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AdvancedDistributor } from './AdvancedDistributor.sol';
import { IPerAddressTrancheVesting, Tranche } from '../../interfaces/IPerAddressTrancheVesting.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "hardhat/console.sol";

/**
 * @title TrancheVesting
 * @notice Distributes funds to beneficiaries over time in tranches.
 */
abstract contract PerAddressTrancheVesting is AdvancedDistributor, IPerAddressTrancheVesting {
  // time and vested fraction must monotonically increase in the tranche array
  Tranche[] private tranches;

  constructor(
    IERC20 _token,
    uint256 _total,
    string memory _uri,
    uint256 _voteFactor,
    uint256 _start,
    uint256 _end,
    uint256 _cliff,
    uint160 _maxDelayTime,
    uint160 _salt
  ) AdvancedDistributor(_token, _total, _uri, _voteFactor, 10000, _maxDelayTime, _salt) {
    // tranches can be set in the constructor or in setTranches()
    _setTranches(_start, _end, _cliff);
  }

	/**
	* @notice Get the vested fraction for a beneficiary at a given time.
	* @dev Before the first tranche time, the vested fraction will be 0. At times between
	* tranche_i and tranche_i+1, the vested fraction will be tranche_i+1's vested fraction.
	* After the last tranche time, the vested fraction will be the fraction denominator.
	*/
  function getVestedFraction(
    address beneficiary,
    uint256 time,
    uint256 _start,
    uint256 _end,
    uint256 _cliff
  ) public view returns (uint256) {
    // tranches = calculate the the tranche from start, end, cliff from record, record.start, record.end, record.cliff,
    // calculateTranche(beneficiary, record);

    uint256 delay = getFairDelayTime(beneficiary);
    for (uint256 i = tranches.length; i != 0; ) {
      unchecked {
        --i;
      }

      if (time - delay > tranches[i].time) {
        return tranches[i].vestedFraction;
      }
    }

    return 0;
  }

	// Get a single tranche
  function getTranche(uint256 i) public view returns (Tranche memory) {
    return tranches[i];
  }

	// Get all tranches
  function getTranches() public view returns (Tranche[] memory) {
    return tranches;
  }

  /**
   * @dev Tranches can be updated at any time. The quantity of tokens a user can claim is based on the
	 * claimable quantity at the time of the claim and the quantity of tokens already claimed by the user.
   */
  function _setTranches(
    uint256 _start,
    uint256 _end,
    uint256 _cliff
  ) private {

    // TODO: create tranches based off start, end, and cliff
    Tranche[] memory _tranches = new Tranche[](3);

    require(_tranches.length != 0, 'tranches required');

    delete tranches;

    uint128 lastTime = 0;
    uint128 lastVestedFraction = 0;

    for (uint256 i = 0; i < _tranches.length; ) {
      require(_tranches[i].vestedFraction != 0, 'tranche vested fraction == 0');
      require(_tranches[i].time > lastTime, 'tranche time must increase');
      require(
        _tranches[i].vestedFraction > lastVestedFraction,
        'tranche vested fraction must increase'
      );
      lastTime = _tranches[i].time;
      lastVestedFraction = _tranches[i].vestedFraction;
      tranches.push(_tranches[i]);

      emit SetTranche(i, lastTime, lastVestedFraction);

      unchecked {
        ++i;
      }
    }

    require(lastTime <= 4102444800, 'vesting ends after 4102444800 (Jan 1 2100)');
    require(lastVestedFraction == fractionDenominator, 'last tranche must vest all tokens');
  }

  /**
   * @notice Set the vesting tranches. Tranches must be sorted by time and vested fraction must monotonically increase.
   * The last tranche must vest all tokens (vestedFraction == fractionDenominator)
   */
  function setTranches(uint256 _start, uint256 _end, uint256 _cliff) external onlyOwner {
    _setTranches(_start, _end, _cliff);
  }
}
