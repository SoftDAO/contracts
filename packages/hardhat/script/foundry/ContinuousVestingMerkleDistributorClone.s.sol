// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Script} from "forge-std/Script.sol";
import {ContinuousVestingMerkleDistributorImplementation} from "../../contracts/claim/factory/ContinuousVestingMerkleDistributorImplementation.sol";
import {ContinuousVestingMerkleDistributorFactory} from "../../contracts/claim/factory/ContinuousVestingMerkleDistributorFactory.sol";

contract ContinuousVestingMerkleDistributorCloneScript is Script {
    function run() public {
        ERC20 token;
        ContinuousVestingMerkleDistributorImplementation implementation;
        ContinuousVestingMerkleDistributorImplementation clone;
        ContinuousVestingMerkleDistributorFactory factory;
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        token = new ERC20("New Token", "NEW");
        implementation = new ContinuousVestingMerkleDistributorImplementation();
        factory = new ContinuousVestingMerkleDistributorFactory(address(implementation));
        clone = factory.deployDistributor(
            IERC20(token),
            1000000 * 10**18,
            "ipfs://",
            block.timestamp + 1000,
            block.timestamp + 1000,
            block.timestamp + 10000,
            bytes32(0),
            0,
            vm.addr(deployerPrivateKey),
            bytes32(0)
        );
        vm.stopBroadcast();
    }
}