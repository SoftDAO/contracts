// SPDX-License-Identifier: MIT
pragma solidity =0.8.21;

interface INetworkConfig {
	function getFeeRecipient() external view returns (address payable);
}
