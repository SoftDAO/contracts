// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";

import "../../contracts/claim/factory/TrancheVestingMerkleDistributorFactory.sol";
import "../../contracts/claim/factory/TrancheVestingMerkleDistributor.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TrancheVestingMerkleDistributorFactoryTest is Test {
    TrancheVestingMerkleDistributor implementation;
    TrancheVestingMerkleDistributor clone;
    TrancheVestingMerkleDistributorFactory factory;
    ERC20 token = new ERC20("Test", "TEST");
    Tranche[] tranches = [Tranche(1, 10000)];

    function setUp() public {
        implementation = new TrancheVestingMerkleDistributor();
        factory = new TrancheVestingMerkleDistributorFactory(address(implementation));
    }

    function test_SetUp() public {
        assertEq(address(factory.getImplementation()), address(implementation));
    }

    function test_DeployDistributor() public {
        uint16 nonce = 0;

        clone = factory.deployDistributor(
            IERC20(token),
            1000,
            "uri",
            tranches,
            bytes32(0),
            0,
            address(this),
            nonce
        );

        assertEq(clone.owner(), address(this));
        assertEq(clone.getSweepRecipient(), address(this));
    }

    function test_PredictDistributorAddress() public {
        uint16 nonce = 1;
        uint256 total = 1000;
        string memory uri = "uri";
        bytes32 merkleRoot = bytes32(0);
        uint160 maxDelayTime = 0;
        address owner = address(this);

        address nextCloneAddress = factory.predictDistributorAddress(
            token,
            total,
            uri,
            tranches,
            merkleRoot,
            maxDelayTime,
            owner,
            nonce
        );
        TrancheVestingMerkleDistributor nextClone =
            factory.deployDistributor(
                token,
                total,
                uri,
                tranches,
                merkleRoot,
                maxDelayTime,
                owner,
                nonce
            );

        assertEq(nextCloneAddress, address(nextClone));
    }
}
