// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./ContinuousVestingMerkle.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ContinuousVestingMerkleDistributorImplementation is Initializable, ContinuousVestingMerkle {
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IERC20 _token, // the token being claimed
        uint256 _total, // the total claimable by all users
        string memory _uri, // information on the sale (e.g. merkle proofs)
        uint256 _voteFactor, // votes have this weight
        uint256 _start, // vesting clock starts at this time
        uint256 _cliff, // claims open at this time
        uint256 _end, // vesting clock ends and this time
        bytes32 _merkleRoot, // the merkle root for claim membership (also used as salt for the fair queue delay time),
        uint160 _maxDelayTime, // the maximum delay time for the fair queue
        address _owner
    ) public initializer {
        __ContinuousVestingMerkle_init(
            _token,
            _total,
            _uri,
            _voteFactor,
            _start,
            _cliff,
            _end,
            _merkleRoot,
            _maxDelayTime
        );
        
        _transferOwnership(_owner);
    }
}