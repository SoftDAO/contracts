// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import {StakingContract} from "../Staking.sol";
import "../factory/ContinuousVestingInitializable.sol";
import "../factory/TrancheVestingInitializable.sol";
import "../factory/MerkleSetInitializable.sol";
import "../../interfaces/IOracleOrL2OracleWithSequencerCheck.sol";
import "../../config/INetworkConfig.sol";

contract TrancheVestingMerkleDistributor_v_4_0 is
    Initializable,
    TrancheVestingInitializable,
    MerkleSetInitializable
{
    using Address for address payable;
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
        INetworkConfig _networkConfig
    ) public initializer {
        __TrancheVesting_init(_token, _total, _uri, _tranches, _maxDelayTime, uint160(uint256(_merkleRoot)), _owner);

        __MerkleSet_init(_merkleRoot);

        _transferOwnership(_owner);

        networkConfig = _networkConfig;

        StakingContract staking = StakingContract(networkConfig.getStakingAddress());
        uint256 feeLevel = staking.getFeeLevel(_msgSender());
        if (feeLevel == 0) {
            feeLevel = 100;
        }

        // TODO: use a distinct parameter for explicitly designating payer
        _token.transferFrom(_owner, address(this), (_total * feeLevel) / feeFractionDenominator);
    }

    function NAME() external pure override returns (string memory) {
        return "TrancheVestingMerkleDistributor";
    }

    function VERSION() external pure override returns (uint256) {
        return 4;
    }

    function initializeDistributionRecord(
        uint256 index, // the beneficiary's index in the merkle root
        address beneficiary, // the address that will receive tokens
        uint256 amount, // the total claimable by this beneficiary
        bytes32[] calldata merkleProof
    ) external validMerkleProof(keccak256(abi.encodePacked(index, beneficiary, amount)), merkleProof) {
        _initializeDistributionRecord(beneficiary, amount);
    }

    function claim(
        uint256 index, // the beneficiary's index in the merkle root
        address beneficiary, // the address that will receive tokens
        uint256 totalAmount, // the total claimable by this beneficiary
        bytes32[] calldata merkleProof
    )
        external
        payable
        validMerkleProof(keccak256(abi.encodePacked(index, beneficiary, totalAmount)), merkleProof)
        nonReentrant
    {
        StakingContract staking = StakingContract(networkConfig.getStakingAddress());
        uint256 feeLevel = staking.getFeeLevel(_msgSender());
        if (feeLevel == 0) {
            feeLevel = 100;
        }

        IOracleOrL2OracleWithSequencerCheck nativeTokenPriceOracle = IOracleOrL2OracleWithSequencerCheck(networkConfig.getNativeTokenPriceOracleAddress());

        uint256 baseCurrencyValue = tokensToBaseCurrency(
            msg.value,
            NATIVE_TOKEN_DECIMALS,
            nativeTokenPriceOracle
        );

        uint256 feeMinimumExpandedAmount = 
            (networkConfig.getFlatRateFeeAmount() * feeLevel) / feeFractionDenominator;

        require(baseCurrencyValue >= feeMinimumExpandedAmount, "fee payment below minimum");

        uint256 feeAmountInWei = ((feeMinimumExpandedAmount * (10 ** NATIVE_TOKEN_DECIMALS)) / getOraclePrice(nativeTokenPriceOracle));

        networkConfig.getFeeRecipient().sendValue(feeAmountInWei);
        payable(_msgSender()).sendValue(msg.value - feeAmountInWei);

        // effects
        uint256 claimedAmount = _executeClaim(beneficiary, totalAmount);
        // interactions
        _settleClaim(beneficiary, claimedAmount);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        _setMerkleRoot(_merkleRoot);
    }

    function tokensToBaseCurrency(
        uint256 tokenQuantity,
        uint256 tokenDecimals,
        IOracleOrL2OracleWithSequencerCheck oracle
    ) public view returns (uint256 value) {
        return (tokenQuantity * getOraclePrice(oracle)) / (10**tokenDecimals);
    }

    // Get a positive token price from a chainlink oracle
    function getOraclePrice(IOracleOrL2OracleWithSequencerCheck oracle) public view returns (uint256) {
        (
            uint80 roundID,
            int256 _price,
            /* uint256 startedAt */,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = oracle.latestRoundData();

        require(_price > 0, "negative price");
        require(answeredInRound > 0, "answer == 0");
        require(timeStamp > 0, "round not complete");
        require(answeredInRound >= roundID, "stale price");

        return uint256(_price);
    }
}
