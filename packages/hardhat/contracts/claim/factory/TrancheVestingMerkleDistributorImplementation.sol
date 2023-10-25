// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./TrancheVestingMerkleInitializable.sol";

contract TrancheVestingMerkleDistributorImplementation is Initializable, TrancheVestingMerkleInitializable {
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
        address _owner
    ) public initializer {
        __TrancheVestingMerkle_init(_token, _total, _uri, _tranches, _merkleRoot, _maxDelayTime, _owner);

        _transferOwnership(_owner);
    }
}
