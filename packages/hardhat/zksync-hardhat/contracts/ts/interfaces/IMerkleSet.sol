// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

interface IMerkleSet {
	event SetMerkleRoot(bytes32 merkleRoot);

	function getMerkleRoot() external view returns (bytes32 root);
}
