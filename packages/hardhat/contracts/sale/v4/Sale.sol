// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

// Upgradeable contracts are required to use clone() in SaleFactory
abstract contract Sale is ReentrancyGuardUpgradeable, OwnableUpgradeable {
	using SafeERC20Upgradeable for IERC20Upgradeable;
	event Buy(
		address indexed buyer,
		address indexed token,
		uint256 baseCurrencyValue,
		uint256 tokenValue,
		uint256 protocolTokenFee,
		uint256 platformTokenFee
	);

	/**
  Important: the constructor is only called once on the implementation contract (which is never initialized)
  Clones using this implementation cannot use this constructor method.
  Thus every clone must use the same fields stored in the constructor (feeBips, feeRecipient)
  */

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function buyWithToken(
		IERC20Upgradeable token,
		uint256 quantity,
		uint256 userLimit,
		uint64 expiresAt,
		bytes memory signature,
		address payable platformFlatRateFeeRecipient,
		uint256 platformFlatRateFeeAmount
	) external payable virtual {}

	function buyWithNative(
		uint256 userLimit,
		uint64 expiresAt,
		bytes memory signature,
		address payable platformFlatRateFeeRecipient,
		uint256 platformFlatRateFeeAmount
	) external payable virtual {}

	function isOpen() public view virtual returns (bool) {}

	function isOver() public view virtual returns (bool) {}

	function buyerTotal(address user) external view virtual returns (uint256) {}

	function total() external view virtual returns (uint256) {}
}
