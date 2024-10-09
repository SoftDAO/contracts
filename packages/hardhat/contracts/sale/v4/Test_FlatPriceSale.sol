// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
// pragma abicoder v2;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import "../../config/INetworkConfig.sol";
import "../../utilities/AccessVerifier.sol";
import "@openzeppelin/contracts-upgradeable/security/PullPaymentUpgradeable.sol";

contract Test_FlatPriceSale {
	using Address for address payable;

	string public constant VERSION = "0.0.1";

	event OutputOne(
		address accessAuthorityAddress,
		address sender,
		uint256 userLimit,
		uint64 expiresAt,
		bytes signature,
		address contractAddress,
		bytes message,
		bytes32 hash,
		address signer
	);

	/**
        Pay with the native token (e.g. ETH).
    */
	function buyWithNative(
		uint256 userLimit,
		uint64 expiresAt,
		bytes memory signature // Remove 'view' modifier as we're now emitting an event
	) external {
		INetworkConfig networkConfig = INetworkConfig(
			0xe6d4e4d7741e556B2b6123973318B01e5d202831
		);
		bytes memory message = abi.encodePacked(
			address(this),
			msg.sender,
			userLimit,
			expiresAt
		);
		bytes32 hash = keccak256(message);
		bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(hash);
		address signer = ECDSA.recover(ethSignedMessageHash, signature);

		emit OutputOne(
			networkConfig.getAccessAuthorityAddress(),
			msg.sender,
			userLimit,
			expiresAt,
			signature,
			address(this),
			message,
			hash,
			signer
		);
	}
}
