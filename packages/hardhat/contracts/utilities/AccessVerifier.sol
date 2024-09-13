// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AccessVerifier {
	  function verifyAccessSignature(address accessAuthorityAddress, address member, uint256 userLimit, uint64 expires_at, bytes memory signature) internal view {
        bytes memory message = abi.encodePacked(address(this), member, userLimit, expires_at);
        bytes32 hash = keccak256(message);
        address signer = ECDSA.recover(hash, signature);

        // TODO: use custom error objects with a revert statement
        require(signer == accessAuthorityAddress, "access signature invalid");
        require(block.timestamp < expires_at, "access signature expired");
	  }
}
