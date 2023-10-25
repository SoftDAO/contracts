// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "../../contracts/claim/factory/TrancheVestingMerkleDistributorFactory.sol";
import "../../contracts/claim/factory/TrancheVestingMerkleDistributorImplementation.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TrancheVestingMerkleDistributorFactoryTest is Test {
    TrancheVestingMerkleDistributorImplementation implementation;
    TrancheVestingMerkleDistributorImplementation clone;
    TrancheVestingMerkleDistributorFactory factory;
    ERC20 token = new ERC20("Test", "TEST");
    Tranche[] tranches = [
        Tranche(1, 10000)
    ];

    function setUp() public {
        implementation = new TrancheVestingMerkleDistributorImplementation();
        factory = new TrancheVestingMerkleDistributorFactory(address(implementation));
    }

    function test_SetUp() public {
        assertEq(address(factory.getImplementation()), address(implementation));
    }

    function test_DeployDistributor() public {
        bytes32 salt = bytes32(0);

        console.log("tranches", tranches[0].time, tranches[0].vestedFraction);

        clone = factory.deployDistributor(
            IERC20(token),
            1000,
            "uri",
            tranches,
            bytes32(0),
            0,
            address(this),
            salt
        );

        assertEq(clone.owner(), address(this));
        assertEq(clone.getSweepRecipient(), address(this));
    }

    function test_PredictDistributorAddress() public {
        bytes32 salt = bytes32("1");
        address nextCloneAddress = factory.predictDistributorAddress(salt);
        TrancheVestingMerkleDistributorImplementation nextClone = factory.deployDistributor(
            IERC20(token),
            1000,
            "uri",
            tranches,
            bytes32(0),
            0,
            address(this),
            salt
        );

        assertEq(nextCloneAddress, address(nextClone));
    }
}