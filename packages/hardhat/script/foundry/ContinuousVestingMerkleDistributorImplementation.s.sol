// SPDX-License-Identifier: UNLICENSED
pragma solidity^0.8.21;

import {Script} from "forge-std/Script.sol";
import {ContinuousVestingMerkleDistributorImplementation} from "../../contracts/claim/factory/ContinuousVestingMerkleDistributorImplementation.sol";

contract ContinuousVestingMerkleDistributorImplementationScript is Script {
    function run() public {
        ContinuousVestingMerkleDistributorImplementation implementation;
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        implementation = new ContinuousVestingMerkleDistributorImplementation();
        vm.stopBroadcast();
    }
}