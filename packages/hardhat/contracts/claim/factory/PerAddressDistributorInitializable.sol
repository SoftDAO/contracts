// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IPerAddressDistributor, PerAddressDistributionRecord} from "../../interfaces/IPerAddressDistributor.sol";

/**
 * @title Distributor
 * @notice Distributes funds to beneficiaries and tracks distribution status
 */
abstract contract PerAddressDistributorInitializable is Initializable, IPerAddressDistributor, ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => PerAddressDistributionRecord) internal records; // track distribution records per user
    IERC20 public token; // the token being claimed
    uint256 public total; // total tokens allocated for claims
    uint256 public claimed; // tokens already claimed
    string public uri; // ipfs link on distributor info
    uint256 internal fractionDenominator; // denominator for vesting fraction (e.g. if vested fraction is 100 and fractionDenominator is 10000, 1% of tokens have vested)

    // provide context on the contract name and version
    function NAME() external view virtual returns (string memory);

    function VERSION() external view virtual returns (uint256);

    function __Distributor_init(IERC20 _token, uint256 _total, string memory _uri, uint256 _fractionDenominator)
        internal
        onlyInitializing
    {
        require(address(_token) != address(0), "Distributor: token is address(0)");
        require(_total > 0, "Distributor: total is 0");

        token = _token;
        total = _total;
        uri = _uri;
        fractionDenominator = _fractionDenominator;
        emit InitializeDistributor(token, total, uri, fractionDenominator);
    }

    /**
     * @dev Set up the distribution record for a user. Permissions are not checked in this function.
     * Amount is limited to type(uint120).max to allow each DistributionRecord to be packed into a single storage slot.
     *
     * @param beneficiary The address of the beneficiary
     * @param _totalAmount The total amount of tokens to be distributed to the beneficiary
     * @param _start The start time of the vesting schedule
     * @param _end The end time of the vesting schedule
     * @param _cliff The cliff time of the vesting schedule
     */
    function _initializeDistributionRecord(address beneficiary, uint256 _totalAmount, uint256 _start, uint256 _end, uint256 _cliff) internal virtual {
        // Checks
        require(_totalAmount <= type(uint120).max, "Distributor: totalAmount > type(uint120).max");
        // TODO: add checks for start, end, cliff
        uint120 totalAmount = uint120(_totalAmount);

        // Effects - note that the existing claimed quantity is re-used during re-initialization
        records[beneficiary] = PerAddressDistributionRecord(true, totalAmount, records[beneficiary].claimed, _start, _end, _cliff);
        emit InitializeDistributionRecord(beneficiary, totalAmount, _start, _end, _cliff);
    }

    /**
     * @notice Record the claim internally:
     * @dev This function does not check permissions: caller must verify the claim is valid!
     * this function should not call any untrusted external contracts to avoid reentrancy
     */
    function _executeClaim(address beneficiary, uint256 _totalAmount, uint256 _start, uint256 _end, uint256 _cliff) internal virtual returns (uint256) {
        uint120 totalAmount = uint120(_totalAmount);

        // effects
        if (records[beneficiary].total != totalAmount) {
            // re-initialize if the total has been updated
            _initializeDistributionRecord(beneficiary, totalAmount, _start, _end, _cliff);
        }
        if(records[beneficiary].start != _start || records[beneficiary].end != _end || records[beneficiary].cliff != _cliff) {
            _initializeDistributionRecord(beneficiary, totalAmount, _start, _end, _cliff);
        }

        uint120 claimableAmount = uint120(getClaimableAmount(beneficiary));
        require(claimableAmount > 0, "Distributor: no more tokens claimable right now");

        records[beneficiary].claimed += claimableAmount;
        claimed += claimableAmount;

        return claimableAmount;
    }

    /**
     * @dev Move tokens associated with the claim to the recipient. This function should be called
     * after the claim has been executed internally to avoid reentrancy issues.
     * @param _recipient The address of the recipient
     * @param _amount The amount of tokens to be transferred during this claim
     */
    function _settleClaim(address _recipient, uint256 _amount) internal virtual {
        token.safeTransfer(_recipient, _amount);
        emit Claim(_recipient, _amount);
    }

    /// @notice return a distribution record
    function getDistributionRecord(address beneficiary) external view virtual returns (PerAddressDistributionRecord memory) {
        return records[beneficiary];
    }

    // Get tokens vested as fraction of fractionDenominator
    function getVestedFraction(address beneficiary, uint256 time, uint256 start, uint256 end, uint256 cliff) public view virtual returns (uint256);

    function getFractionDenominator() public view returns (uint256) {
        return fractionDenominator;
    }

    // get the number of tokens currently claimable by a specific use
    function getClaimableAmount(address beneficiary) public view virtual returns (uint256) {
        require(records[beneficiary].initialized, "Distributor: claim not initialized");

        PerAddressDistributionRecord memory record = records[beneficiary];

        // Pass in start, end, cliff from record
        uint256 claimable = (record.total * getVestedFraction(beneficiary, block.timestamp, record.start, record.end, record.cliff)) / fractionDenominator;
        // uint256 claimable = (record.total * getVestedFraction(beneficiary, block.timestamp)) / fractionDenominator;
        return record.claimed >= claimable
            ? 0 // no more tokens to claim
            : claimable - record.claimed; // claim all available tokens
    }
}
