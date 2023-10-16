// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "../../contracts/claim/factory/ContinuousVestingMerkleDistributorFactory.sol";
import "../../contracts/claim/factory/ContinuousVestingMerkleDistributorImplementation.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ContinuousVestingMerkleDistributorFactoryTest is Test {
    ContinuousVestingMerkleDistributorImplementation implementation;
    ContinuousVestingMerkleDistributorImplementation clone;
    ContinuousVestingMerkleDistributorFactory factory;
    ERC20 token = new ERC20("Test", "TEST");

    function setUp() public {
        implementation = new ContinuousVestingMerkleDistributorImplementation();
        factory = new ContinuousVestingMerkleDistributorFactory(address(implementation));
    }

    function test_SetUp() public {
        assertEq(address(factory.getImplementation()), address(implementation));
    }

    function test_DeployDistributor() public {
        bytes32 salt = bytes32(0);

        clone = factory.deployDistributor(
            IERC20(token),
            1000,
            "uri",
            1698796800,
            1698796800,
            1730419200,
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
        ContinuousVestingMerkleDistributorImplementation nextClone = factory.deployDistributor(
            IERC20(token),
            1000,
            "uri",
            1698796800,
            1698796800,
            1730419200,
            bytes32(0),
            0,
            address(this),
            salt
        );

        assertEq(nextCloneAddress, address(nextClone));
    }
}