// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
// pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PullPaymentUpgradeable.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import "./Sale.sol";
import "../../interfaces/IOracleOrL2OracleWithSequencerCheck.sol";
import "../../config/INetworkConfig.sol";
import "../../utilities/AccessVerifier.sol";
import {IFeeLevelJudge} from "../../claim/IFeeLevelJudge.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
Allow qualified users to participate in a sale according to sale rules.

Management
- the address that deploys the sale is the sale owner
- owners may change some sale parameters (e.g. start and end times)
- sale proceeds are sent to the sale recipient

Qualification
- (deprecated) public sale: anyone can participate
- private sale: only users who have signatures issued by the access authority

Sale Rules
- timing: purchases can only be made
  - after the sale opens
  - after the per-account random queue time has elapsed
  - before the sale ends
- purchase quantity: quantity is limited by
  - per-address limit
  - total sale limit
- payment method: participants can pay using either
  - the native token on the network (e.g. ETH)
  - a single ERC-20 token (e.g. USDC)
- number of purchases: there is no limit to the number of compliant purchases a user may make

Token Distribution
- this contract does not distribute any purchased tokens

Metrics
- purchase count: number of purchases made in this sale
- user count: number of unique addresses that participated in this sale
- total bought: value of purchases denominated in a base currency (e.g. USD) as an integer (to get the float value, divide by oracle decimals)
- bought per user: value of a user's purchases denominated in a base currency (e.g. USD)

total bought and bought per user metrics are inclusive of any fee charged (if a fee is charged, the sale recipient will receive less than the total spend)
*/

// Sale can only be updated post-initialization by the contract owner!
struct Config {
	// the address that will receive sale proceeds (tokens and native) minus any fees sent to the fee recipient
	address payable recipient;
	// (deprecated) the merkle root used for proving access
	bytes32 merkleRoot;
	// max that can be spent in the sale in the base currency
	uint256 saleMaximum;
	// max that can be spent per user in the base currency
	uint256 userMaximum;
	// minimum that can be bought in a specific purchase
	uint256 purchaseMinimum;
	// the time at which the sale starts (users will have an additional random delay if maxQueueTime is set)
	uint256 startTime;
	// the time at which the sale will end, regardless of tokens raised
	uint256 endTime;
	// what is the maximum length of time a user could wait in the queue after the sale starts?
	uint256 maxQueueTime;
	// a link to off-chain information about this sale
	string URI;
}

// Metrics are only updated by the buyWithToken() and buyWithNative() functions
struct Metrics {
	// number of purchases
	uint256 purchaseCount;
	// number of buyers
	uint256 buyerCount;
	// amount bought denominated in a base currency
	uint256 purchaseTotal;
	// amount bought for each user denominated in a base currency
	mapping(address => uint256) buyerTotal;
}

struct PaymentTokenInfo {
	IOracleOrL2OracleWithSequencerCheck oracle;
	uint256 heartbeat;
	uint8 decimals;
}

