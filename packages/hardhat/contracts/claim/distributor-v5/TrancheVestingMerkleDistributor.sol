// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

import {IFeeLevelJudge} from "../IFeeLevelJudge.sol";
import "../../utilities/AccessVerifier.sol";
import "../factory/ContinuousVestingInitializable.sol";
import "../factory/TrancheVestingInitializable.sol";
import "../factory/MerkleSetInitializable.sol";
import "../../interfaces/IOracleOrL2OracleWithSequencerCheck.sol";
import "../../config/INetworkConfig.sol";

contract TrancheVestingMerkleDistributor_v_5_0 is
    Initializable,
    TrancheVestingInitializable,
    MerkleSetInitializable,
    AccessVerifier
{
    using Address for address payable;
    using SafeERC20 for IERC20;
    
    uint256 internal constant NATIVE_TOKEN_DECIMALS = 18; // number of decimals for ETH
    INetworkConfig networkConfig;
    // denominator used to determine size of fee bips
    uint256 constant feeFractionDenominator = 10000;
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        Tranche[] memory _tranches,
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig
    ) public initializer {
        __TrancheVesting_init(_token, _total, _uri, _tranches, _maxDelayTime, uint160(uint256(_merkleRoot)), _owner);

        _transferOwnership(_owner);

        networkConfig = _networkConfig;

        IFeeLevelJudge feeLevelJudge = IFeeLevelJudge(networkConfig.getStakingAddress());
        uint256 feeLevel = feeLevelJudge.getFeeLevel(_msgSender());
        if (feeLevel == 0) {
            feeLevel = 100;
        }

        // TODO: reduce duplication with other contracts
        uint256 feeAmount = (_total * feeLevel) / feeFractionDenominator;
        if (_autoPull) {
            _token.safeTransferFrom(_feeOrSupplyHolder, address(this), _total + feeAmount);

            _token.approve(address(this), 0);
            _token.approve(address(this), feeAmount);
            _token.safeTransferFrom(address(this), networkConfig.getFeeRecipient(), feeAmount);
        } else {
            _token.safeTransferFrom(_feeOrSupplyHolder, address(this), feeAmount);
        }
    }

    function NAME() external pure override returns (string memory) {
        return "TrancheVestingMerkleDistributor";
    }

    function VERSION() external pure override returns (uint256) {
        return 5;
    }

    modifier validSignature(uint256 totalAmount, bytes memory extraDetails, uint64 expiresAt, bytes memory signature) {
        verifyAccessSignature(networkConfig.getAccessAuthorityAddress(), _msgSender(), totalAmount, extraDetails, expiresAt, signature);

        _;
    }

    function claim(
        address beneficiary, // the address that will receive tokens
        uint256 totalAmount, // the total claimable by this beneficiary
        bytes memory encodedVestingSchedule, // abi.encode(tranches)
        uint64 expiresAt,
        bytes memory signature,
        address payable platformFlatRateFeeRecipient,
        uint256 platformFlatRateFeeAmount
    )
        external
        payable
        validSignature(totalAmount, encodedVestingSchedule, expiresAt, signature)
        nonReentrant
    {
        IOracleOrL2OracleWithSequencerCheck nativeTokenPriceOracle = IOracleOrL2OracleWithSequencerCheck(networkConfig.getNativeTokenPriceOracleAddress());
        uint256 nativeTokenPriceOracleHeartbeat = networkConfig.getNativeTokenPriceOracleHeartbeat();

        uint256 baseCurrencyValue = tokensToBaseCurrency(
            msg.value,
            NATIVE_TOKEN_DECIMALS,
            nativeTokenPriceOracle,
            nativeTokenPriceOracleHeartbeat
        );

        require(baseCurrencyValue >= platformFlatRateFeeAmount, "fee payment below minimum");

        uint256 feeAmountInWei = ((platformFlatRateFeeAmount * (10 ** NATIVE_TOKEN_DECIMALS)) / getOraclePrice(nativeTokenPriceOracle, nativeTokenPriceOracleHeartbeat));

        platformFlatRateFeeRecipient.sendValue(feeAmountInWei);
        payable(_msgSender()).sendValue(msg.value - feeAmountInWei);

        // effects
        uint256 claimedAmount = _executeClaim(beneficiary, totalAmount, encodedVestingSchedule);
        // interactions
        _settleClaim(beneficiary, claimedAmount);
    }

    // TODO: reduce duplication between other contracts
    function tokensToBaseCurrency(
        uint256 tokenQuantity,
        uint256 tokenDecimals,
        IOracleOrL2OracleWithSequencerCheck oracle,
        uint256 heartbeat
    ) public view returns (uint256 value) {
        return (tokenQuantity * getOraclePrice(oracle, heartbeat)) / (10**tokenDecimals);
    }

    // TODO: reduce duplication between other contracts
    // Get a positive token price from a chainlink oracle
    function getOraclePrice(IOracleOrL2OracleWithSequencerCheck oracle, uint256 heartbeat) public view returns (uint256) {
        (
            uint80 roundID,
            int256 _price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = oracle.latestRoundData();

        require(_price > 0, "negative price");
        require(answeredInRound > 0, "answer == 0");
        require(updatedAt > 0, "round not complete");
        require(answeredInRound >= roundID, "stale price");
        require(updatedAt > Math.max(block.timestamp, heartbeat) - heartbeat, "stale price");

        return uint256(_price);
    }

    function _executeClaim(address beneficiary, uint256 _totalAmount) internal override virtual returns (uint256) {
        revert("_executeClaim(address, uint256) is deprecated");
    }

    function _executeClaim(address beneficiary, uint256 _totalAmount, bytes memory encodedVestingSchedule) internal virtual returns (uint256) {
        uint120 totalAmount = uint120(_totalAmount);

        // effects
        if (records[beneficiary].total != totalAmount) {
            // re-initialize if the total has been updated
            _initializeDistributionRecord(beneficiary, totalAmount);
        }

        uint120 claimableAmount = uint120(getClaimableAmount(beneficiary, encodedVestingSchedule));
        require(claimableAmount > 0, "Distributor: no more tokens claimable right now");

        records[beneficiary].claimed += claimableAmount;
        claimed += claimableAmount;
        return claimableAmount;
    }

    function getClaimableAmount(address beneficiary) public view override virtual returns (uint256) {
        revert("getClaimableAmount(address) is deprecated");
    }

    function getClaimableAmount(address beneficiary, bytes memory encodedVestingSchedule) public view virtual returns (uint256) {
        require(records[beneficiary].initialized, "Distributor: claim not initialized");

        DistributionRecord memory record = records[beneficiary];

        uint256 claimable = (record.total * getVestedFraction(beneficiary, block.timestamp, encodedVestingSchedule)) / fractionDenominator;
        return record.claimed >= claimable
            ? 0 // no more tokens to claim
            : claimable - record.claimed; // claim all available tokens
    }

    function getVestedFraction(address beneficiary, uint256 time) public view override returns (uint256) {
        revert("getVestedFraction(address, uint256) is deprecated");
    }

    function getVestedFraction(
        address beneficiary,
        uint256 time, // time is in seconds past the epoch (e.g. block.timestamp)
        bytes memory encodedVestingSchedule
    ) public view returns (uint256) {
        Tranche[] memory tranches = abi.decode(encodedVestingSchedule, (Tranche[]));

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
