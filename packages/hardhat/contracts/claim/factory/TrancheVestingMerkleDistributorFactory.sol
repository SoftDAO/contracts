// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {TrancheVestingMerkleDistributorImplementation, Tranche} from "./TrancheVestingMerkleDistributorImplementation.sol";

contract TrancheVestingMerkleDistributorFactory {
    address private immutable i_implementation;
    address[] public distributors;

    event DistributorDeployed(address indexed distributor);

    constructor(address implementation) {
        i_implementation = implementation;
    }

    function deployDistributor(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        Tranche[] memory _tranches,
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner,
        uint16 _nonce
    ) public returns (TrancheVestingMerkleDistributorImplementation distributor) {
        // TODO: compute salt here by hashing the args into a bytestring
        bytes32 salt = keccak256(abi.encode(
            _token,
            _total,
            _uri,
            _tranches,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _nonce
        ));
        distributor =
            TrancheVestingMerkleDistributorImplementation(Clones.cloneDeterministic(i_implementation, salt));
        distributors.push(address(distributor));

        emit DistributorDeployed(address(distributor));

        distributor.initialize(_token, _total, _uri, _tranches, _merkleRoot, _maxDelayTime, _owner);

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
        uint16 _nonce
    ) public view returns (address) {
        bytes32 salt = keccak256(abi.encode(
            _token,
            _total,
            _uri,
            _tranches,
            _merkleRoot,
            _maxDelayTime,
            _owner,
            _nonce
        ));
        return Clones.predictDeterministicAddress(i_implementation, salt, address(this));
    }
}