contract FlatPriceSale_v_4_0 is Sale, PullPaymentUpgradeable, AccessVerifier {
	using Address for address payable;
	using SafeERC20Upgradeable for IERC20Upgradeable;

	event ImplementationConstructor(INetworkConfig networkConfig);
	event Update(Config config);
	event Initialize(
		Config config,
		string baseCurrency,
		IOracleOrL2OracleWithSequencerCheck nativeOracle,
		bool nativePaymentsEnabled
	);
	event SetPaymentTokenInfo(IERC20Upgradeable token, PaymentTokenInfo paymentTokenInfo);
	event SweepToken(address indexed token, uint256 amount);
	event SweepNative(uint256 amount);
	event RegisterDistributor(address distributor);

	// All supported chains must use 18 decimals (e.g. 1e18 wei / eth)
	uint256 internal constant NATIVE_TOKEN_DECIMALS = 18;

	// flag for additional merkle root data
	uint8 internal constant PER_USER_PURCHASE_LIMIT = 1;
	uint8 internal constant PER_USER_END_TIME = 2;

	/**
  Variables set by implementation contract constructor (immutable)
  */

	// denominator used to determine size of fee bips
	uint256 constant fractionDenominator = 10000;

	// an optional address where buyers can receive distributed tokens
	address distributor;

	/**
  Variables set during initialization of clone contracts ("immutable" on each instance)
  */

	// the base currency being used, e.g. 'USD'
	string public baseCurrency;

	string public constant VERSION = "3.0";

	// <native token>/<base currency> price, e.g. ETH/USD price
	IOracleOrL2OracleWithSequencerCheck public nativeTokenPriceOracle;

	// heartbeat value for oracle
	uint256 public nativeTokenPriceOracleHeartbeat;

	// whether native payments are enabled (set during intialization)
	bool nativePaymentsEnabled;

	// <ERC20 token>/<base currency> price oracles, eg USDC address => ETH/USDC price
	mapping(IERC20Upgradeable => PaymentTokenInfo) public paymentTokens;

	// owner can update these
	Config public config;

	// derived from payments
	Metrics public metrics;

	// reasonably random value: xor of merkle root and blockhash for transaction setting merkle root
	uint160 internal randomValue;

	INetworkConfig public immutable networkConfig;

	// All clones will share the information in the implementation constructor
	constructor(address _networkConfig) {
		networkConfig = INetworkConfig(_networkConfig); 

		emit ImplementationConstructor(networkConfig);
	}

	/**
  Replacement for constructor for clones of the implementation contract
  Important: anyone can call the initialize function!
  */
	function initialize(
		address _owner,
		Config calldata _config,
		string calldata _baseCurrency,
		bool _nativePaymentsEnabled,
		IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle,
		uint256 _nativeTokenPriceOracleHeartbeat,
		IERC20Upgradeable[] calldata tokens,
		IOracleOrL2OracleWithSequencerCheck[] calldata oracles,
		uint256[] calldata oracleHeartbeats,
		uint8[] calldata decimals
	) public initializer validUpdate(_config) {
		// initialize the PullPayment escrow contract
		__PullPayment_init();

		__ReentrancyGuard_init();

		// validate the new sale
		require(tokens.length == oracles.length, "token and oracle lengths !=");
		require(tokens.length == decimals.length, "token and decimals lengths !=");
		require(address(_nativeTokenPriceOracle) != address(0), "native oracle == 0");

		// save the new sale
		config = _config;

		// save payment config
		baseCurrency = _baseCurrency;
		nativeTokenPriceOracle = _nativeTokenPriceOracle;
		nativeTokenPriceOracleHeartbeat = _nativeTokenPriceOracleHeartbeat;
		nativePaymentsEnabled = _nativePaymentsEnabled;
		emit Initialize(config, baseCurrency, nativeTokenPriceOracle, _nativePaymentsEnabled);

		for (uint256 i = 0; i < tokens.length; i++) {
			// double check that tokens and oracles are real addresses
			require(address(tokens[i]) != address(0), "payment token == 0");
			require(address(oracles[i]) != address(0), "token oracle == 0");
			// save the payment token info
			paymentTokens[tokens[i]] = PaymentTokenInfo({ oracle: oracles[i], heartbeat: oracleHeartbeats[i], decimals: decimals[i] });

			emit SetPaymentTokenInfo(tokens[i], paymentTokens[tokens[i]]);
		}

		// Set the random value for the fair queue time
		randomValue = generatePseudorandomValue();

		// transfer ownership to the user initializing the sale
		_transferOwnership(_owner);
	}

	/**
  Check that the user can currently participate in the sale based on the access signature
  */
	modifier canAccessSale(uint256 userLimit, uint64 expiresAt, bytes memory signature) {
		// make sure the buyer is an EOA
		require((_msgSender() == tx.origin), "Must buy with an EOA");

		verifyAccessSignature(networkConfig.getAccessAuthorityAddress(), _msgSender(), userLimit, expiresAt, signature);

		// Require the sale to be open
		require(block.timestamp > config.startTime, "sale has not started yet");
		require(block.timestamp < config.endTime, "sale has ended");
		require(metrics.purchaseTotal < config.saleMaximum, "sale buy limit reached");

		// Reduce congestion by randomly assigning each user a delay time in a virtual queue based on comparing their address and a random value
		// if config.maxQueueTime == 0 the delay is 0
		require(
			block.timestamp - config.startTime > getFairQueueTime(_msgSender()),
			"not your turn yet"
		);
		_;
	}

	/**
  Check that the new sale is a valid update
  - If the config already exists, it must not be over (cannot edit sale after it concludes)
  - Sale start, end, and max queue times must be consistent and not too far in the future
   */
	modifier validUpdate(Config calldata newConfig) {
		// get the existing config
		Config memory oldConfig = config;

		/**
     - @notice - Block updates after sale is over 
     - @dev - Since validUpdate is called by initialize(), we can have a new
     - sale here, identifiable by default randomValue of 0
     */
		if (randomValue != 0) {
			// this is an existing sale: cannot update after it has ended
			require(block.timestamp < oldConfig.endTime, "sale is over: cannot upate");
			if (block.timestamp > oldConfig.startTime) {
				// the sale has already started, some things should not be edited
				require(
					oldConfig.saleMaximum == newConfig.saleMaximum,
					"editing saleMaximum after sale start"
				);
			}
		}

		// the total sale limit must be at least as large as the per-user limit

		// all required values must be present and reasonable
		// check if the caller accidentally entered a value in milliseconds instead of seconds
		require(newConfig.startTime <= 4102444800, "start > 4102444800 (Jan 1 2100)");
		require(newConfig.endTime <= 4102444800, "end > 4102444800 (Jan 1 2100)");
		require(newConfig.maxQueueTime <= 604800, "max queue time > 604800 (1 week)");
		require(newConfig.recipient != address(0), "recipient == address(0)");

		// sale, user, and purchase limits must be compatible
		require(newConfig.saleMaximum > 0, "saleMaximum == 0");
		require(newConfig.userMaximum > 0, "userMaximum == 0");
		require(newConfig.userMaximum <= newConfig.saleMaximum, "userMaximum > saleMaximum");
		require(newConfig.purchaseMinimum <= newConfig.userMaximum, "purchaseMinimum > userMaximum");

		// new sale times must be internally consistent
		require(
			newConfig.startTime + newConfig.maxQueueTime < newConfig.endTime,
			"sale must be open for at least maxQueueTime"
		);

		_;
	}

	modifier validPaymentToken(IERC20Upgradeable token) {
		// check that this token is configured as a payment method
		PaymentTokenInfo memory info = paymentTokens[token];
		require(address(info.oracle) != address(0), "invalid payment token");

		_;
	}

	modifier areNativePaymentsEnabled() {
		require(nativePaymentsEnabled, "native payments disabled");

		_;
	}

	// Get info on a payment token
	function getPaymentToken(IERC20Upgradeable token)
		external
		view
		returns (PaymentTokenInfo memory)
	{
		return paymentTokens[token];
	}

	// TODO: reduce duplication between other contracts
	// Get a positive token price from a chainlink oracle
  function getOraclePrice(IOracleOrL2OracleWithSequencerCheck oracle, uint256 heartbeat) public view returns (uint256) {
		(
			,
			int256 _price,
			,
			uint256 updatedAt,
			uint80 answeredInRound
		) = oracle.latestRoundData();

		require(_price > 0, "negative price");
		require(answeredInRound > 0, "answer == 0");
		require(updatedAt > 0, "round not complete");
		require(updatedAt > block.timestamp - heartbeat, "stale price due to heartbeat");

		return uint256(_price);
	}

	/**
    Generate a pseudorandom value
    This is not a truly random value:
    - miners can alter the block hash
    - owners can repeatedly call setMerkleRoot()
    - owners can choose when to submit the transaction
  */
	function generatePseudorandomValue() public view returns (uint160) {
		return uint160(uint256(blockhash(block.number - 1)));
	}

	/**
    Get the delay in seconds that a specific buyer must wait after the sale begins in order to buy tokens in the sale

    Buyers cannot exploit the fair queue when:
    - The sale is private (merkle root != bytes32(0))
    - Each eligible buyer gets exactly one address in the merkle root

    Although miners and sellers can minimize the delay for an arbitrary address, these are not significant threats:
    - the economic opportunity to miners is zero or relatively small (only specific addresses can participate in private sales, and a better queue postion does not imply high returns)
    - sellers can repeatedly set merkle roots to achieve a favorable queue time for any address, but sellers already control the tokens being sold!
  */
	function getFairQueueTime(address buyer) public view returns (uint256) {
		if (config.maxQueueTime == 0) {
			// there is no delay: all addresses may participate immediately
			return 0;
		}

		// calculate a distance between the random value and the user's address using the XOR distance metric (c.f. Kademlia)
		uint160 distance = uint160(buyer) ^ randomValue;

		// calculate a speed at which the queue is exhausted such that all users complete the queue by sale.maxQueueTime
		uint160 distancePerSecond = type(uint160).max / uint160(config.maxQueueTime);
		// return the delay (seconds)
		return distance / distancePerSecond;
	}

	/**
  Convert a token quantity (e.g. USDC or ETH) to a base currency (e.g. USD) with the same number of decimals as the price oracle (e.g. 8)

  Example: given 2 NCT tokens, each worth $1.23, tokensToBaseCurrency should return 246000000 ($2.46)

  Function arguments
  - tokenQuantity: 2000000000000000000
  - tokenDecimals: 18

  NCT/USD chainlink oracle (important! the oracle must be <token>/<base currency> not <currency>/<base token>, e.g. ETH/USD, ~$2000 not USD/ETH, ~0.0005)
  - baseCurrencyPerToken: 123000000
  - baseCurrencyDecimals: 8

  Calculation: 2000000000000000000 * 123000000 / 1000000000000000000

  Returns: 246000000
  */
	// function tokensToBaseCurrency(SafeERC20Upgradeable token, uint256 quantity) public view validPaymentToken(token) returns (uint256) {
	//   PaymentTokenInfo info = paymentTokens[token];
	//   return quantity * getOraclePrice(info.oracle) / (10 ** info.decimals);
	// }
	// TODO: reduce duplication between other contracts
	function tokensToBaseCurrency(
		uint256 tokenQuantity,
		uint256 tokenDecimals,
		IOracleOrL2OracleWithSequencerCheck oracle,
		uint256 heartbeat
	) public view returns (uint256 value) {
		return (tokenQuantity * getOraclePrice(oracle, heartbeat)) / (10**tokenDecimals);
	}

	function total() external view override returns (uint256) {
		return metrics.purchaseTotal;
	}

	function isOver() public view override returns (bool) {
		return config.endTime <= block.timestamp || metrics.purchaseTotal >= config.saleMaximum;
	}

	function isOpen() public view override returns (bool) {
		return
			config.startTime < block.timestamp &&
			config.endTime > block.timestamp &&
			metrics.purchaseTotal < config.saleMaximum;
	}

	// return the amount bought by this user in base currency
	function buyerTotal(address user) external view override returns (uint256) {
		return metrics.buyerTotal[user];
	}

	/**
  Records a purchase
  Follow the Checks -> Effects -> Interactions pattern
  * Checks: CALLER MUST ENSURE BUYER IS PERMITTED TO PARTICIPATE IN THIS SALE: THIS METHOD DOES NOT CHECK WHETHER THE BUYER SHOULD BE ABLE TO ACCESS THE SALE!
  * Effects: record the payment
  * Interactions: none!
  */
	function _execute(uint256 baseCurrencyQuantity, uint256 userLimit) internal {
		require(
			baseCurrencyQuantity + metrics.buyerTotal[_msgSender()] <= userLimit,
			"purchase exceeds your limit"
		);

		require(
			baseCurrencyQuantity + metrics.purchaseTotal <= config.saleMaximum,
			"purchase exceeds sale limit"
		);

		require(baseCurrencyQuantity >= config.purchaseMinimum, "purchase under minimum");

		// Effects
		metrics.purchaseCount += 1;
		if (metrics.buyerTotal[_msgSender()] == 0) {
			// if no prior purchases, this is a new buyer
			metrics.buyerCount += 1;
		}
		metrics.purchaseTotal += baseCurrencyQuantity;
		metrics.buyerTotal[_msgSender()] += baseCurrencyQuantity;
	}

	/**
  Settle payment made with payment token
  Important: this function has no checks! Only call if the purchase is valid!
  */
	function _settlePaymentToken(
		uint256 baseCurrencyValue,
		IERC20Upgradeable token,
		uint256 quantity,
		uint256 feeLevel,
		uint256 platformFlatRateFeeAmount
	) internal {
		uint256 fee = (quantity * feeLevel) / fractionDenominator;
		token.safeTransferFrom(_msgSender(), networkConfig.getFeeRecipient(), fee);
		token.safeTransferFrom(_msgSender(), address(this), quantity - fee);
		emit Buy(_msgSender(), address(token), baseCurrencyValue, quantity, fee, platformFlatRateFeeAmount);
	}

	/**
  Settle payment made with native token
  Important: this function has no checks! Only call if the purchase is valid!
  */
	function _settleNativeToken(uint256 baseCurrencyValue, uint256 nativeTokenQuantity, uint256 feeLevel, uint256 platformFlatRateFeeAmount) internal {
		uint256 nativeFee = (nativeTokenQuantity * feeLevel) / fractionDenominator;
		_asyncTransfer(networkConfig.getFeeRecipient(), nativeFee);
		_asyncTransfer(config.recipient, nativeTokenQuantity - nativeFee - platformFlatRateFeeAmount);

		// This contract will hold the native token until claimed by the owner
		emit Buy(_msgSender(), address(0), baseCurrencyValue, nativeTokenQuantity, nativeFee, platformFlatRateFeeAmount);
	}

	/**
  Pay with the payment token (e.g. USDC)
  */
	function buyWithToken(
		IERC20Upgradeable token,
		uint256 quantity,
		uint256 userLimit,
		uint64 expiresAt,
		bytes memory signature,
		address payable platformFlatRateFeeRecipient,
		uint256 platformFlatRateFeeAmount
	) external payable override canAccessSale(userLimit, expiresAt, signature) validPaymentToken(token) nonReentrant {
		uint256 nativeBaseCurrencyValue = tokensToBaseCurrency(
			msg.value,
			NATIVE_TOKEN_DECIMALS,
			nativeTokenPriceOracle,
			nativeTokenPriceOracleHeartbeat
		);

		require(nativeBaseCurrencyValue >= platformFlatRateFeeAmount, "fee payment below minimum");

		uint256 feeAmountInWei = ((platformFlatRateFeeAmount * (10 ** NATIVE_TOKEN_DECIMALS)) / getOraclePrice(nativeTokenPriceOracle, nativeTokenPriceOracleHeartbeat));

		platformFlatRateFeeRecipient.sendValue(feeAmountInWei);

		// convert to base currency from payment tokens
		PaymentTokenInfo memory tokenInfo = paymentTokens[token];
		uint256 baseCurrencyValue = tokensToBaseCurrency(
			quantity,
			tokenInfo.decimals,
			tokenInfo.oracle,
			tokenInfo.heartbeat
		);

		IFeeLevelJudge feeLevelJudge = IFeeLevelJudge(networkConfig.getStakingAddress());
		uint256 feeLevel = feeLevelJudge.getFeeLevel(_msgSender());
		if (feeLevel == 0) {
			feeLevel = 100;
		}

		// Checks and Effects
		_execute(baseCurrencyValue + platformFlatRateFeeAmount, userLimit);
		// Interactions
		_settlePaymentToken(baseCurrencyValue + platformFlatRateFeeAmount, token, quantity, feeLevel, platformFlatRateFeeAmount);
	}

	/**
  Pay with the native token (e.g. ETH)
   */
	function buyWithNative(
	  uint256 userLimit,
		uint64 expiresAt,
		bytes memory signature,
		address payable platformFlatRateFeeRecipient,
		uint256 platformFlatRateFeeAmount
	) external
		payable
		override
		canAccessSale(userLimit, expiresAt, signature)
		areNativePaymentsEnabled
		nonReentrant
	{
		// convert to base currency from native tokens
		// converts msg.value (which is how much ETH was sent by user) to USD
		// Example: On September 1st, 2024
		// 		0.005 * 2450**10e8 => ~$10 = how much in USD represents 
		// 		msg.value
		uint256 baseCurrencyValue = tokensToBaseCurrency(
			msg.value,
			NATIVE_TOKEN_DECIMALS,
			nativeTokenPriceOracle,
			nativeTokenPriceOracleHeartbeat
		);

		require(baseCurrencyValue >= platformFlatRateFeeAmount, "fee payment below minimum");

		// Example: On September 1st, 2024
		// 		1/2450 * 10**18 = how much ETH (in wei) we need to represent 
		// 		1 USD
		uint256 feeAmountInWei = ((platformFlatRateFeeAmount * (10 ** NATIVE_TOKEN_DECIMALS)) / getOraclePrice(nativeTokenPriceOracle, nativeTokenPriceOracleHeartbeat));

		platformFlatRateFeeRecipient.sendValue(feeAmountInWei);

		IFeeLevelJudge feeLevelJudge = IFeeLevelJudge(networkConfig.getStakingAddress());
		uint256 feeLevel = feeLevelJudge.getFeeLevel(_msgSender());
		if (feeLevel == 0) {
			feeLevel = 100;
		}
		// Checks and Effects
		_execute(baseCurrencyValue, userLimit);
		// Interactions
		_settleNativeToken(baseCurrencyValue, msg.value, feeLevel, feeAmountInWei);
	}

	/**
  External management functions (only the owner may update the sale)
  */
	function update(Config calldata _config) external validUpdate(_config) onlyOwner {
		config = _config;
		// updates always reset the random value
		randomValue = generatePseudorandomValue();
		emit Update(config);
	}

	// Tell users where they can claim tokens
	function registerDistributor(address _distributor) external onlyOwner {
		require(_distributor != address(0), "Distributor == address(0)");
		distributor = _distributor;
		emit RegisterDistributor(distributor);
	}

	/**
  Public management functions
  */
	// Sweep an ERC20 token to the recipient (public function)
	function sweepToken(IERC20Upgradeable token) external {
		uint256 amount = token.balanceOf(address(this));
		token.safeTransfer(config.recipient, amount);
		emit SweepToken(address(token), amount);
	}

	// sweep native token to the recipient (public function)
	function sweepNative() external {
		uint256 amount = address(this).balance;
		(bool success, ) = config.recipient.call{ value: amount }("");
		require(success, "Transfer failed.");
		emit SweepNative(amount);
	}
}
