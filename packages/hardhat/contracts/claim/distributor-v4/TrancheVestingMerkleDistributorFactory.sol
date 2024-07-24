// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

import {TrancheVestingMerkleDistributor_v_4_0, Tranche} from "./TrancheVestingMerkleDistributor.sol";
import {INetworkConfig} from "../../config/INetworkConfig.sol";

contract TrancheVestingMerkleDistributorFactory_v_4_0 {
    address private immutable i_implementation;
    address[] public distributors;

    event DistributorDeployed(address indexed distributor);

    constructor(address implementation) {
        i_implementation = implementation;
    }

    function _getSalt(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        Tranche[] memory _tranches,
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig,
        uint256 _nonce
    ) private pure returns (bytes32) {
        return keccak256(abi.encode(
            _token,
            _total,
            _uri,
            _tranches,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _feeOrSupplyHolder,
            _autoPull,
            _networkConfig,
            _nonce
        ));
    }

    function deployDistributor(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        Tranche[] memory _tranches,
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig,
        uint256 _nonce
    ) public returns (TrancheVestingMerkleDistributor_v_4_0 distributor) {
        bytes32 salt = _getSalt(
            _token,
            _total,
            _uri,
            _tranches,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _feeOrSupplyHolder,
            _autoPull,
            _networkConfig,
            _nonce
        );

        distributor =
            TrancheVestingMerkleDistributor_v_4_0(Clones.cloneDeterministic(i_implementation, salt));
        distributors.push(address(distributor));

        emit DistributorDeployed(address(distributor));

        distributor.initialize(_token, _total, _uri, _tranches, _merkleRoot, _maxDelayTime, _owner, _feeOrSupplyHolder, _autoPull, _networkConfig);

        return distributor;
    }
    
    function getImplementation() public view returns (address) {
        return i_implementation;
    }

    function predictDistributorAddress(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        Tranche[] memory _tranches,
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        address _feeOrSupplyHolder,
        bool _autoPull,
        INetworkConfig _networkConfig,
        uint256 _nonce
    ) public view returns (address) {
        bytes32 salt = _getSalt(
            _token,
            _total,
            _uri,
            _tranches,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _feeOrSupplyHolder,
            _autoPull,
            _networkConfig,
            _nonce
        );

        return Clones.predictDeterministicAddress(i_implementation, salt, address(this));
    }
}
