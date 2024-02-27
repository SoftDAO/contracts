// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { PerAddressAdvancedDistributor } from './PerAddressAdvancedDistributor.sol';
import { IPerAddressTrancheVesting, Tranche } from '../../interfaces/IPerAddressTrancheVesting.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { PeriodicTranches } from '../PeriodicTranches.sol';
import "hardhat/console.sol";

/**
 * @title TrancheVesting
 * @notice Distributes funds to beneficiaries over time in tranches.
 */
abstract contract PerAddressTrancheVesting is PerAddressAdvancedDistributor, IPerAddressTrancheVesting, PeriodicTranches {
  // time and vested fraction must monotonically increase in the tranche array

  constructor(
    IERC20 _token,
    uint256 _total,
    string memory _uri,
    uint256 _voteFactor,
    uint160 _maxDelayTime,
    uint160 _salt
  ) PerAddressAdvancedDistributor(_token, _total, _uri, _voteFactor, 10000, _maxDelayTime, _salt) {
    // tranches can be set in the constructor or in setTranches()
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
    uint256 start,
    uint256 end,
    uint256 cliff
  ) public view override returns (uint256) {
    // tranches = calculate the the tranche from start, end, cliff from record, record.start, record.end, record.cliff,
    // calculateTranche(beneficiary, record);

    // TODO: calculate tranches with start, end, cliff
    Tranche[] memory tranches = generateTranches(start, end, cliff);

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
}