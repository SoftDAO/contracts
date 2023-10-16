// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ContinuousVestingMerkleImplementation.sol";

contract ContinuousVestingMerkleDistributorFactory {
    address private immutable i_implementation;
    mapping(address => string) public getIdentifierByAddress;
    mapping(string => address) public getAddressByIdentifier;
    
    event DistributorDeployed(address indexed distributor);
    // TODO: use below event once message is implemented
    // event DistributorDeployed(address indexed distributor, string identifier);

    constructor(address implementation) {
        i_implementation = implementation;
    }

    function deployDistributor(
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
        // bytes32 calldata message // this will give us the identifier (event id) in the event emitted
    ) public returns (ContinuousVestingMerkleDistributorImplementation distributor) {
        distributor = ContinuousVestingMerkleDistributorImplementation(Clones.clone(i_implementation));
        
        emit DistributorDeployed(address(distributor));
        
        distributor.initialize(
            _token,
            _total,
            _uri,
            _voteFactor,
            _start,
            _cliff,
            _end,
            _merkleRoot,
            _maxDelayTime,
            _owner
        );

        return distributor;
    }
    function getImplementation() public view returns (address) {
        return i_implementation;
    }
}