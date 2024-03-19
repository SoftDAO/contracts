# TrancheVestingMerkle Vesting Contract

## Read Methods
* DOMAIN_SEPARATOR() returns (bytes32): unused, for ERC20-Permit signatures
* NAME() returns (string): human-readable contract name identifying vesting method
* VERSION() returns uint256: contract version incremented on code update
* allowance(address owner, address spender) returns (uint256 amount): the maximum amount of internal voting tokens that the spender can transferFrom the owner (ignore, internal voting tokens cannot be transferred).
* balanceOf(address account) returns (uint256): amount of internal voting tokens held by a given address (ignore unless using unclaimed tokens for governance).
* checkpoints(address account, uint32 pos): checkpointed token balances (ignore unless using unclaimed tokens for governance).
* claimed() returns (uint256): the total integer quantity of tokens claimed by all beneficiaries
* decimals() returns (uint256): the decimals for the internal voting token (ignore unless using unclaimed tokens for governance).
* delegates(address account) returns (address): the address to which the account delegates voting power (ignore unless using unclaimed tokens for governance).
* getClaimableAmount(address beneficiary) returns (uint256 amount): get the integer quantity of tokens currently claimable by the beneficiary. Note that this will be zero until the distribution record is initialized by claiming or initializing even if the beneficiary can claim tokens.
* getDistributionRecord(address beneficiary) returns (DistributionRecord): get the details on this user's distribution record (bool initialized, uint120 total, uint120 claimed)
* getFractionDenominator() returns (uint256): the denominator used with vesting conditions to generate fractional values. E.g. with a fraction denominator of 10,000, a 50% vesting condition is represented with the integer 5000.
* getMerkleRoot() returns (bytes32 root): returns the merkle root. Users can only claim by submitting a proof which matches the contract's stored merkle root. The merkle root can only be updated by the owner.
* getPastTotalSupply(uint256 blockNumber): get past total supply for internal voting token (ignore unless using unclaimed tokens for governance).
* getPastVotes(address account, uint256 blockNumber) returns (uint256): get the account's voting power at a previous block (ignore unless using tokens for governance)
* getSweepRecipient() returns (address sweepRecipient): the address to which unclaimed and other funds will be swept. Defaults to the contract deployer, can only be updated by the owner.
* getTotalVotes() returns (uint256): the total voting power of the internal voting token across all holders (ignore unless using unclaimed tokens for governance).
* getTranche(uint256 i) returns (Tranche): get the i'th Tranche struct including (uint128 time, uint128 vestedFraction) where time is set in seconds per epoch and vestedFraction is an integer value between 1 and fractionDenominator. Tranche times and vested fractions must increase monotonically.
* getTranche() returns (Tranche[]): get all tranches
* getVestedFraction(address input, uint256 time) returns (uint256): get the fraction of tokens vested to the input address at the specified time. Convert to a fraction by dividing by fractionDenominator.
* getVoteFactor(address input) returns (uint256): get the conversion factor between unclaimed token balance and voting power for a user (ignore unless using unclaimed tokens for governance). Convert to a decimal value by dividing by fractionDenominator.
* getVotes(address account) returns (uint256): get the current voting power of an account (ignore unless using unclaimed tokens for governance)
* name() returns ("internal vote tracker"): the name of the internal token, ignore.
* nonces(address owner): get the nonce for the owner
* numCheckpoints(address account) returns uint32: get the number of checkpoints for an account (ignore unless using unclaimed tokens for governance)
* symbol() returns ("IVT"): the symbol of the internal voting otken (ignore unless using unclaimed tokens for governance)
* token() returns (address): the address of the ERC-20 token being distributed.
* total() returns (uint256): the total integer quantity of tokens to be distributed. The owner must update this if the merkle root and associated distribution quantity change.
* totalSupply() returns (uint256): the total integer quantity of the internal voting token (ignore unless using unclaimed tokens for governance)
* uri() returns (string): a URI pointing to basic distribution details, generally on IPFS. This URI should include a reference to the full merkle proof so that participants can always claim by looking up their merkle proof.

## Write Methods
* adjust(address beneficiary, int256 amount): ignore, will not have intended effect on merkle-proof based distributors, update distribution details by setting the merkle proof.
* approve(address spender, uint256 amount): ignore, internal voting tokens cannot be transferred.
* claim(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof): allows any address holding the relevant merkle proof to claim all vested tokens on behalf of the beneficiary. Note that calling claim will also initialize the distribution record.
* decreaseAllowance(address spender, uint256 subtractedValue): do not use, internal voting tokens cannot be transferred
* delegate(address delegatee): delegate msg.sender's voting power to themselves or another delegatee (ignore unless using unclaimed tokens for governance)
* delegateBySig: ignore unless using unclaimed tokens for governance
* increaseAllowance(address spender, uint256 addedValue): ignore, internal voting tokens cannot be transferred
* initializeDistributionRecord(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof): allows any address to initialize the distribution record for a beneficiary.
* permit: ignore, internal voting tokens are non-transferrable
* renounceOwnership: remove the owner, disabling all management functions (this is generally a very bad idea)
* setMerkleRoot(bytes32): set a new merkle root. Only callable by the contract owner. The owner also must set an updated uri containing the new merkle proofs and an updated total if changed.
* setSweepRecipient(address): set the address where funds are swept. Only callable by contract owner.
* setToken(address): set the address of the ERC-20 token to distribute. Only callable by owner.
* setTotal(uint256): set the total quantity of tokens to distribute (inclusive of any tokens already distributed). Only callable by owner.
* setTranches(Tranche[]): set the times and fractions for when tokens vest. Tranches include (uint128 time, uint128 vestedFraction) where time is seconds past the unix epoch and vestedFraction is divided by fractionDenominator to create a fractional value. Tranche times and fractions must increase monotonically for each tranche. The last tranche must fully vest all tokens. Only callable by owner.
* setUri(string): set the URI of the distribution details, generally on IPFS. Ensure the URI includes all merkle proofs. Only callable by owner.
* setVoteFactor(uint256): set the conversion factor between unvested token balance and voting power. Convert to a decimal value by dividing by fractionDenominator. Ignore unless using unclaimed tokens for governance. Only callable by Owner.
* sweepNative(uint256 amount): sweep a specified amount of the native token (e.g. ETH) to the sweepRecipient. Only callable by Owner.
* sweepNative(): sweep entire native token balance (e.g. ETH) to sweepRecipient. Only callable by Owner.
* sweepToken(address token): sweep the entire token balance of the specified ERC-20 token to sweepRecipient. Only callable by Owner.
* sweepToken(address token, uint256 amount): sweep the specified amount of the specified ERC-20 token to the sweepRecipient. Only callable by Owner.
* transfer: ignore, internal voting tokens cannot be transferred
* transferFrom: ignore, internal voting tokens cannot be transferred
* transferOwnership(address newOwner): set the contract owner to a new address.
