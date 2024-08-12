// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

import "../../interfaces/IOracleOrL2OracleWithSequencerCheck.sol";
import {INetworkConfig} from "../../config/INetworkConfig.sol";
import {ContinuousVestingMerkleDistributor_v_4_0} from "./ContinuousVestingMerkleDistributor.sol";

contract ContinuousVestingMerkleDistributorFactory_v_4_0 {
    using Address for address payable;

    address private immutable i_implementation;
    address[] public distributors;

    uint256 internal constant NATIVE_TOKEN_DECIMALS = 18;

    event DistributorDeployed(address indexed distributor);

    constructor(address implementation) {
        i_implementation = implementation;
    }

    function _getSalt(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        uint256 _start, // vesting clock starts at this time
        uint256 _cliff, // claims open at this time
        uint256 _end, // vesting clock ends and this time
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig,
        address payable _platformFlatRateFeeRecipient,
        uint256 _platformFlatRateFeeAmount,
        uint256 _nonce
    ) private pure returns (bytes32) {
        return keccak256(abi.encode(
            _token,
            _total,
            _uri,
            _start,
            _cliff,
            _end,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _feeOrSupplyHolder,
            _autoPull,
            _networkConfig,
            _platformFlatRateFeeRecipient,
            _platformFlatRateFeeAmount,
            _nonce
        ));
    }

    function deployDistributor(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        uint256 _start, // vesting clock starts at this time
        uint256 _cliff, // claims open at this time
        uint256 _end, // vesting clock ends and this time
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig,
        address payable _platformFlatRateFeeRecipient,
        uint256 _platformFlatRateFeeAmount,
        uint256 _nonce
    ) public payable returns (ContinuousVestingMerkleDistributor_v_4_0 distributor) {
        IOracleOrL2OracleWithSequencerCheck nativeTokenPriceOracle = IOracleOrL2OracleWithSequencerCheck(_networkConfig.getNativeTokenPriceOracleAddress());
        uint256 nativeBaseCurrencyValue = tokensToBaseCurrency(
            msg.value,
            NATIVE_TOKEN_DECIMALS,
            nativeTokenPriceOracle
        );

        require(nativeBaseCurrencyValue >= _platformFlatRateFeeAmount, "fee payment below minimum");

        uint256 feeAmountInWei = ((_platformFlatRateFeeAmount * (10 ** NATIVE_TOKEN_DECIMALS)) / getOraclePrice(nativeTokenPriceOracle));

        _platformFlatRateFeeRecipient.sendValue(feeAmountInWei);
        payable(msg.sender).sendValue(msg.value - feeAmountInWei);

        bytes32 salt = _getSalt(
            _token,
            _total,
            _uri,
            _start,
            _cliff,
            _end,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _feeOrSupplyHolder,
            _autoPull,
            _networkConfig,
            _platformFlatRateFeeRecipient,
            _platformFlatRateFeeAmount,
            _nonce
        );

        distributor =
            ContinuousVestingMerkleDistributor_v_4_0(Clones.cloneDeterministic(i_implementation, salt));
        distributors.push(address(distributor));

        emit DistributorDeployed(address(distributor));

        distributor.initialize(_token, _total, _uri, _start, _cliff, _end, _merkleRoot, _maxDelayTime, _owner, _feeOrSupplyHolder, _autoPull, _networkConfig);

        return distributor;
    }

    function getImplementation() public view returns (address) {
        return i_implementation;
    }

    function predictDistributorAddress(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        uint256 _start, // vesting clock starts at this time
        uint256 _cliff, // claims open at this time
        uint256 _end, // vesting clock ends and this time
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig,
        address payable _platformFlatRateFeeRecipient,
        uint256 _platformFlatRateFeeAmount,
        uint256 _nonce
    ) public view returns (address) {
        bytes32 salt = _getSalt(
            _token,
            _total,
            _uri,
            _start,
            _cliff,
            _end,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _feeOrSupplyHolder,
            _autoPull,
            _networkConfig,
            _platformFlatRateFeeRecipient,
            _platformFlatRateFeeAmount,
            _nonce
        );

        return Clones.predictDeterministicAddress(i_implementation, salt, address(this));
    }

    function tokensToBaseCurrency(
        uint256 tokenQuantity,
        uint256 tokenDecimals,
        IOracleOrL2OracleWithSequencerCheck oracle
    ) public view returns (uint256 value) {
        return (tokenQuantity * getOraclePrice(oracle)) / (10**tokenDecimals);
    }

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