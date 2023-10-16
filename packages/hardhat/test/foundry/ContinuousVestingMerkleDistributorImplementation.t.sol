// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../../contracts/claim/factory/ContinuousVestingMerkleDistributorImplementation.sol";

contract ContinuousVestingMerkleDistributorImplementationTest is Test {
    ContinuousVestingMerkleDistributorImplementation implementation;

    function setUp() public {
        implementation = new ContinuousVestingMerkleDistributorImplementation();
    }

    function test_Initialize_fails_as_disabled() public {
        vm.expectRevert("Initializable: contract is already initialized");
        implementation.initialize(
            IERC20(address(0)),
            0,
            "",
            0,
            0,
            0,
            bytes32(0),
            0,
            address(0)
        );
    }
}