// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

import {IFeeLevelJudge} from "../IFeeLevelJudge.sol";
import "../factory/ContinuousVestingInitializable.sol";
import "../../utilities/AccessVerifier.sol";
import "../../interfaces/IOracleOrL2OracleWithSequencerCheck.sol";
import "../../config/INetworkConfig.sol";

contract ContinuousVestingMerkleDistributor_v_5_0 is Initializable, ContinuousVestingInitializable, AccessVerifier {
    using Address for address payable;
    using SafeERC20 for IERC20;

    uint256 internal constant NATIVE_TOKEN_DECIMALS = 18;
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
        uint256 _start, // vesting clock starts at this time
        uint256 _cliff, // claims open at this time
        uint256 _end, // vesting clock ends and this time
        bytes32 _merkleRoot, // (deprecated) the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig
    ) public initializer {
        __ContinuousVesting_init(
            _token, _total, _uri, _start, _cliff, _end, _maxDelayTime, uint160(uint256(_merkleRoot)), _owner
        );

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
        return "ContinuousVestingMerkleInitializable";
    }

    function VERSION() external pure override returns (uint256) {
        return 5;
    }

    modifier validSignature(uint256 totalAmount, uint64 expiresAt, bytes memory signature) {
        verifyAccessSignature(networkConfig.getAccessAuthorityAddress(), _msgSender(), totalAmount, expiresAt, signature);

        _;
    }

    function claim(
        address beneficiary, // the address that will receive tokens
        uint256 totalAmount, // the total claimable by this beneficiary
        uint64 expiresAt,
        bytes memory signature,
        address payable platformFlatRateFeeRecipient,
        uint256 platformFlatRateFeeAmount
    )
        external
        payable
        validSignature(totalAmount, expiresAt, signature)
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
        uint256 claimedAmount = super._executeClaim(beneficiary, totalAmount);
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
        require(updatedAt < block.timestamp - heartbeat, "stale price");

        return uint256(_price);
    }
}
