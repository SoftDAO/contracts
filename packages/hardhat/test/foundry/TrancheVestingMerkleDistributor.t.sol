// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../../contracts/claim/factory/TrancheVestingMerkleDistributor.sol";

contract TrancheVestingMerkleDistributorTest is Test {
    TrancheVestingMerkleDistributor implementation;
    Tranche[] tranches = [Tranche({time: 1, vestedFraction: 10000})];

    function setUp() public {
        implementation = new TrancheVestingMerkleDistributor();
    }

    function test_Initialize_fails_as_disabled() public {
        vm.expectRevert("Initializable: contract is already initialized");
        implementation.initialize(
            IERC20(address(0)),
            0,
            "",
            tranches,
            bytes32(0),
            0,
            address(0)
        );
    }
}
