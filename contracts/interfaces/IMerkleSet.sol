// SPDX-License-Identifier: BSL-1.1

pragma solidity 0.8.16;

interface IMerkleSet {
	event SetMerkleRoot(bytes32 merkleRoot);

	function getMerkleRoot() external view returns (bytes32 root);
}
