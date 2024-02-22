# Solidity API

## BasicDistributor

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, address[] _recipients, uint256[] _amounts) public
```

### getVestedFraction

```solidity
function getVestedFraction(address, uint256) public view returns (uint256)
```

### NAME

```solidity
function NAME() external pure virtual returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure virtual returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### claim

```solidity
function claim(address beneficiary) external
```

## ContinuousVestingMerkle

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, uint256 _start, uint256 _cliff, uint256 _end, bytes32 _merkleRoot, uint160 _maxDelayTime) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(uint256 index, address beneficiary, uint256 amount, bytes32[] merkleProof) external
```

### claim

```solidity
function claim(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof) external
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

## CrosschainContinuousVestingMerkle

Distributes funds to beneficiaries across Connext domains and vesting continuously between a start and end date.

### constructor

```solidity
constructor(contract IERC20 _token, contract IConnext _connext, uint256 _total, string _uri, uint256 _voteFactor, uint256 _start, uint256 _cliff, uint256 _end, bytes32 _merkleRoot, uint160 _maxDelayTime) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

### _setToken

```solidity
function _setToken(contract IERC20 _token) internal
```

### _setTotal

```solidity
function _setTotal(uint256 _total) internal
```

## CrosschainTrancheVestingMerkle

Distributes funds to beneficiaries across Connext domains and vesting in tranches over time.

### constructor

```solidity
constructor(contract IERC20 _token, contract IConnext _connext, uint256 _total, string _uri, uint256 _voteFactor, struct Tranche[] _tranches, bytes32 _merkleRoot, uint160 _maxDelayTime) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

### _setToken

```solidity
function _setToken(contract IERC20 _token) internal
```

### _setTotal

```solidity
function _setTotal(uint256 _total) internal
```

## PriceTierVestingMerkle

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, uint256 _start, uint256 _end, contract IOracleOrL2OracleWithSequencerCheck _oracle, struct PriceTier[] _priceTiers, bytes32 _merkleRoot, uint160 _maxDelayTime) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(uint256 index, address beneficiary, uint256 amount, bytes32[] merkleProof) external
```

### claim

```solidity
function claim(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof) external
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

## PriceTierVestingSale_2_0

### sale

```solidity
contract FlatPriceSale sale
```

### price

```solidity
uint256 price
```

### soldTokenDecimals

```solidity
uint8 soldTokenDecimals
```

### validSaleParticipant

```solidity
modifier validSaleParticipant(address beneficiary)
```

### constructor

```solidity
constructor(contract FlatPriceSale _sale, contract IERC20 _token, uint8 _soldTokenDecimals, uint256 _price, uint256 _start, uint256 _end, contract IOracleOrL2OracleWithSequencerCheck _oracle, struct PriceTier[] priceTiers, uint256 _voteFactor, string _uri) public
```

### NAME

```solidity
function NAME() external pure virtual returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure virtual returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### getPurchasedAmount

```solidity
function getPurchasedAmount(address buyer) public view returns (uint256)
```

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(address beneficiary) external
```

### claim

```solidity
function claim(address beneficiary) external
```

### getDistributionRecord

```solidity
function getDistributionRecord(address beneficiary) external view virtual returns (struct DistributionRecord)
```

return a distribution record

### getClaimableAmount

```solidity
function getClaimableAmount(address beneficiary) public view returns (uint256)
```

_get the amount of tokens currently claimable by a beneficiary_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

### getTotalClaimableAmount

```solidity
function getTotalClaimableAmount(address beneficiary) internal view returns (uint256)
```

## Satellite

This contract allows a beneficiary to claim tokens to this chain from a Distributor on another chain.
This contract validates inclusion in the merkle root, but only as a sanity check. The distributor contract
is the source of truth for claim eligibility.

_The beneficiary domain in the merkle leaf must be this contract's domain. The beneficiary address may be
an EOA or a smart contract and must match msg.sender. The Satellite contract(s) and CrosschainDistributor contracts must only
be deployed on chains supported by the Connext protocol.

Note that anyone could deploy a fake Satellite contract that does not require msg.sender to match the beneficiary or the Satellite
domain to match the beneficiary domain. This would allow the attacker to claim tokens from the distributor on behalf of a beneficiary onto
the chain / domain specified by that beneficiary's merkle leaf. This is not a security risk to the CrosschainMerkleDistributor,
as this is the intended behavior for a properly constructed merkle root._

### ClaimInitiated

```solidity
event ClaimInitiated(bytes32 id, address beneficiary, uint256 total)
```

Emitted when a claim is initiated

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | bytes32 | The transfer id for sending claim to distributor |
| beneficiary | address | The user claiming tokens |
| total | uint256 | The beneficiary's total claimable token quantity (which may not be immediately claimable due to vesting conditions) |

### distributor

```solidity
contract ICrosschain distributor
```

The distributor hosted on on distributorDomain

### distributorDomain

```solidity
uint32 distributorDomain
```

The domain of the distributor

### domain

```solidity
uint32 domain
```

The domain of this satellite

### connext

```solidity
contract IConnext connext
```

Address of Connext on the satellite domain

### constructor

```solidity
constructor(contract IConnext _connext, contract ICrosschain _distributor, uint32 _distributorDomain, bytes32 _merkleRoot) public
```

### initiateClaim

```solidity
function initiateClaim(uint256 total, bytes32[] proof) public payable
```

Initiates crosschain claim by msg.sender, relayer fees paid by native asset only.

_Verifies membership in distribution merkle proof and xcalls to Distributor to initiate claim_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| total | uint256 | The amount of the claim (in leaf) |
| proof | bytes32[] | The merkle proof of the leaf in the root |

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

## TrancheVestingMerkle

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, struct Tranche[] _tranches, bytes32 _merkleRoot, uint160 _maxDelayTime) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(uint256 index, address beneficiary, uint256 amount, bytes32[] merkleProof) external
```

### claim

```solidity
function claim(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof) external
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

## TrancheVestingSale_1_3

### saleManager

```solidity
contract ISaleManager_v_1_3 saleManager
```

### saleId

```solidity
bytes32 saleId
```

### validSaleParticipant

```solidity
modifier validSaleParticipant(address beneficiary)
```

### constructor

```solidity
constructor(contract ISaleManager_v_1_3 _saleManager, bytes32 _saleId, contract IERC20 _token, struct Tranche[] _tranches, uint256 _voteFactor, string _uri) public
```

### NAME

```solidity
function NAME() external pure virtual returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure virtual returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### tryDecimals

```solidity
function tryDecimals(contract IERC20 _token) internal view returns (int256)
```

### getPurchasedAmount

```solidity
function getPurchasedAmount(address buyer) public view returns (uint256)
```

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(address beneficiary) external
```

### claim

```solidity
function claim(address beneficiary) external
```

### getDistributionRecord

```solidity
function getDistributionRecord(address beneficiary) external view returns (struct DistributionRecord)
```

return a distribution record

### getClaimableAmount

```solidity
function getClaimableAmount(address beneficiary) public view returns (uint256)
```

_get the amount of tokens currently claimable by a beneficiary_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

### getTotalClaimableAmount

```solidity
function getTotalClaimableAmount(address beneficiary) internal view returns (uint256)
```

## TrancheVestingSale_2_0

### sale

```solidity
contract FlatPriceSale sale
```

### price

```solidity
uint256 price
```

### soldTokenDecimals

```solidity
uint8 soldTokenDecimals
```

### validSaleParticipant

```solidity
modifier validSaleParticipant(address beneficiary)
```

### constructor

```solidity
constructor(contract FlatPriceSale _sale, contract IERC20 _token, uint8 _soldTokenDecimals, uint256 _price, struct Tranche[] tranches, uint256 voteWeightBips, string _uri) public
```

### NAME

```solidity
function NAME() external pure virtual returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure virtual returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### getPurchasedAmount

```solidity
function getPurchasedAmount(address buyer) public view returns (uint256)
```

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(address beneficiary) external
```

### claim

```solidity
function claim(address beneficiary) external
```

### getDistributionRecord

```solidity
function getDistributionRecord(address beneficiary) external view virtual returns (struct DistributionRecord)
```

return a distribution record

### getClaimableAmount

```solidity
function getClaimableAmount(address beneficiary) public view returns (uint256)
```

_get the amount of tokens currently claimable by a beneficiary_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

### getTotalClaimableAmount

```solidity
function getTotalClaimableAmount(address beneficiary) internal view returns (uint256)
```

## AdvancedDistributor

Distributes tokens to beneficiaries with voting-while-vesting and administrative controls.
The contract owner can control these distribution parameters:
- the merkle root determining all distribution details
- adjustments to specific distributions
- the token being distributed
- the total amount to distribute
- the metadata URI
- the voting power of undistributed tokens
- the recipient of swept funds

This contract also allows owners to perform several other admin functions
- updating the contract owner
- sweeping tokens and native currency to a recipient

This contract tracks beneficiary voting power through an internal ERC20Votes token that cannot be transferred. The
beneficiary must delegate to an address to use this voting power. Their voting power decreases when the token is claimed.

_Updates to the contract must follow these constraints:
- If a merkle root update alters the total token quantity to distribute across all users, also adjust the total value.
  The DistributionRecord for each beneficiary updated in the merkle root will be incorrect until a claim is executed.
- If the total changes, make sure to add or withdraw tokens being distributed to match the new total._

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, uint256 _fractionDenominator, uint160 _maxDelayTime, uint160 _salt) internal
```

### _initializeDistributionRecord

```solidity
function _initializeDistributionRecord(address beneficiary, uint256 totalAmount) internal virtual
```

### _executeClaim

```solidity
function _executeClaim(address beneficiary, uint256 totalAmount) internal virtual returns (uint256 _claimed)
```

### adjust

```solidity
function adjust(address beneficiary, int256 amount) external
```

_Adjust the quantity claimable by a user, overriding the value in the distribution record.

Note: If used in combination with merkle proofs, adjustments to a beneficiary's total could be
reset by anyone to the value in the merkle leaf at any time. Update the merkle root instead.

Amount is limited to type(uint120).max to allow each DistributionRecord to be packed into a single storage slot._

### _setToken

```solidity
function _setToken(contract IERC20 _token) internal virtual
```

### setToken

```solidity
function setToken(contract IERC20 _token) external virtual
```

### _setTotal

```solidity
function _setTotal(uint256 _total) internal virtual
```

### setTotal

```solidity
function setTotal(uint256 _total) external virtual
```

### setUri

```solidity
function setUri(string _uri) external
```

### setSweepRecipient

```solidity
function setSweepRecipient(address payable _recipient) external
```

### getTotalVotes

```solidity
function getTotalVotes() external view returns (uint256)
```

### getVoteFactor

```solidity
function getVoteFactor(address) external view returns (uint256)
```

### setVoteFactor

```solidity
function setVoteFactor(uint256 _voteFactor) external
```

Set the voting power of undistributed tokens

_The vote factor can be any integer. If voteFactor / fractionDenominator == 1,
one unclaimed token provides one vote. If voteFactor / fractionDenominator == 2, one
unclaimed token counts as two votes._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _voteFactor | uint256 | The voting power multiplier as a fraction of fractionDenominator |

### _approve

```solidity
function _approve(address, address, uint256) internal pure
```

_the internal token used only for tracking voting power cannot be transferred_

### _transfer

```solidity
function _transfer(address, address, uint256) internal pure
```

_the internal token used only f	or tracking voting power cannot be transferred_

## ContinuousVesting

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, uint256 _start, uint256 _cliff, uint256 _end, uint160 _maxDelayTime, uint160 _salt) internal
```

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view returns (uint256)
```

### getVestingConfig

```solidity
function getVestingConfig() external view returns (uint256, uint256, uint256)
```

### setVestingConfig

```solidity
function setVestingConfig(uint256 _start, uint256 _cliff, uint256 _end) external
```

## CrosschainDistributor

### connext

```solidity
contract IConnext connext
```

### domain

```solidity
uint32 domain
```

### onlyConnext

```solidity
modifier onlyConnext()
```

Throws if the msg.sender is not connext

### constructor

```solidity
constructor(contract IConnext _connext, uint256 _total) internal
```

### _allowConnext

```solidity
function _allowConnext(uint256 amount) internal
```

_allows Connext to withdraw tokens for cross-chain settlement. Connext may withdraw up to
  the remaining quantity of tokens that can be claimed - the allowance must be set for cross-chain claims._

### _setTotal

```solidity
function _setTotal(uint256 _total) internal virtual
```

Reset Connext allowance when total is updated

### _setToken

```solidity
function _setToken(contract IERC20 _token) internal virtual
```

Reset Connext allowance when token is updated

### _settleClaim

```solidity
function _settleClaim(address _beneficiary, address _recipient, uint32 _recipientDomain, uint256 _amount) internal virtual
```

Settles claimed tokens to any valid Connext domain.

_permissions are not checked: call only after a valid claim is executed
assumes connext fees are paid in native assets, not from the claim total_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _beneficiary | address |  |
| _recipient | address |  |
| _recipientDomain | uint32 |  |
| _amount | uint256 |  |

## CrosschainMerkleDistributor

Distributes funds to beneficiaries listed in a merkle proof on Connext-compatible chains. If a beneficiary is listed in multiple leaves,
they can claim at most the max(amounts) rather than sum(amounts) -- each beneficiary gets a single distribution record across all chains or merkle leaves.

_There are three ways to claim funds from this contract:

1. `claimBySignature` allows any address to claim funds on behalf of an EOA beneficiary to any Connext domain and recipient address (including recipients and domains not in the merkle leaf) by providing a merkle proof and beneficiary signature
2. `claimByMerkleProof` allows any address to claim funds on behalf of a beneficiary to the Connext domain and address specified in the merkle leaf by providing a merkle proof
3. `xReceive` allows any address on another Connext domain to claim funds on behalf of a beneficiary to the connext domain and address specified in the merkle leaf by providing a merkle proof

A note on the merkle tree structure:

The leaf structure used is: `hash(beneficiary, total, beneficiaryDomain)`.

The contract is designed to support claims by both EOAs and contracts. If the beneficiary
is a contract, the merkle leaf domain must match the contract domain. In this case, you can only guarantee the beneficiary
controls their address on the domain the claim was initiated from (contracts do not share
addresses across chains). Including the domain context in the leaf allows the contract to
enforce this assertion via merkle proofs instead of using an authorized call (see:
https://docs.connext.network/developers/guides/authentication)._

### Foo

```solidity
event Foo(address bar)
```

### constructor

```solidity
constructor(contract IConnext _connext, bytes32 _merkleRoot, uint256 _total) internal
```

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(uint32 _domain, address _beneficiary, uint256 _amount, bytes32[] merkleProof) external
```

_public method to initialize a distribution record: requires a valid merkle proof_

### xReceive

```solidity
function xReceive(bytes32, uint256, address, address, uint32, bytes _callData) external returns (bytes)
```

Used for cross-chain claims via Satellite, which triggers claims through Connext.

_This method is only callable by Connext, but anyone on any other Connext domain can
trigger this method call on behalf of a beneficiary. Claimed funds will always be sent to
the beneficiary address and beneficiary domain set in the merkle proof._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
|  | bytes32 |  |
|  | uint256 |  |
|  | address |  |
|  | address |  |
|  | uint32 |  |
| _callData | bytes | Calldata from origin initiator (Satellite). Should include proof, leaf information, and recipient information |

### claimByMerkleProof

```solidity
function claimByMerkleProof(address _beneficiary, uint256 _total, bytes32[] _proof) external payable
```

Claim tokens for a beneficiary using a merkle proof

_This method can be called by anyone, but claimed funds will always be sent to the
beneficiary address and domain set in the merkle proof._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _beneficiary | address | The address of the beneficiary |
| _total | uint256 | The total claimable amount for this beneficiary |
| _proof | bytes32[] | The merkle proof |

### claimBySignature

```solidity
function claimBySignature(address _recipient, uint32 _recipientDomain, address _beneficiary, uint32 _beneficiaryDomain, uint256 _total, bytes _signature, bytes32[] _proof) external payable
```

Claim tokens for a beneficiary using a merkle proof and beneficiary signature. The beneficiary
may specify any Connext domain and recipient address to receive the tokens. Will validate
the proof and beneficiary signature, track the claim, and forward the funds to the designated
recipient on the designated chain.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _recipient | address | The address to receive the claimed tokens |
| _recipientDomain | uint32 | The domain of the recipient |
| _beneficiary | address | The address eligible to claim tokens based on a merkle leaf |
| _beneficiaryDomain | uint32 | The domain of the beneficiary set in a merkle leaf |
| _total | uint256 | The total quantity of tokens the beneficiary is eligible to claim |
| _signature | bytes | The signature of the beneficiary on the leaf |
| _proof | bytes32[] | The merkle proof of the beneficiary leaf |

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

Allows the owner update the merkle root

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _merkleRoot | bytes32 | The new merkle root |

### _recoverSignature

```solidity
function _recoverSignature(bytes32 _signed, bytes _sig) internal pure returns (address)
```

Recover the signing address from an encoded payload.

_Will hash and convert to an eth signed message._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signed | bytes32 | The hash that was signed. |
| _sig | bytes | The signature from which we will recover the signer. |

### _getLeaf

```solidity
function _getLeaf(address _beneficiary, uint256 _total, uint32 _domain) internal pure returns (bytes32 _leaf)
```

Generates the leaf from plaintext

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _beneficiary | address | Beneficiary address on domain |
| _total | uint256 | Total claim amount for the beneficiary |
| _domain | uint32 | Beneficiary domain |

## Distributor

Distributes funds to beneficiaries and tracks distribution status

### records

```solidity
mapping(address => struct DistributionRecord) records
```

### token

```solidity
contract IERC20 token
```

_get the ERC20 token being distributed_

### total

```solidity
uint256 total
```

_get the total distribution quantity across all beneficiaries_

### claimed

```solidity
uint256 claimed
```

### uri

```solidity
string uri
```

_get a URI for additional information about the distribution_

### fractionDenominator

```solidity
uint256 fractionDenominator
```

### NAME

```solidity
function NAME() external view virtual returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external view virtual returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _fractionDenominator) internal
```

### _initializeDistributionRecord

```solidity
function _initializeDistributionRecord(address beneficiary, uint256 _totalAmount) internal virtual
```

_Set up the distribution record for a user. Permissions are not checked in this function.
Amount is limited to type(uint120).max to allow each DistributionRecord to be packed into a single storage slot._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | The address of the beneficiary |
| _totalAmount | uint256 | The total amount of tokens to be distributed to the beneficiary |

### _executeClaim

```solidity
function _executeClaim(address beneficiary, uint256 _totalAmount) internal virtual returns (uint256)
```

Record the claim internally:

_This function does not check permissions: caller must verify the claim is valid!
this function should not call any untrusted external contracts to avoid reentrancy_

### _settleClaim

```solidity
function _settleClaim(address _recipient, uint256 _amount) internal virtual
```

_Move tokens associated with the claim to the recipient. This function should be called
after the claim has been executed internally to avoid reentrancy issues._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _recipient | address | The address of the recipient |
| _amount | uint256 | The amount of tokens to be transferred during this claim |

### getDistributionRecord

```solidity
function getDistributionRecord(address beneficiary) external view virtual returns (struct DistributionRecord)
```

return a distribution record

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view virtual returns (uint256)
```

### getFractionDenominator

```solidity
function getFractionDenominator() public view returns (uint256)
```

_get the denominator for vesting fractions represented as integers_

### getClaimableAmount

```solidity
function getClaimableAmount(address beneficiary) public view virtual returns (uint256)
```

_get the amount of tokens currently claimable by a beneficiary_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

## MerkleSet

Checks merkle proofs

_Contracts inheriting from MerkleSet may update the merkle root whenever desired._

### constructor

```solidity
constructor(bytes32 _merkleRoot) public
```

### validMerkleProof

```solidity
modifier validMerkleProof(bytes32 leaf, bytes32[] merkleProof)
```

### _testMembership

```solidity
function _testMembership(bytes32 leaf, bytes32[] merkleProof) internal view returns (bool)
```

Tests membership in the merkle set

### getMerkleRoot

```solidity
function getMerkleRoot() public view returns (bytes32)
```

### _verifyMembership

```solidity
function _verifyMembership(bytes32 leaf, bytes32[] merkleProof) internal view
```

_Verifies membership in the merkle set_

### _setMerkleRoot

```solidity
function _setMerkleRoot(bytes32 _merkleRoot) internal
```

_Updates the merkle root_

## PriceTierVesting

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, uint256 _start, uint256 _end, contract IOracleOrL2OracleWithSequencerCheck _oracle, struct PriceTier[] _tiers, uint160 _maxDelayTime, uint160 _salt) internal
```

### getStart

```solidity
function getStart() external view returns (uint256)
```

### getEnd

```solidity
function getEnd() external view returns (uint256)
```

### getOracle

```solidity
function getOracle() external view returns (contract IOracleOrL2OracleWithSequencerCheck)
```

### getPriceTier

```solidity
function getPriceTier(uint256 i) public view returns (struct PriceTier)
```

### getPriceTiers

```solidity
function getPriceTiers() public view returns (struct PriceTier[])
```

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view returns (uint256)
```

### setPriceTiers

```solidity
function setPriceTiers(uint256 _start, uint256 _end, contract IOracleOrL2OracleWithSequencerCheck _oracle, struct PriceTier[] _tiers) external
```

## TrancheVesting

Distributes funds to beneficiaries over time in tranches.

### constructor

```solidity
constructor(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, struct Tranche[] _tranches, uint160 _maxDelayTime, uint160 _salt) internal
```

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view returns (uint256)
```

Get the vested fraction for a beneficiary at a given time.

_Before the first tranche time, the vested fraction will be 0. At times between
tranche_i and tranche_i+1, the vested fraction will be tranche_i+1's vested fraction.
After the last tranche time, the vested fraction will be the fraction denominator._

### getTranche

```solidity
function getTranche(uint256 i) public view returns (struct Tranche)
```

### getTranches

```solidity
function getTranches() public view returns (struct Tranche[])
```

### setTranches

```solidity
function setTranches(struct Tranche[] _tranches) external
```

Set the vesting tranches. Tranches must be sorted by time and vested fraction must monotonically increase.
The last tranche must vest all tokens (vestedFraction == fractionDenominator)

## AdvancedDistributorInitializable

Distributes tokens to beneficiaries with voting-while-vesting and administrative controls.
The contract owner can control these distribution parameters:
- the merkle root determining all distribution details
- adjustments to specific distributions
- the token being distributed
- the total amount to distribute
- the metadata URI
- the voting power of undistributed tokens
- the recipient of swept funds

This contract also allows owners to perform several other admin functions
- updating the contract owner
- sweeping tokens and native currency to a recipient

This contract tracks beneficiary voting power through an internal ERC20Votes token that cannot be transferred. The
beneficiary must delegate to an address to use this voting power. Their voting power decreases when the token is claimed.

_Updates to the contract must follow these constraints:
- If a merkle root update alters the total token quantity to distribute across all users, also adjust the total value.
  The DistributionRecord for each beneficiary updated in the merkle root will be incorrect until a claim is executed.
- If the total changes, make sure to add or withdraw tokens being distributed to match the new total._

### constructor

```solidity
constructor() internal
```

### __AdvancedDistributor_init

```solidity
function __AdvancedDistributor_init(contract IERC20 _token, uint256 _total, string _uri, uint256 _voteFactor, uint256 _fractionDenominator, uint160 _maxDelayTime, uint160 _salt, address _owner) internal
```

### _initializeDistributionRecord

```solidity
function _initializeDistributionRecord(address beneficiary, uint256 totalAmount) internal virtual
```

### _executeClaim

```solidity
function _executeClaim(address beneficiary, uint256 totalAmount) internal virtual returns (uint256 _claimed)
```

### adjust

```solidity
function adjust(address beneficiary, int256 amount) external
```

_Adjust the quantity claimable by a user, overriding the value in the distribution record.

Note: If used in combination with merkle proofs, adjustments to a beneficiary's total could be
reset by anyone to the value in the merkle leaf at any time. Update the merkle root instead.

Amount is limited to type(uint120).max to allow each DistributionRecord to be packed into a single storage slot._

### _setToken

```solidity
function _setToken(contract IERC20 _token) internal virtual
```

### setToken

```solidity
function setToken(contract IERC20 _token) external virtual
```

### _setTotal

```solidity
function _setTotal(uint256 _total) internal virtual
```

### setTotal

```solidity
function setTotal(uint256 _total) external virtual
```

### setUri

```solidity
function setUri(string _uri) external
```

### setSweepRecipient

```solidity
function setSweepRecipient(address payable _recipient) external
```

### getTotalVotes

```solidity
function getTotalVotes() external view returns (uint256)
```

### getVoteFactor

```solidity
function getVoteFactor(address) external view returns (uint256)
```

### setVoteFactor

```solidity
function setVoteFactor(uint256 _voteFactor) external
```

Set the voting power of undistributed tokens

_The vote factor can be any integer. If voteFactor / fractionDenominator == 1,
one unclaimed token provides one vote. If voteFactor / fractionDenominator == 2, one
unclaimed token counts as two votes._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _voteFactor | uint256 | The voting power multiplier as a fraction of fractionDenominator |

### _approve

```solidity
function _approve(address, address, uint256) internal pure
```

_the internal token used only for tracking voting power cannot be transferred_

### _transfer

```solidity
function _transfer(address, address, uint256) internal pure
```

_the internal token used only for tracking voting power cannot be transferred_

## ContinuousVestingInitializable

### __ContinuousVesting_init

```solidity
function __ContinuousVesting_init(contract IERC20 _token, uint256 _total, string _uri, uint256 _start, uint256 _cliff, uint256 _end, uint160 _maxDelayTime, uint160 _salt, address _owner) internal
```

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view returns (uint256)
```

### getVestingConfig

```solidity
function getVestingConfig() external view returns (uint256, uint256, uint256)
```

### setVestingConfig

```solidity
function setVestingConfig(uint256 _start, uint256 _cliff, uint256 _end) external
```

## ContinuousVestingMerkleDistributor

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(contract IERC20 _token, uint256 _total, string _uri, uint256 _start, uint256 _cliff, uint256 _end, bytes32 _merkleRoot, uint160 _maxDelayTime, address _owner) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(uint256 index, address beneficiary, uint256 amount, bytes32[] merkleProof) external
```

### claim

```solidity
function claim(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof) external
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

## ContinuousVestingMerkleDistributorFactory

### distributors

```solidity
address[] distributors
```

### DistributorDeployed

```solidity
event DistributorDeployed(address distributor)
```

### constructor

```solidity
constructor(address implementation) public
```

### deployDistributor

```solidity
function deployDistributor(contract IERC20 _token, uint256 _total, string _uri, uint256 _start, uint256 _cliff, uint256 _end, bytes32 _merkleRoot, uint160 _maxDelayTime, address _owner, uint256 _nonce) public returns (contract ContinuousVestingMerkleDistributor distributor)
```

### getImplementation

```solidity
function getImplementation() public view returns (address)
```

### predictDistributorAddress

```solidity
function predictDistributorAddress(contract IERC20 _token, uint256 _total, string _uri, uint256 _start, uint256 _cliff, uint256 _end, bytes32 _merkleRoot, uint160 _maxDelayTime, address _owner, uint256 _nonce) public view returns (address)
```

## DistributorInitializable

Distributes funds to beneficiaries and tracks distribution status

### records

```solidity
mapping(address => struct DistributionRecord) records
```

### token

```solidity
contract IERC20 token
```

_get the ERC20 token being distributed_

### total

```solidity
uint256 total
```

_get the total distribution quantity across all beneficiaries_

### claimed

```solidity
uint256 claimed
```

### uri

```solidity
string uri
```

_get a URI for additional information about the distribution_

### fractionDenominator

```solidity
uint256 fractionDenominator
```

### NAME

```solidity
function NAME() external view virtual returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external view virtual returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### __Distributor_init

```solidity
function __Distributor_init(contract IERC20 _token, uint256 _total, string _uri, uint256 _fractionDenominator) internal
```

### _initializeDistributionRecord

```solidity
function _initializeDistributionRecord(address beneficiary, uint256 _totalAmount) internal virtual
```

_Set up the distribution record for a user. Permissions are not checked in this function.
Amount is limited to type(uint120).max to allow each DistributionRecord to be packed into a single storage slot._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | The address of the beneficiary |
| _totalAmount | uint256 | The total amount of tokens to be distributed to the beneficiary |

### _executeClaim

```solidity
function _executeClaim(address beneficiary, uint256 _totalAmount) internal virtual returns (uint256)
```

Record the claim internally:

_This function does not check permissions: caller must verify the claim is valid!
this function should not call any untrusted external contracts to avoid reentrancy_

### _settleClaim

```solidity
function _settleClaim(address _recipient, uint256 _amount) internal virtual
```

_Move tokens associated with the claim to the recipient. This function should be called
after the claim has been executed internally to avoid reentrancy issues._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _recipient | address | The address of the recipient |
| _amount | uint256 | The amount of tokens to be transferred during this claim |

### getDistributionRecord

```solidity
function getDistributionRecord(address beneficiary) external view virtual returns (struct DistributionRecord)
```

return a distribution record

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view virtual returns (uint256)
```

### getFractionDenominator

```solidity
function getFractionDenominator() public view returns (uint256)
```

_get the denominator for vesting fractions represented as integers_

### getClaimableAmount

```solidity
function getClaimableAmount(address beneficiary) public view virtual returns (uint256)
```

_get the amount of tokens currently claimable by a beneficiary_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

## FairQueueInitializable

Fairly assigns a delay time to each address from a uniform distribution over [0, maxDelayTime]

_The delay is determined by calculating a distance between the user's address and a pseudorandom value based on a provided salt and a blockhash
using the XOR distance metric. Do not use this contract if the event is public because users could grind addresses until they find one with a low delay._

### SetDelay

```solidity
event SetDelay(uint160 maxDelayTime)
```

### distancePerSecond

```solidity
uint160 distancePerSecond
```

calculate a speed at which the queue is exhausted such that all users complete the queue by maxDelayTime

### maxDelayTime

```solidity
uint160 maxDelayTime
```

### randomValue

```solidity
uint160 randomValue
```

_the random value from which a distance will be calculated for each address. Reset the random value
to shuffle the delays for all addresses._

### __FairQueue_init

```solidity
function __FairQueue_init(uint160 _maxDelayTime, uint160 salt) internal
```

### _setPseudorandomValue

```solidity
function _setPseudorandomValue(uint160 salt) internal
```

_internal function to set the random value. A salt (e.g. from a merkle root) is required to prevent
naive manipulation of the random value by validators_

### _setDelay

```solidity
function _setDelay(uint160 _maxDelayTime) internal
```

_Internal function to configure delay
	@param _maxDelayTime the maximum delay for any address in seconds. Set this value to 0 to disable delays entirely._

### getFairDelayTime

```solidity
function getFairDelayTime(address user) public view returns (uint256)
```

get a fixed delay for any address by drawing from a unform distribution over the interval [0, maxDelay]
		@param user The address for which a delay should be calculated. The delay is deterministic for any given address and pseudorandom value.
		@dev The delay is determined by calculating a distance between the user's address and a pseudorandom value using the XOR distance metric (c.f. Kademlia)

		Users cannot exploit the fair delay if:
		- The event is private, i.e. an access list of some form is required
		- Each eligible user gets exactly one address in the access list
		- There is no collusion between event participants, block validators, and event owners

		The threat of collusion is likely minimal:
		- the economic opportunity to validators is zero or relatively small (only specific addresses can participate in private events, and a lower delay time does not imply higher returns)
		- event owners are usually trying to achieve a fair distribution of access to their event

## MerkleSetInitializable

Checks merkle proofs

_Contracts inheriting from MerkleSet may update the merkle root whenever desired._

### __MerkleSet_init

```solidity
function __MerkleSet_init(bytes32 _merkleRoot) internal
```

### validMerkleProof

```solidity
modifier validMerkleProof(bytes32 leaf, bytes32[] merkleProof)
```

### _testMembership

```solidity
function _testMembership(bytes32 leaf, bytes32[] merkleProof) internal view returns (bool)
```

Tests membership in the merkle set

### getMerkleRoot

```solidity
function getMerkleRoot() public view returns (bytes32)
```

### _verifyMembership

```solidity
function _verifyMembership(bytes32 leaf, bytes32[] merkleProof) internal view
```

_Verifies membership in the merkle set_

### _setMerkleRoot

```solidity
function _setMerkleRoot(bytes32 _merkleRoot) internal
```

_Updates the merkle root_

## TrancheVestingInitializable

### __TrancheVesting_init

```solidity
function __TrancheVesting_init(contract IERC20 _token, uint256 _total, string _uri, struct Tranche[] _tranches, uint160 _maxDelayTime, uint160 _salt, address _owner) internal
```

### getVestedFraction

```solidity
function getVestedFraction(address beneficiary, uint256 time) public view returns (uint256)
```

Get the vested fraction for a beneficiary at a given time.

_Before the first tranche time, the vested fraction will be 0. At times between
tranche_i and tranche_i+1, the vested fraction will be tranche_i+1's vested fraction.
After the last tranche time, the vested fraction will be the fraction denominator._

### getTranche

```solidity
function getTranche(uint256 i) public view returns (struct Tranche)
```

### getTranches

```solidity
function getTranches() public view returns (struct Tranche[])
```

### setTranches

```solidity
function setTranches(struct Tranche[] _tranches) external
```

Set the vesting tranches. Tranches must be sorted by time and vested fraction must monotonically increase.
The last tranche must vest all tokens (vestedFraction == fractionDenominator)

## TrancheVestingMerkleDistributor

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(contract IERC20 _token, uint256 _total, string _uri, struct Tranche[] _tranches, bytes32 _merkleRoot, uint160 _maxDelayTime, address _owner) public
```

### NAME

```solidity
function NAME() external pure returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### initializeDistributionRecord

```solidity
function initializeDistributionRecord(uint256 index, address beneficiary, uint256 amount, bytes32[] merkleProof) external
```

### claim

```solidity
function claim(uint256 index, address beneficiary, uint256 totalAmount, bytes32[] merkleProof) external
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 _merkleRoot) external
```

## TrancheVestingMerkleDistributorFactory

### distributors

```solidity
address[] distributors
```

### DistributorDeployed

```solidity
event DistributorDeployed(address distributor)
```

### constructor

```solidity
constructor(address implementation) public
```

### deployDistributor

```solidity
function deployDistributor(contract IERC20 _token, uint256 _total, string _uri, struct Tranche[] _tranches, bytes32 _merkleRoot, uint160 _maxDelayTime, address _owner, uint256 _nonce) public returns (contract TrancheVestingMerkleDistributor distributor)
```

### getImplementation

```solidity
function getImplementation() public view returns (address)
```

### predictDistributorAddress

```solidity
function predictDistributorAddress(contract IERC20 _token, uint256 _total, string _uri, struct Tranche[] _tranches, bytes32 _merkleRoot, uint160 _maxDelayTime, address _owner, uint256 _nonce) public view returns (address)
```

## GovernorMultiSourceUpgradeable

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(contract IVotesUpgradeable _token, contract TimelockControllerUpgradeable _timelock, contract IVotesUpgradeable[] _voteSources) public virtual
```

### NAME

```solidity
function NAME() external pure returns (string)
```

### VERSION

```solidity
function VERSION() external pure returns (uint256)
```

### votingDelay

```solidity
function votingDelay() public pure virtual returns (uint256)
```

module:user-config

_Delay, in number of block, between the proposal is created and the vote starts. This can be increassed to
leave time for users to buy voting power, or delegate it, before the voting of a proposal starts._

### votingPeriod

```solidity
function votingPeriod() public pure virtual returns (uint256)
```

module:user-config

_Delay, in number of blocks, between the vote start and vote ends.

NOTE: The {votingDelay} can delay the start of the vote. This must be considered when setting the voting
duration compared to the voting delay._

### proposalThreshold

```solidity
function proposalThreshold() public pure returns (uint256)
```

_Part of the Governor Bravo's interface: _"The number of votes required in order for a voter to become a proposer"_._

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal
```

_Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
{upgradeTo} and {upgradeToAndCall}.

Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.

```solidity
function _authorizeUpgrade(address) internal override onlyOwner {}
```_

### _getVotes

```solidity
function _getVotes(address account, uint256 blockNumber, bytes _data) internal view returns (uint256 votes)
```

### quorum

```solidity
function quorum(uint256 blockNumber) public view returns (uint256)
```

### state

```solidity
function state(uint256 proposalId) public view returns (enum IGovernorUpgradeable.ProposalState)
```

### propose

```solidity
function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) public returns (uint256)
```

### _execute

```solidity
function _execute(uint256 proposalId, address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) internal
```

### _cancel

```solidity
function _cancel(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) internal returns (uint256)
```

### _executor

```solidity
function _executor() internal view returns (address)
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

## GovernorVotesMultiSourceUpgradeable

### validVoteSources

```solidity
modifier validVoteSources(contract IVotesUpgradeable[] _voteSources)
```

### __GovernorVotesMultiSource_init

```solidity
function __GovernorVotesMultiSource_init(contract IVotesUpgradeable tokenAddress, contract IVotesUpgradeable[] _voteSources) internal
```

### __GovernorVotesMultiSource_init__unchained

```solidity
function __GovernorVotesMultiSource_init__unchained(contract IVotesUpgradeable tokenAddress, contract IVotesUpgradeable[] _voteSources) internal
```

### _getVotes

```solidity
function _getVotes(address account, uint256 blockNumber, bytes _data) internal view virtual returns (uint256 votes)
```

Modified from open zeppelin defaults

### setVoteSources

```solidity
function setVoteSources(contract IVotesUpgradeable[] _voteSources) public
```

New function allowing the DAO to update its vote sources

### getVoteSources

```solidity
function getVoteSources() public view returns (contract IVotesUpgradeable[])
```

## MyTimelockControllerUpgradeable

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(uint256 minDelay, address[] proposers, address[] executors) public
```

## IAdjustable

_Interface for the Adjustable contract. Defines methods to update
the contract and events emitted upon update._

### Adjust

```solidity
event Adjust(address beneficiary, int256 amount)
```

### SetToken

```solidity
event SetToken(contract IERC20 token)
```

### SetTotal

```solidity
event SetTotal(uint256 total)
```

### SetUri

```solidity
event SetUri(string uri)
```

### adjust

```solidity
function adjust(address beneficiary, int256 amount) external
```

### setToken

```solidity
function setToken(contract IERC20 token) external
```

### setTotal

```solidity
function setTotal(uint256 total) external
```

### setUri

```solidity
function setUri(string uri) external
```

### setVoteFactor

```solidity
function setVoteFactor(uint256 setVoteFactor) external
```

## IConnext

### xcall

```solidity
function xcall(uint32 _destination, address _to, address _asset, address _delegate, uint256 _amount, uint256 _slippage, bytes _callData) external payable returns (bytes32)
```

### xcall

```solidity
function xcall(uint32 _destination, address _to, address _asset, address _delegate, uint256 _amount, uint256 _slippage, bytes _callData, uint256 _relayerFee) external returns (bytes32)
```

### xcallIntoLocal

```solidity
function xcallIntoLocal(uint32 _destination, address _to, address _asset, address _delegate, uint256 _amount, uint256 _slippage, bytes _callData) external payable returns (bytes32)
```

### domain

```solidity
function domain() external view returns (uint256)
```

## IContinuousVesting

### SetContinuousVesting

```solidity
event SetContinuousVesting(uint256 start, uint256 cliff, uint256 end)
```

### getVestingConfig

```solidity
function getVestingConfig() external view returns (uint256, uint256, uint256)
```

### setVestingConfig

```solidity
function setVestingConfig(uint256 _start, uint256 _cliff, uint256 _end) external
```

## ICrosschain

Defines functions and events for receiving and tracking crosschain claims

### CrosschainClaim

```solidity
event CrosschainClaim(bytes32 id, address beneficiary, address recipient, uint32 recipientDomain, uint256 amount)
```

_The beneficiary and recipient may be different addresses. The beneficiary is the address
eligible to receive the claim, and the recipient is where the funds are actually sent._

## DistributionRecord

_This struct tracks claim progress for a given beneficiary.
Because many claims are stored in a merkle root, this struct is only valid once initialized.
Users can no longer claim once their claimed quantity meets or exceeds their total quantity.
Note that admins may update the merkle root or adjust the total quantity for a specific
beneficiary after initialization!_

```solidity
struct DistributionRecord {
  bool initialized;
  uint120 total;
  uint120 claimed;
}
```

## IDistributor

### InitializeDistributor

```solidity
event InitializeDistributor(contract IERC20 token, uint256 total, string uri, uint256 fractionDenominator)
```

### InitializeDistributionRecord

```solidity
event InitializeDistributionRecord(address beneficiary, uint256 total)
```

### Claim

```solidity
event Claim(address beneficiary, uint256 amount)
```

### getDistributionRecord

```solidity
function getDistributionRecord(address beneficiary) external view returns (struct DistributionRecord)
```

_get the current distribution status for a particular user_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

### getClaimableAmount

```solidity
function getClaimableAmount(address beneficiary) external view returns (uint256)
```

_get the amount of tokens currently claimable by a beneficiary_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | the address of the beneficiary |

### getFractionDenominator

```solidity
function getFractionDenominator() external view returns (uint256)
```

_get the denominator for vesting fractions represented as integers_

### token

```solidity
function token() external view returns (contract IERC20)
```

_get the ERC20 token being distributed_

### total

```solidity
function total() external view returns (uint256)
```

_get the total distribution quantity across all beneficiaries_

### uri

```solidity
function uri() external view returns (string)
```

_get a URI for additional information about the distribution_

### NAME

```solidity
function NAME() external view returns (string)
```

_get a human-readable name for the distributor that describes basic functionality
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

### VERSION

```solidity
function VERSION() external view returns (uint256)
```

_get a human-readable version for the distributor that describes basic functionality
The version should update whenever functionality significantly changes
On-chain consumers should rely on registered ERC165 interface IDs or similar for more specificity_

## IERC20Extended

### decimals

```solidity
function decimals() external view returns (uint8)
```

## IHashflowQuote

### RFQTQuote

```solidity
struct RFQTQuote {
  address pool;
  address externalAccount;
  address trader;
  address effectiveTrader;
  address baseToken;
  address quoteToken;
  uint256 effectiveBaseTokenAmount;
  uint256 maxBaseTokenAmount;
  uint256 maxQuoteTokenAmount;
  uint256 quoteExpiry;
  uint256 nonce;
  bytes32 txid;
  bytes signature;
}
```

### XChainRFQTQuote

```solidity
struct XChainRFQTQuote {
  uint16 srcChainId;
  uint16 dstChainId;
  address srcPool;
  bytes32 dstPool;
  address srcExternalAccount;
  bytes32 dstExternalAccount;
  address trader;
  address baseToken;
  address quoteToken;
  uint256 baseTokenAmount;
  uint256 quoteTokenAmount;
  uint256 quoteExpiry;
  uint256 nonce;
  bytes32 txid;
  bytes signature;
}
```

### XChainMessageProtocol

```solidity
enum XChainMessageProtocol {
  layerZero,
  wormhole
}
```

### tradeSingleHop

```solidity
function tradeSingleHop(struct IHashflowQuote.RFQTQuote quote) external payable
```

### tradeXChain

```solidity
function tradeXChain(struct IHashflowQuote.XChainRFQTQuote quote, enum IHashflowQuote.XChainMessageProtocol protocol) external payable
```

## IMerkleSet

### SetMerkleRoot

```solidity
event SetMerkleRoot(bytes32 merkleRoot)
```

### getMerkleRoot

```solidity
function getMerkleRoot() external view returns (bytes32 root)
```

## IOracleOrL2OracleWithSequencerCheck

### decimals

```solidity
function decimals() external view returns (uint8)
```

### latestRoundData

```solidity
function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

## PriceTier

```solidity
struct PriceTier {
  uint128 price;
  uint128 vestedFraction;
}
```

## IPriceTierVesting

### SetPriceTierConfig

```solidity
event SetPriceTierConfig(uint256 start, uint256 end, contract IOracleOrL2OracleWithSequencerCheck oracle, struct PriceTier[] tiers)
```

### getStart

```solidity
function getStart() external view returns (uint256)
```

### getEnd

```solidity
function getEnd() external view returns (uint256)
```

### getOracle

```solidity
function getOracle() external view returns (contract IOracleOrL2OracleWithSequencerCheck)
```

### getPriceTier

```solidity
function getPriceTier(uint256 i) external view returns (struct PriceTier)
```

### getPriceTiers

```solidity
function getPriceTiers() external view returns (struct PriceTier[])
```

### setPriceTiers

```solidity
function setPriceTiers(uint256 _start, uint256 _end, contract IOracleOrL2OracleWithSequencerCheck _oracle, struct PriceTier[] _tiers) external
```

## Tranche

```solidity
struct Tranche {
  uint128 time;
  uint128 vestedFraction;
}
```

## ITrancheVesting

### SetTranche

```solidity
event SetTranche(uint256 index, uint128 time, uint128 VestedFraction)
```

### getTranche

```solidity
function getTranche(uint256 i) external view returns (struct Tranche)
```

### getTranches

```solidity
function getTranches() external view returns (struct Tranche[])
```

### setTranches

```solidity
function setTranches(struct Tranche[] _tranches) external
```

## IVesting

### getVestedFraction

```solidity
function getVestedFraction(address, uint256 time) external returns (uint256)
```

## IVoting

### SetVoteFactor

```solidity
event SetVoteFactor(uint256 voteFactor)
```

### getTotalVotes

```solidity
function getTotalVotes() external view returns (uint256)
```

### getVoteFactor

```solidity
function getVoteFactor(address account) external view returns (uint256)
```

## IXReceiver

### xReceive

```solidity
function xReceive(bytes32 _transferId, uint256 _amount, address _asset, address _originSender, uint32 _origin, bytes _callData) external returns (bytes)
```

## ConnextMock

### XCalled

```solidity
event XCalled(uint32 destination, address to, address asset, address delegate, uint256 amount, uint256 slippage, bytes callData)
```

### NativeRelayerFeeIncluded

```solidity
event NativeRelayerFeeIncluded(address caller, uint256 amount)
```

### constructor

```solidity
constructor(uint32 domain_) public
```

### domain

```solidity
function domain() public view returns (uint32)
```

### setDomain

```solidity
function setDomain(uint32 domain_) public
```

### xcall

```solidity
function xcall(uint32 _destination, address _to, address _asset, address _delegate, uint256 _amount, uint256 _slippage, bytes _callData) public payable returns (bytes32)
```

### callXreceive

```solidity
function callXreceive(bytes32 _transferId, uint256 _amount, address _asset, address _originSender, uint32 _origin, bytes32[] _proof, address _distributor) public returns (bytes)
```

## FakeChainlinkOracle

### constructor

```solidity
constructor(int256 _answer, string _oracleDescription) public
```

### decimals

```solidity
function decimals() external pure returns (uint8)
```

### description

```solidity
function description() external view returns (string)
```

### version

```solidity
function version() external pure returns (uint256)
```

### setAnswer

```solidity
function setAnswer(int256 _answer) public
```

### latestRoundData

```solidity
function latestRoundData() external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

### getRoundData

```solidity
function getRoundData(uint80) external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

## FakeEthOracle

### constructor

```solidity
constructor(int256 _answer, string _oracleDescription) public
```

### decimals

```solidity
function decimals() external pure returns (uint8)
```

### description

```solidity
function description() external view returns (string)
```

### version

```solidity
function version() external pure returns (uint256)
```

### setAnswer

```solidity
function setAnswer(int256 _answer) public
```

### latestRoundData

```solidity
function latestRoundData() external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

### getRoundData

```solidity
function getRoundData(uint80) external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

## FakeUsdcOracle

### constructor

```solidity
constructor(int256 _answer, string _oracleDescription) public
```

### decimals

```solidity
function decimals() external pure returns (uint8)
```

### description

```solidity
function description() external view returns (string)
```

### version

```solidity
function version() external pure returns (uint256)
```

### setAnswer

```solidity
function setAnswer(int256 _answer) public
```

### latestRoundData

```solidity
function latestRoundData() external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

### getRoundData

```solidity
function getRoundData(uint80) external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

## FakeUsdtOracle

### constructor

```solidity
constructor(int256 _answer, string _oracleDescription) public
```

### decimals

```solidity
function decimals() external pure returns (uint8)
```

### description

```solidity
function description() external view returns (string)
```

### version

```solidity
function version() external pure returns (uint256)
```

### setAnswer

```solidity
function setAnswer(int256 _answer) public
```

### latestRoundData

```solidity
function latestRoundData() external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

### getRoundData

```solidity
function getRoundData(uint80) external view returns (uint80 roundId, int256, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

## FakeSequencerUptimeFeed

### constructor

```solidity
constructor(int256 _answer, string _oracleDescription) public
```

### decimals

```solidity
function decimals() external pure returns (uint8)
```

### description

```solidity
function description() external view returns (string)
```

### version

```solidity
function version() external pure returns (uint256)
```

### setAnswer

```solidity
function setAnswer(int256 _answer) public
```

### getAnswer

```solidity
function getAnswer(uint256) external view returns (int256)
```

### getTimestamp

```solidity
function getTimestamp(uint256) external view returns (uint256)
```

### latestAnswer

```solidity
function latestAnswer() external view returns (int256)
```

### latestRound

```solidity
function latestRound() external pure returns (uint256)
```

### latestTimestamp

```solidity
function latestTimestamp() external view returns (uint256)
```

### latestRoundData

```solidity
function latestRoundData() external view returns (uint80 roundId, int256, uint256, uint256, uint80 answeredInRound)
```

### getRoundData

```solidity
function getRoundData(uint80) external view returns (uint80 roundId, int256, uint256, uint256, uint80 answeredInRound)
```

## GovernorMultiSourceUpgradeableMock

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(contract IVotesUpgradeable _token, contract TimelockControllerUpgradeable _timelock, contract IVotesUpgradeable[] _voteSources) public
```

### votingDelay

```solidity
function votingDelay() public pure returns (uint256)
```

module:user-config

_Delay, in number of block, between the proposal is created and the vote starts. This can be increassed to
leave time for users to buy voting power, or delegate it, before the voting of a proposal starts._

### votingPeriod

```solidity
function votingPeriod() public pure returns (uint256)
```

module:user-config

_Delay, in number of blocks, between the vote start and vote ends.

NOTE: The {votingDelay} can delay the start of the vote. This must be considered when setting the voting
duration compared to the voting delay._

## HashflowRouterMock

### constructor

```solidity
constructor() public
```

### estimateCrossChainFee

```solidity
function estimateCrossChainFee() public pure returns (uint256)
```

### tradeSingleHop

```solidity
function tradeSingleHop(struct IHashflowQuote.RFQTQuote quote) public payable
```

### tradeXChain

```solidity
function tradeXChain(struct IHashflowQuote.XChainRFQTQuote quote, enum IHashflowQuote.XChainMessageProtocol) public payable
```

### depositEth

```solidity
function depositEth() external payable
```

## Metrics

```solidity
struct Metrics {
  uint256 purchaseCount;
  uint256 buyerCount;
  uint256 purchaseTotal;
  mapping(address => uint256) buyerTotal;
}
```

## PaymentTokenInfo

```solidity
struct PaymentTokenInfo {
  contract IOracleOrL2OracleWithSequencerCheck oracle;
  uint8 decimals;
}
```

## SaleManager_v_1_0

### priceOracle

```solidity
contract IOracleOrL2OracleWithSequencerCheck priceOracle
```

### paymentToken

```solidity
contract IERC20 paymentToken
```

### paymentTokenDecimals

```solidity
uint8 paymentTokenDecimals
```

### Sale

```solidity
struct Sale {
  address payable seller;
  bytes32 merkleRoot;
  address claimManager;
  uint256 saleBuyLimit;
  uint256 userBuyLimit;
  uint256 startTime;
  uint256 endTime;
  string name;
  string symbol;
  uint256 price;
  uint8 decimals;
  uint256 totalSpent;
  uint256 maxQueueTime;
  uint160 randomValue;
  mapping(address => uint256) spent;
}
```

### sales

```solidity
mapping(bytes32 => struct SaleManager_v_1_0.Sale) sales
```

### saleCount

```solidity
uint256 saleCount
```

### totalSpent

```solidity
uint256 totalSpent
```

### NewSale

```solidity
event NewSale(bytes32 saleId, bytes32 merkleRoot, address seller, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 maxQueueTime, uint256 startTime, uint256 endTime, string name, string symbol, uint256 price, uint8 decimals)
```

### UpdateStart

```solidity
event UpdateStart(bytes32 saleId, uint256 startTime)
```

### UpdateEnd

```solidity
event UpdateEnd(bytes32 saleId, uint256 endTime)
```

### UpdateMerkleRoot

```solidity
event UpdateMerkleRoot(bytes32 saleId, bytes32 merkleRoot)
```

### UpdateMaxQueueTime

```solidity
event UpdateMaxQueueTime(bytes32 saleId, uint256 maxQueueTime)
```

### Buy

```solidity
event Buy(bytes32 saleId, address buyer, uint256 value, bool native, bytes32[] proof)
```

### RegisterClaimManager

```solidity
event RegisterClaimManager(bytes32 saleId, address claimManager)
```

### constructor

```solidity
constructor(address _paymentToken, uint8 _paymentTokenDecimals, address _priceOracle) public
```

### validSale

```solidity
modifier validSale(bytes32 saleId)
```

### isSeller

```solidity
modifier isSeller(bytes32 saleId)
```

### canAccessSale

```solidity
modifier canAccessSale(bytes32 saleId, bytes32[] proof)
```

### requireOpen

```solidity
modifier requireOpen(bytes32 saleId)
```

### getLatestPrice

```solidity
function getLatestPrice() public view returns (uint256)
```

### getSeller

```solidity
function getSeller(bytes32 saleId) public view returns (address)
```

### getMerkleRoot

```solidity
function getMerkleRoot(bytes32 saleId) public view returns (bytes32)
```

### getPriceOracle

```solidity
function getPriceOracle() public view returns (address)
```

### getClaimManager

```solidity
function getClaimManager(bytes32 saleId) public view returns (address)
```

### getSaleBuyLimit

```solidity
function getSaleBuyLimit(bytes32 saleId) public view returns (uint256)
```

### getUserBuyLimit

```solidity
function getUserBuyLimit(bytes32 saleId) public view returns (uint256)
```

### getStartTime

```solidity
function getStartTime(bytes32 saleId) public view returns (uint256)
```

### getEndTime

```solidity
function getEndTime(bytes32 saleId) public view returns (uint256)
```

### getName

```solidity
function getName(bytes32 saleId) public view returns (string)
```

### getSymbol

```solidity
function getSymbol(bytes32 saleId) public view returns (string)
```

### getPrice

```solidity
function getPrice(bytes32 saleId) public view returns (uint256)
```

### getDecimals

```solidity
function getDecimals(bytes32 saleId) public view returns (uint256)
```

### getTotalSpent

```solidity
function getTotalSpent(bytes32 saleId) public view returns (uint256)
```

### getRandomValue

```solidity
function getRandomValue(bytes32 saleId) public view returns (uint160)
```

### getMaxQueueTime

```solidity
function getMaxQueueTime(bytes32 saleId) public view returns (uint256)
```

### generateRandomishValue

```solidity
function generateRandomishValue(bytes32 merkleRoot) public view returns (uint160)
```

### getFairQueueTime

```solidity
function getFairQueueTime(bytes32 saleId, address buyer) public view returns (uint256)
```

### spentToBought

```solidity
function spentToBought(bytes32 saleId, uint256 spent) public view returns (uint256)
```

### nativeToPaymentToken

```solidity
function nativeToPaymentToken(uint256 nativeValue) public view returns (uint256)
```

### getSpent

```solidity
function getSpent(bytes32 saleId, address userAddress) public view returns (uint256)
```

### getBought

```solidity
function getBought(bytes32 saleId, address userAddress) public view returns (uint256)
```

### isOpen

```solidity
function isOpen(bytes32 saleId) public view returns (bool)
```

### isOver

```solidity
function isOver(bytes32 saleId) public view returns (bool)
```

### newSale

```solidity
function newSale(bytes32 merkleRoot, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 startTime, uint256 endTime, uint160 maxQueueTime, string name, string symbol, uint256 price, uint8 decimals) public returns (bytes32)
```

sale setup and config
  - the address calling this method is the seller: all payments are sent to this address
  - only the seller can change sale configuration

### setStart

```solidity
function setStart(bytes32 saleId, uint256 startTime) public
```

### setEnd

```solidity
function setEnd(bytes32 saleId, uint256 endTime) public
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 saleId, bytes32 merkleRoot) public
```

### setMaxQueueTime

```solidity
function setMaxQueueTime(bytes32 saleId, uint160 maxQueueTime) public
```

### _isAllowed

```solidity
function _isAllowed(bytes32 root, address account, bytes32[] proof) external pure returns (bool)
```

### buy

```solidity
function buy(bytes32 saleId, uint256 tokenQuantity, bytes32[] proof) public
```

### buy

```solidity
function buy(bytes32 saleId, bytes32[] proof) public payable
```

### registerClaimManager

```solidity
function registerClaimManager(bytes32 saleId, address claimManager) public
```

### recoverERC20

```solidity
function recoverERC20(bytes32 saleId, address tokenAddress, uint256 tokenAmount) public
```

## ClaimManager

### Open

```solidity
event Open(uint256 totalClaims)
```

### Void

```solidity
event Void(address claimant, uint256 voidedClaim, bytes32 saleId)
```

### Claim

```solidity
event Claim(address claimant, uint256 amount, bytes32 saleId)
```

### Close

```solidity
event Close()
```

### saleManager

```solidity
contract SaleManager_v_1_2 saleManager
```

### saleId

```solidity
bytes32 saleId
```

### claimToken

```solidity
contract IERC20 claimToken
```

### opened

```solidity
bool opened
```

### voidClaims

```solidity
uint256 voidClaims
```

### remainingClaims

```solidity
uint256 remainingClaims
```

### claimed

```solidity
mapping(address => bool) claimed
```

### constructor

```solidity
constructor(address _saleManager, bytes32 _saleId, address _claimToken) public
```

### isAdmin

```solidity
modifier isAdmin()
```

### saleOver

```solidity
modifier saleOver()
```

### claimsOpened

```solidity
modifier claimsOpened()
```

### getRemainingClaim

```solidity
function getRemainingClaim(address claimant) public view returns (uint256)
```

### getTotalClaimable

```solidity
function getTotalClaimable() public view returns (uint256)
```

### getTokenBalance

```solidity
function getTokenBalance() public view returns (uint256)
```

### void

```solidity
function void(address claimant) public returns (uint256)
```

### open

```solidity
function open() public
```

### claim

```solidity
function claim() public returns (uint256)
```

### recoverERC20

```solidity
function recoverERC20(address tokenAddress, uint256 tokenAmount) public
```

## SaleManager_v_1_2

### priceOracle

```solidity
contract IOracleOrL2OracleWithSequencerCheck priceOracle
```

### paymentToken

```solidity
contract IERC20 paymentToken
```

### paymentTokenDecimals

```solidity
uint8 paymentTokenDecimals
```

### Sale

```solidity
struct Sale {
  address payable recipient;
  address admin;
  bytes32 merkleRoot;
  address claimManager;
  uint256 saleBuyLimit;
  uint256 userBuyLimit;
  uint256 startTime;
  uint256 endTime;
  string uri;
  uint256 price;
  uint8 decimals;
  uint256 totalSpent;
  uint256 maxQueueTime;
  uint160 randomValue;
  mapping(address => uint256) spent;
}
```

### saleCount

```solidity
uint256 saleCount
```

### totalSpent

```solidity
uint256 totalSpent
```

### VERSION

```solidity
string VERSION
```

### NewSale

```solidity
event NewSale(bytes32 saleId, bytes32 merkleRoot, address recipient, address admin, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 maxQueueTime, uint256 startTime, uint256 endTime, string uri, uint256 price, uint8 decimals)
```

### Deploy

```solidity
event Deploy(address paymentToken, uint8 paymentTokenDecimals, address priceOracle)
```

### UpdateStart

```solidity
event UpdateStart(bytes32 saleId, uint256 startTime)
```

### UpdateEnd

```solidity
event UpdateEnd(bytes32 saleId, uint256 endTime)
```

### UpdateMerkleRoot

```solidity
event UpdateMerkleRoot(bytes32 saleId, bytes32 merkleRoot)
```

### UpdateMaxQueueTime

```solidity
event UpdateMaxQueueTime(bytes32 saleId, uint256 maxQueueTime)
```

### Buy

```solidity
event Buy(bytes32 saleId, address buyer, uint256 value, bool native, bytes32[] proof)
```

### RegisterClaimManager

```solidity
event RegisterClaimManager(bytes32 saleId, address claimManager)
```

### UpdateUri

```solidity
event UpdateUri(bytes32 saleId, string uri)
```

### constructor

```solidity
constructor(address _paymentToken, uint8 _paymentTokenDecimals, address _priceOracle) public
```

### validSale

```solidity
modifier validSale(bytes32 saleId)
```

### isAdmin

```solidity
modifier isAdmin(bytes32 saleId)
```

### canAccessSale

```solidity
modifier canAccessSale(bytes32 saleId, bytes32[] proof)
```

### requireOpen

```solidity
modifier requireOpen(bytes32 saleId)
```

### getLatestPrice

```solidity
function getLatestPrice() public view returns (uint256)
```

### getAdmin

```solidity
function getAdmin(bytes32 saleId) public view returns (address)
```

### getRecipient

```solidity
function getRecipient(bytes32 saleId) public view returns (address)
```

### getMerkleRoot

```solidity
function getMerkleRoot(bytes32 saleId) public view returns (bytes32)
```

### getPriceOracle

```solidity
function getPriceOracle() public view returns (address)
```

### getClaimManager

```solidity
function getClaimManager(bytes32 saleId) public view returns (address)
```

### getSaleBuyLimit

```solidity
function getSaleBuyLimit(bytes32 saleId) public view returns (uint256)
```

### getUserBuyLimit

```solidity
function getUserBuyLimit(bytes32 saleId) public view returns (uint256)
```

### getStartTime

```solidity
function getStartTime(bytes32 saleId) public view returns (uint256)
```

### getEndTime

```solidity
function getEndTime(bytes32 saleId) public view returns (uint256)
```

### getUri

```solidity
function getUri(bytes32 saleId) public view returns (string)
```

### getPrice

```solidity
function getPrice(bytes32 saleId) public view returns (uint256)
```

### getDecimals

```solidity
function getDecimals(bytes32 saleId) public view returns (uint256)
```

### getTotalSpent

```solidity
function getTotalSpent(bytes32 saleId) public view returns (uint256)
```

### getRandomValue

```solidity
function getRandomValue(bytes32 saleId) public view returns (uint160)
```

### getMaxQueueTime

```solidity
function getMaxQueueTime(bytes32 saleId) public view returns (uint256)
```

### generateRandomishValue

```solidity
function generateRandomishValue(bytes32 merkleRoot) public view returns (uint160)
```

### getFairQueueTime

```solidity
function getFairQueueTime(bytes32 saleId, address buyer) public view returns (uint256)
```

### spentToBought

```solidity
function spentToBought(bytes32 saleId, uint256 spent) public view returns (uint256)
```

### nativeToPaymentToken

```solidity
function nativeToPaymentToken(uint256 nativeValue) public view returns (uint256)
```

### getSpent

```solidity
function getSpent(bytes32 saleId, address userAddress) public view returns (uint256)
```

### getBought

```solidity
function getBought(bytes32 saleId, address userAddress) public view returns (uint256)
```

### isOpen

```solidity
function isOpen(bytes32 saleId) public view returns (bool)
```

### isOver

```solidity
function isOver(bytes32 saleId) public view returns (bool)
```

### newSale

```solidity
function newSale(address payable recipient, bytes32 merkleRoot, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 startTime, uint256 endTime, uint160 maxQueueTime, string uri, uint256 price, uint8 decimals) public returns (bytes32)
```

sale setup and config
  - the address calling this method is the admin: only the admin can change sale configuration
  - all payments are sent to the the recipient

### setStart

```solidity
function setStart(bytes32 saleId, uint256 startTime) public
```

### setEnd

```solidity
function setEnd(bytes32 saleId, uint256 endTime) public
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 saleId, bytes32 merkleRoot) public
```

### setMaxQueueTime

```solidity
function setMaxQueueTime(bytes32 saleId, uint160 maxQueueTime) public
```

### setUriAndMerkleRoot

```solidity
function setUriAndMerkleRoot(bytes32 saleId, bytes32 merkleRoot, string uri) public
```

### _isAllowed

```solidity
function _isAllowed(bytes32 root, address account, bytes32[] proof) external pure returns (bool)
```

### buy

```solidity
function buy(bytes32 saleId, uint256 tokenQuantity, bytes32[] proof) public
```

### buy

```solidity
function buy(bytes32 saleId, bytes32[] proof) public payable
```

### registerClaimManager

```solidity
function registerClaimManager(bytes32 saleId, address claimManager) public
```

### recoverERC20

```solidity
function recoverERC20(bytes32 saleId, address tokenAddress, uint256 tokenAmount) public
```

## ISaleManager_v_1_3

### getAdmin

```solidity
function getAdmin(bytes32 saleId) external view returns (address)
```

### getRecipient

```solidity
function getRecipient(bytes32 saleId) external view returns (address)
```

### getMerkleRoot

```solidity
function getMerkleRoot(bytes32 saleId) external view returns (bytes32)
```

### getPriceOracle

```solidity
function getPriceOracle() external view returns (address)
```

### getClaimManager

```solidity
function getClaimManager(bytes32 saleId) external view returns (address)
```

### getSaleBuyLimit

```solidity
function getSaleBuyLimit(bytes32 saleId) external view returns (uint256)
```

### getUserBuyLimit

```solidity
function getUserBuyLimit(bytes32 saleId) external view returns (uint256)
```

### getPurchaseMinimum

```solidity
function getPurchaseMinimum(bytes32 saleId) external view returns (uint256)
```

### getStartTime

```solidity
function getStartTime(bytes32 saleId) external view returns (uint256)
```

### getEndTime

```solidity
function getEndTime(bytes32 saleId) external view returns (uint256)
```

### getUri

```solidity
function getUri(bytes32 saleId) external view returns (string)
```

### getPrice

```solidity
function getPrice(bytes32 saleId) external view returns (uint256)
```

### getDecimals

```solidity
function getDecimals(bytes32 saleId) external view returns (uint256)
```

### getTotalSpent

```solidity
function getTotalSpent(bytes32 saleId) external view returns (uint256)
```

### getRandomValue

```solidity
function getRandomValue(bytes32 saleId) external view returns (uint160)
```

### getMaxQueueTime

```solidity
function getMaxQueueTime(bytes32 saleId) external view returns (uint256)
```

### generateRandomishValue

```solidity
function generateRandomishValue(bytes32 merkleRoot) external view returns (uint160)
```

### getFairQueueTime

```solidity
function getFairQueueTime(bytes32 saleId, address buyer) external view returns (uint256)
```

### spentToBought

```solidity
function spentToBought(bytes32 saleId, uint256 spent) external view returns (uint256)
```

### nativeToPaymentToken

```solidity
function nativeToPaymentToken(uint256 nativeValue) external view returns (uint256)
```

### getSpent

```solidity
function getSpent(bytes32 saleId, address userAddress) external view returns (uint256)
```

### getBought

```solidity
function getBought(bytes32 saleId, address userAddress) external view returns (uint256)
```

### isOpen

```solidity
function isOpen(bytes32 saleId) external view returns (bool)
```

### isOver

```solidity
function isOver(bytes32 saleId) external view returns (bool)
```

### newSale

```solidity
function newSale(address payable recipient, bytes32 merkleRoot, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 purchaseMinimum, uint256 startTime, uint256 endTime, uint160 maxQueueTime, string uri, uint256 price, uint8 decimals) external returns (bytes32)
```

### setStart

```solidity
function setStart(bytes32 saleId, uint256 startTime) external
```

### setEnd

```solidity
function setEnd(bytes32 saleId, uint256 endTime) external
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 saleId, bytes32 merkleRoot) external
```

### setMaxQueueTime

```solidity
function setMaxQueueTime(bytes32 saleId, uint160 maxQueueTime) external
```

### setUriAndMerkleRoot

```solidity
function setUriAndMerkleRoot(bytes32 saleId, bytes32 merkleRoot, string uri) external
```

### buy

```solidity
function buy(bytes32 saleId, uint256 tokenQuantity, bytes32[] proof) external
```

### buy

```solidity
function buy(bytes32 saleId, bytes32[] proof) external payable
```

### registerClaimManager

```solidity
function registerClaimManager(bytes32 saleId, address claimManager) external
```

### recoverERC20

```solidity
function recoverERC20(bytes32 saleId, address tokenAddress, uint256 tokenAmount) external
```

## SaleManager_v_1_3

### priceOracle

```solidity
contract IOracleOrL2OracleWithSequencerCheck priceOracle
```

### paymentToken

```solidity
contract IERC20 paymentToken
```

### paymentTokenDecimals

```solidity
uint8 paymentTokenDecimals
```

### Sale

```solidity
struct Sale {
  address payable recipient;
  address admin;
  bytes32 merkleRoot;
  address claimManager;
  uint256 saleBuyLimit;
  uint256 userBuyLimit;
  uint256 purchaseMinimum;
  uint256 startTime;
  uint256 endTime;
  string uri;
  uint256 price;
  uint8 decimals;
  uint256 totalSpent;
  uint256 maxQueueTime;
  uint160 randomValue;
  mapping(address => uint256) spent;
}
```

### saleCount

```solidity
uint256 saleCount
```

### totalSpent

```solidity
uint256 totalSpent
```

### VERSION

```solidity
string VERSION
```

### NewSale

```solidity
event NewSale(bytes32 saleId, bytes32 merkleRoot, address recipient, address admin, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 purchaseMinimum, uint256 maxQueueTime, uint256 startTime, uint256 endTime, string uri, uint256 price, uint8 decimals)
```

### Deploy

```solidity
event Deploy(address paymentToken, uint8 paymentTokenDecimals, address priceOracle)
```

### UpdateStart

```solidity
event UpdateStart(bytes32 saleId, uint256 startTime)
```

### UpdateEnd

```solidity
event UpdateEnd(bytes32 saleId, uint256 endTime)
```

### UpdateMerkleRoot

```solidity
event UpdateMerkleRoot(bytes32 saleId, bytes32 merkleRoot)
```

### UpdateMaxQueueTime

```solidity
event UpdateMaxQueueTime(bytes32 saleId, uint256 maxQueueTime)
```

### Buy

```solidity
event Buy(bytes32 saleId, address buyer, uint256 value, bool native, bytes32[] proof)
```

### RegisterClaimManager

```solidity
event RegisterClaimManager(bytes32 saleId, address claimManager)
```

### UpdateUri

```solidity
event UpdateUri(bytes32 saleId, string uri)
```

### constructor

```solidity
constructor(address _paymentToken, uint8 _paymentTokenDecimals, address _priceOracle) public payable
```

### validSale

```solidity
modifier validSale(bytes32 saleId)
```

### isAdmin

```solidity
modifier isAdmin(bytes32 saleId)
```

### canAccessSale

```solidity
modifier canAccessSale(bytes32 saleId, bytes32[] proof)
```

### requireOpen

```solidity
modifier requireOpen(bytes32 saleId)
```

### getLatestPrice

```solidity
function getLatestPrice() public view returns (uint256)
```

### getAdmin

```solidity
function getAdmin(bytes32 saleId) public view returns (address)
```

### getRecipient

```solidity
function getRecipient(bytes32 saleId) public view returns (address)
```

### getMerkleRoot

```solidity
function getMerkleRoot(bytes32 saleId) public view returns (bytes32)
```

### getPriceOracle

```solidity
function getPriceOracle() public view returns (address)
```

### getClaimManager

```solidity
function getClaimManager(bytes32 saleId) public view returns (address)
```

### getSaleBuyLimit

```solidity
function getSaleBuyLimit(bytes32 saleId) public view returns (uint256)
```

### getUserBuyLimit

```solidity
function getUserBuyLimit(bytes32 saleId) public view returns (uint256)
```

### getPurchaseMinimum

```solidity
function getPurchaseMinimum(bytes32 saleId) public view returns (uint256)
```

### getStartTime

```solidity
function getStartTime(bytes32 saleId) public view returns (uint256)
```

### getEndTime

```solidity
function getEndTime(bytes32 saleId) public view returns (uint256)
```

### getUri

```solidity
function getUri(bytes32 saleId) public view returns (string)
```

### getPrice

```solidity
function getPrice(bytes32 saleId) public view returns (uint256)
```

### getDecimals

```solidity
function getDecimals(bytes32 saleId) public view returns (uint256)
```

### getTotalSpent

```solidity
function getTotalSpent(bytes32 saleId) public view returns (uint256)
```

### getRandomValue

```solidity
function getRandomValue(bytes32 saleId) public view returns (uint160)
```

### getMaxQueueTime

```solidity
function getMaxQueueTime(bytes32 saleId) public view returns (uint256)
```

### generateRandomishValue

```solidity
function generateRandomishValue(bytes32 merkleRoot) public view returns (uint160)
```

### getFairQueueTime

```solidity
function getFairQueueTime(bytes32 saleId, address buyer) public view returns (uint256)
```

### spentToBought

```solidity
function spentToBought(bytes32 saleId, uint256 spent) public view returns (uint256)
```

### nativeToPaymentToken

```solidity
function nativeToPaymentToken(uint256 nativeValue) public view returns (uint256)
```

### getSpent

```solidity
function getSpent(bytes32 saleId, address userAddress) public view returns (uint256)
```

### getBought

```solidity
function getBought(bytes32 saleId, address userAddress) public view returns (uint256)
```

### isOpen

```solidity
function isOpen(bytes32 saleId) public view returns (bool)
```

### isOver

```solidity
function isOver(bytes32 saleId) public view returns (bool)
```

### newSale

```solidity
function newSale(address payable recipient, bytes32 merkleRoot, uint256 saleBuyLimit, uint256 userBuyLimit, uint256 purchaseMinimum, uint256 startTime, uint256 endTime, uint160 maxQueueTime, string uri, uint256 price, uint8 decimals) public returns (bytes32)
```

sale setup and config
  - the address calling this method is the admin: only the admin can change sale configuration
  - all payments are sent to the the recipient

### setStart

```solidity
function setStart(bytes32 saleId, uint256 startTime) public
```

### setEnd

```solidity
function setEnd(bytes32 saleId, uint256 endTime) public
```

### setMerkleRoot

```solidity
function setMerkleRoot(bytes32 saleId, bytes32 merkleRoot) public
```

### setMaxQueueTime

```solidity
function setMaxQueueTime(bytes32 saleId, uint160 maxQueueTime) public
```

### setUriAndMerkleRoot

```solidity
function setUriAndMerkleRoot(bytes32 saleId, bytes32 merkleRoot, string uri) public
```

### _isAllowed

```solidity
function _isAllowed(bytes32 root, address account, bytes32[] proof) external pure returns (bool)
```

### buy

```solidity
function buy(bytes32 saleId, uint256 tokenQuantity, bytes32[] proof) public
```

### buy

```solidity
function buy(bytes32 saleId, bytes32[] proof) public payable
```

### registerClaimManager

```solidity
function registerClaimManager(bytes32 saleId, address claimManager) public
```

### recoverERC20

```solidity
function recoverERC20(bytes32 saleId, address tokenAddress, uint256 tokenAmount) public
```

## Config

Allow qualified users to participate in a sale according to sale rules.

Management
- the address that deploys the sale is the sale owner
- owners may change some sale parameters (e.g. start and end times)
- sale proceeds are sent to the sale recipient

Qualification
- public sale: anyone can participate
- private sale: only users who can prove membership in a merkle tree can participate

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

```solidity
struct Config {
  address payable recipient;
  bytes32 merkleRoot;
  uint256 saleMaximum;
  uint256 userMaximum;
  uint256 purchaseMinimum;
  uint256 startTime;
  uint256 endTime;
  uint256 maxQueueTime;
  string URI;
}
```

## Metrics

```solidity
struct Metrics {
  uint256 purchaseCount;
  uint256 buyerCount;
  uint256 purchaseTotal;
  mapping(address => uint256) buyerTotal;
}
```

## PaymentTokenInfo

```solidity
struct PaymentTokenInfo {
  contract IOracleOrL2OracleWithSequencerCheck oracle;
  uint8 decimals;
}
```

## FlatPriceSale_v_2_1

### ImplementationConstructor

```solidity
event ImplementationConstructor(address payable feeRecipient, uint256 feeBips)
```

### Update

```solidity
event Update(struct Config config)
```

### Initialize

```solidity
event Initialize(struct Config config, string baseCurrency, contract IOracleOrL2OracleWithSequencerCheck nativeOracle, bool nativePaymentsEnabled)
```

### SetPaymentTokenInfo

```solidity
event SetPaymentTokenInfo(contract IERC20Upgradeable token, struct PaymentTokenInfo paymentTokenInfo)
```

### SweepToken

```solidity
event SweepToken(address token, uint256 amount)
```

### SweepNative

```solidity
event SweepNative(uint256 amount)
```

### RegisterDistributor

```solidity
event RegisterDistributor(address distributor)
```

### NATIVE_TOKEN_DECIMALS

```solidity
uint256 NATIVE_TOKEN_DECIMALS
```

### PER_USER_PURCHASE_LIMIT

```solidity
uint8 PER_USER_PURCHASE_LIMIT
```

### PER_USER_END_TIME

```solidity
uint8 PER_USER_END_TIME
```

### feeBips

```solidity
uint256 feeBips
```

Variables set by implementation contract constructor (immutable)

### fractionDenominator

```solidity
uint256 fractionDenominator
```

### feeRecipient

```solidity
address payable feeRecipient
```

### distributor

```solidity
address distributor
```

### baseCurrency

```solidity
string baseCurrency
```

Variables set during initialization of clone contracts ("immutable" on each instance)

### VERSION

```solidity
string VERSION
```

### nativeTokenPriceOracle

```solidity
contract IOracleOrL2OracleWithSequencerCheck nativeTokenPriceOracle
```

### nativePaymentsEnabled

```solidity
bool nativePaymentsEnabled
```

### paymentTokens

```solidity
mapping(contract IERC20Upgradeable => struct PaymentTokenInfo) paymentTokens
```

### config

```solidity
struct Config config
```

### metrics

```solidity
struct Metrics metrics
```

### randomValue

```solidity
uint160 randomValue
```

### constructor

```solidity
constructor(uint256 _feeBips, address payable _feeRecipient) public
```

### initialize

```solidity
function initialize(address _owner, struct Config _config, string _baseCurrency, bool _nativePaymentsEnabled, contract IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle, contract IERC20Upgradeable[] tokens, contract IOracleOrL2OracleWithSequencerCheck[] oracles, uint8[] decimals) public
```

Replacement for constructor for clones of the implementation contract
  Important: anyone can call the initialize function!

### canAccessSale

```solidity
modifier canAccessSale(bytes data, bytes32[] proof)
```

Check that the user can currently participate in the sale based on the merkle root

  Merkle root options:
  - bytes32(0): this is a public sale, any address can participate
  - otherwise: this is a private sale, users must submit a merkle proof that their address is included in the merkle root

### validUpdate

```solidity
modifier validUpdate(struct Config newConfig)
```

Check that the new sale is a valid update
  - If the config already exists, it must not be over (cannot edit sale after it concludes)
  - Sale start, end, and max queue times must be consistent and not too far in the future

### validPaymentToken

```solidity
modifier validPaymentToken(contract IERC20Upgradeable token)
```

### areNativePaymentsEnabled

```solidity
modifier areNativePaymentsEnabled()
```

### getPaymentToken

```solidity
function getPaymentToken(contract IERC20Upgradeable token) external view returns (struct PaymentTokenInfo)
```

### getOraclePrice

```solidity
function getOraclePrice(contract IOracleOrL2OracleWithSequencerCheck oracle) public view returns (uint256)
```

### generatePseudorandomValue

```solidity
function generatePseudorandomValue(bytes32 merkleRoot) public view returns (uint160)
```

Generate a pseudorandom value
    This is not a truly random value:
    - miners can alter the block hash
    - owners can repeatedly call setMerkleRoot()
    - owners can choose when to submit the transaction

### getFairQueueTime

```solidity
function getFairQueueTime(address buyer) public view returns (uint256)
```

Get the delay in seconds that a specific buyer must wait after the sale begins in order to buy tokens in the sale

    Buyers cannot exploit the fair queue when:
    - The sale is private (merkle root != bytes32(0))
    - Each eligible buyer gets exactly one address in the merkle root

    Although miners and sellers can minimize the delay for an arbitrary address, these are not significant threats:
    - the economic opportunity to miners is zero or relatively small (only specific addresses can participate in private sales, and a better queue postion does not imply high returns)
    - sellers can repeatedly set merkle roots to achieve a favorable queue time for any address, but sellers already control the tokens being sold!

### tokensToBaseCurrency

```solidity
function tokensToBaseCurrency(uint256 tokenQuantity, uint256 tokenDecimals, contract IOracleOrL2OracleWithSequencerCheck oracle) public view returns (uint256 value)
```

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

### total

```solidity
function total() external view returns (uint256)
```

### isOver

```solidity
function isOver() public view returns (bool)
```

### isOpen

```solidity
function isOpen() public view returns (bool)
```

### buyerTotal

```solidity
function buyerTotal(address user) external view returns (uint256)
```

### _execute

```solidity
function _execute(uint256 baseCurrencyQuantity, bytes data) internal
```

Records a purchase
  Follow the Checks -> Effects -> Interactions pattern
Checks: CALLER MUST ENSURE BUYER IS PERMITTED TO PARTICIPATE IN THIS SALE: THIS METHOD DOES NOT CHECK WHETHER THE BUYER SHOULD BE ABLE TO ACCESS THE SALE!
Effects: record the payment
Interactions: none!

### _settlePaymentToken

```solidity
function _settlePaymentToken(uint256 baseCurrencyValue, contract IERC20Upgradeable token, uint256 quantity) internal
```

Settle payment made with payment token
  Important: this function has no checks! Only call if the purchase is valid!

### _settleNativeToken

```solidity
function _settleNativeToken(uint256 baseCurrencyValue, uint256 nativeTokenQuantity) internal
```

Settle payment made with native token
  Important: this function has no checks! Only call if the purchase is valid!

### buyWithToken

```solidity
function buyWithToken(contract IERC20Upgradeable token, uint256 quantity, bytes data, bytes32[] proof) external
```

Pay with the payment token (e.g. USDC)

### buyWithNative

```solidity
function buyWithNative(bytes data, bytes32[] proof) external payable
```

Pay with the native token (e.g. ETH)

### update

```solidity
function update(struct Config _config) external
```

External management functions (only the owner may update the sale)

### registerDistributor

```solidity
function registerDistributor(address _distributor) external
```

### sweepToken

```solidity
function sweepToken(contract IERC20Upgradeable token) external
```

Public management functions

### sweepNative

```solidity
function sweepNative() external
```

## FlatPriceSaleFactory_v_2_1

### implementation

```solidity
address implementation
```

### VERSION

```solidity
string VERSION
```

### NewSale

```solidity
event NewSale(address implementation, contract FlatPriceSale_v_2_1 clone, struct Config config, string baseCurrency, contract IOracleOrL2OracleWithSequencerCheck nativeOracle, bool nativePaymentsEnabled)
```

### constructor

```solidity
constructor(address _implementation) public
```

### newSale

```solidity
function newSale(address _owner, struct Config _config, string _baseCurrency, bool _nativePaymentsEnabled, contract IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle, contract IERC20Upgradeable[] tokens, contract IOracleOrL2OracleWithSequencerCheck[] oracles, uint8[] decimals) external returns (contract FlatPriceSale_v_2_1 sale)
```

## Sale

### Buy

```solidity
event Buy(address buyer, address token, uint256 baseCurrencyValue, uint256 tokenValue, uint256 tokenFee)
```

### constructor

```solidity
constructor() internal
```

### isValidMerkleProof

```solidity
function isValidMerkleProof(bytes32 root, address account, bytes data, bytes32[] proof) public pure returns (bool)
```

### buyWithToken

```solidity
function buyWithToken(contract IERC20Upgradeable token, uint256 quantity, bytes data, bytes32[] proof) external virtual
```

### buyWithNative

```solidity
function buyWithNative(bytes data, bytes32[] proof) external payable virtual
```

### isOpen

```solidity
function isOpen() public view virtual returns (bool)
```

### isOver

```solidity
function isOver() public view virtual returns (bool)
```

### buyerTotal

```solidity
function buyerTotal(address user) external view virtual returns (uint256)
```

### total

```solidity
function total() external view virtual returns (uint256)
```

## Config

Allow qualified users to participate in a sale according to sale rules.

Management
- the address that deploys the sale is the sale owner
- owners may change some sale parameters (e.g. start and end times)
- sale proceeds are sent to the sale recipient

Qualification
- public sale: anyone can participate
- private sale: only users who can prove membership in a merkle tree can participate

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

```solidity
struct Config {
  address payable recipient;
  bytes32 merkleRoot;
  uint256 saleMaximum;
  uint256 userMaximum;
  uint256 purchaseMinimum;
  uint256 startTime;
  uint256 endTime;
  uint256 maxQueueTime;
  string URI;
}
```

## Metrics

```solidity
struct Metrics {
  uint256 purchaseCount;
  uint256 buyerCount;
  uint256 purchaseTotal;
  mapping(address => uint256) buyerTotal;
}
```

## PaymentTokenInfo

```solidity
struct PaymentTokenInfo {
  contract IOracleOrL2OracleWithSequencerCheck oracle;
  uint8 decimals;
}
```

## FlatPriceSale

### ImplementationConstructor

```solidity
event ImplementationConstructor(address payable feeRecipient, uint256 feeBips)
```

### Update

```solidity
event Update(struct Config config)
```

### Initialize

```solidity
event Initialize(struct Config config, string baseCurrency, contract IOracleOrL2OracleWithSequencerCheck nativeOracle, bool nativePaymentsEnabled)
```

### SetPaymentTokenInfo

```solidity
event SetPaymentTokenInfo(contract IERC20Upgradeable token, struct PaymentTokenInfo paymentTokenInfo)
```

### SweepToken

```solidity
event SweepToken(address token, uint256 amount)
```

### SweepNative

```solidity
event SweepNative(uint256 amount)
```

### RegisterDistributor

```solidity
event RegisterDistributor(address distributor)
```

### BASE_CURRENCY_DECIMALS

```solidity
uint256 BASE_CURRENCY_DECIMALS
```

### NATIVE_TOKEN_DECIMALS

```solidity
uint256 NATIVE_TOKEN_DECIMALS
```

### PER_USER_PURCHASE_LIMIT

```solidity
uint8 PER_USER_PURCHASE_LIMIT
```

### PER_USER_END_TIME

```solidity
uint8 PER_USER_END_TIME
```

### feeBips

```solidity
uint256 feeBips
```

Variables set by implementation contract constructor (immutable)

### fractionDenominator

```solidity
uint256 fractionDenominator
```

### feeRecipient

```solidity
address payable feeRecipient
```

### distributor

```solidity
address distributor
```

### baseCurrency

```solidity
string baseCurrency
```

Variables set during initialization of clone contracts ("immutable" on each instance)

### VERSION

```solidity
string VERSION
```

### nativeTokenPriceOracle

```solidity
contract IOracleOrL2OracleWithSequencerCheck nativeTokenPriceOracle
```

### nativePaymentsEnabled

```solidity
bool nativePaymentsEnabled
```

### paymentTokens

```solidity
mapping(contract IERC20Upgradeable => struct PaymentTokenInfo) paymentTokens
```

### config

```solidity
struct Config config
```

### metrics

```solidity
struct Metrics metrics
```

### randomValue

```solidity
uint160 randomValue
```

### constructor

```solidity
constructor(uint256 _feeBips, address payable _feeRecipient) public
```

### initialize

```solidity
function initialize(address _owner, struct Config _config, string _baseCurrency, bool _nativePaymentsEnabled, contract IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle, contract IERC20Upgradeable[] tokens, contract IOracleOrL2OracleWithSequencerCheck[] oracles, uint8[] decimals) public
```

Replacement for constructor for clones of the implementation contract
  Important: anyone can call the initialize function!

### canAccessSale

```solidity
modifier canAccessSale(bytes data, bytes32[] proof)
```

Check that the user can currently participate in the sale based on the merkle root

  Merkle root options:
  - bytes32(0): this is a public sale, any address can participate
  - otherwise: this is a private sale, users must submit a merkle proof that their address is included in the merkle root

### validUpdate

```solidity
modifier validUpdate(struct Config newConfig)
```

Check that the new sale is a valid update
  - If the config already exists, it must not be over (cannot edit sale after it concludes)
  - Sale start, end, and max queue times must be consistent and not too far in the future

### validPaymentToken

```solidity
modifier validPaymentToken(contract IERC20Upgradeable token)
```

### areNativePaymentsEnabled

```solidity
modifier areNativePaymentsEnabled()
```

### getPaymentToken

```solidity
function getPaymentToken(contract IERC20Upgradeable token) external view returns (struct PaymentTokenInfo)
```

### getOraclePrice

```solidity
function getOraclePrice(contract IOracleOrL2OracleWithSequencerCheck oracle) public view returns (uint256)
```

### generatePseudorandomValue

```solidity
function generatePseudorandomValue(bytes32 merkleRoot) public view returns (uint160)
```

Generate a pseudorandom value
    This is not a truly random value:
    - miners can alter the block hash
    - owners can repeatedly call setMerkleRoot()
    - owners can choose when to submit the transaction

### getFairQueueTime

```solidity
function getFairQueueTime(address buyer) public view returns (uint256)
```

Get the delay in seconds that a specific buyer must wait after the sale begins in order to buy tokens in the sale

    Buyers cannot exploit the fair queue when:
    - The sale is private (merkle root != bytes32(0))
    - Each eligible buyer gets exactly one address in the merkle root

    Although miners and sellers can minimize the delay for an arbitrary address, these are not significant threats:
    - the economic opportunity to miners is zero or relatively small (only specific addresses can participate in private sales, and a better queue postion does not imply high returns)
    - sellers can repeatedly set merkle roots to achieve a favorable queue time for any address, but sellers already control the tokens being sold!

### tokensToBaseCurrency

```solidity
function tokensToBaseCurrency(uint256 tokenQuantity, uint256 tokenDecimals, contract IOracleOrL2OracleWithSequencerCheck oracle) public view returns (uint256 value)
```

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

### total

```solidity
function total() external view returns (uint256)
```

### isOver

```solidity
function isOver() public view returns (bool)
```

### isOpen

```solidity
function isOpen() public view returns (bool)
```

### buyerTotal

```solidity
function buyerTotal(address user) external view returns (uint256)
```

### _execute

```solidity
function _execute(uint256 baseCurrencyQuantity, bytes data) internal
```

Records a purchase
  Follow the Checks -> Effects -> Interactions pattern
Checks: CALLER MUST ENSURE BUYER IS PERMITTED TO PARTICIPATE IN THIS SALE: THIS METHOD DOES NOT CHECK WHETHER THE BUYER SHOULD BE ABLE TO ACCESS THE SALE!
Effects: record the payment
Interactions: none!

### _settlePaymentToken

```solidity
function _settlePaymentToken(uint256 baseCurrencyValue, contract IERC20Upgradeable token, uint256 quantity) internal
```

Settle payment made with payment token
  Important: this function has no checks! Only call if the purchase is valid!

### _settleNativeToken

```solidity
function _settleNativeToken(uint256 baseCurrencyValue, uint256 nativeTokenQuantity) internal
```

Settle payment made with native token
  Important: this function has no checks! Only call if the purchase is valid!

### buyWithToken

```solidity
function buyWithToken(contract IERC20Upgradeable token, uint256 quantity, bytes data, bytes32[] proof) external
```

Pay with the payment token (e.g. USDC)

### buyWithNative

```solidity
function buyWithNative(bytes data, bytes32[] proof) external payable
```

Pay with the native token (e.g. ETH)

### update

```solidity
function update(struct Config _config) external
```

External management functions (only the owner may update the sale)

### registerDistributor

```solidity
function registerDistributor(address _distributor) external
```

### sweepToken

```solidity
function sweepToken(contract IERC20Upgradeable token) external
```

Public management functions

### sweepNative

```solidity
function sweepNative() external
```

## FlatPriceSaleFactory

### implementation

```solidity
address implementation
```

### VERSION

```solidity
string VERSION
```

### NewSale

```solidity
event NewSale(address implementation, contract FlatPriceSale clone, struct Config config, string baseCurrency, contract IOracleOrL2OracleWithSequencerCheck nativeOracle, bool nativePaymentsEnabled)
```

### constructor

```solidity
constructor(address _implementation) public
```

### newSale

```solidity
function newSale(address _owner, struct Config _config, string _baseCurrency, bool _nativePaymentsEnabled, contract IOracleOrL2OracleWithSequencerCheck _nativeTokenPriceOracle, contract IERC20Upgradeable[] tokens, contract IOracleOrL2OracleWithSequencerCheck[] oracles, uint8[] decimals) external returns (contract FlatPriceSale sale)
```

## Sale

### Buy

```solidity
event Buy(address buyer, address token, uint256 baseCurrencyValue, uint256 tokenValue, uint256 tokenFee)
```

### constructor

```solidity
constructor() internal
```

### isValidMerkleProof

```solidity
function isValidMerkleProof(bytes32 root, address account, bytes data, bytes32[] proof) public pure returns (bool)
```

### buyWithToken

```solidity
function buyWithToken(contract IERC20Upgradeable token, uint256 quantity, bytes data, bytes32[] proof) external virtual
```

### buyWithNative

```solidity
function buyWithNative(bytes data, bytes32[] proof) external payable virtual
```

### isOpen

```solidity
function isOpen() public view virtual returns (bool)
```

### isOver

```solidity
function isOver() public view virtual returns (bool)
```

### buyerTotal

```solidity
function buyerTotal(address user) external view virtual returns (uint256)
```

### total

```solidity
function total() external view virtual returns (uint256)
```

## GenericERC20

### d

```solidity
uint8 d
```

### constructor

```solidity
constructor(string _name, string _symbol, uint8 _decimals, uint256 supply) public
```

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

## FakeUSDC

### d

```solidity
uint8 d
```

### constructor

```solidity
constructor(string _name, string _symbol, uint8 _decimals, uint256 supply) public
```

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

## FakeUSDT

### d

```solidity
uint8 d
```

### constructor

```solidity
constructor(string _name, string _symbol, uint8 _decimals, uint256 supply) public
```

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

## MyERC20Votes

### constructor

```solidity
constructor(string _name, string _symbol, uint256 supply) public
```

### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```

### _mint

```solidity
function _mint(address to, uint256 amount) internal
```

### _burn

```solidity
function _burn(address account, uint256 amount) internal
```

## Trader

### SetConfig

```solidity
event SetConfig(contract IHashflowQuote router, uint256 feeBips)
```

### HashflowTradeSingleHop

```solidity
event HashflowTradeSingleHop(struct IHashflowQuote.RFQTQuote quote)
```

### HashflowTradeXChain

```solidity
event HashflowTradeXChain(struct IHashflowQuote.XChainRFQTQuote quote, enum IHashflowQuote.XChainMessageProtocol protocol)
```

### constructor

```solidity
constructor(contract IHashflowQuote _router, uint256 _feeBips, address payable _feeRecipient) public
```

### getSplit

```solidity
function getSplit(uint256 initialTotal) public view returns (uint256 baseTokenTotal, uint256 baseTokenAmount, uint256 baseTokenFee)
```

### getFee

```solidity
function getFee(uint256 baseTokenAmount) public view returns (uint256 baseTokenFee)
```

### tradeSingleHop

```solidity
function tradeSingleHop(struct IHashflowQuote.RFQTQuote quote) public payable
```

### tradeXChain

```solidity
function tradeXChain(struct IHashflowQuote.XChainRFQTQuote quote, enum IHashflowQuote.XChainMessageProtocol protocol) public payable
```

### setConfig

```solidity
function setConfig(contract IHashflowQuote _router, uint256 _feeBips, address payable _feeRecipient) external
```

### getConfig

```solidity
function getConfig() external view returns (contract IHashflowQuote, uint256, address payable)
```

## BatchSendEth

### constructor

```solidity
constructor() public
```

### send

```solidity
function send(address[] addresses, uint256 amount) public payable
```

## FairQueue

Fairly assigns a delay time to each address from a uniform distribution over [0, maxDelayTime]

_The delay is determined by calculating a distance between the user's address and a pseudorandom value based on a provided salt and a blockhash
using the XOR distance metric. Do not use this contract if the event is public because users could grind addresses until they find one with a low delay._

### SetDelay

```solidity
event SetDelay(uint160 maxDelayTime)
```

### distancePerSecond

```solidity
uint160 distancePerSecond
```

calculate a speed at which the queue is exhausted such that all users complete the queue by maxDelayTime

### maxDelayTime

```solidity
uint160 maxDelayTime
```

### randomValue

```solidity
uint160 randomValue
```

_the random value from which a distance will be calculated for each address. Reset the random value
to shuffle the delays for all addresses._

### constructor

```solidity
constructor(uint160 _maxDelayTime, uint160 salt) public
```

### _setPseudorandomValue

```solidity
function _setPseudorandomValue(uint160 salt) internal
```

_internal function to set the random value. A salt (e.g. from a merkle root) is required to prevent
naive manipulation of the random value by validators_

### _setDelay

```solidity
function _setDelay(uint160 _maxDelayTime) internal
```

_Internal function to configure delay
	@param _maxDelayTime the maximum delay for any address in seconds. Set this value to 0 to disable delays entirely._

### getFairDelayTime

```solidity
function getFairDelayTime(address user) public view returns (uint256)
```

get a fixed delay for any address by drawing from a unform distribution over the interval [0, maxDelay]
		@param user The address for which a delay should be calculated. The delay is deterministic for any given address and pseudorandom value.
		@dev The delay is determined by calculating a distance between the user's address and a pseudorandom value using the XOR distance metric (c.f. Kademlia)

		Users cannot exploit the fair delay if:
		- The event is private, i.e. an access list of some form is required
		- Each eligible user gets exactly one address in the access list
		- There is no collusion between event participants, block validators, and event owners

		The threat of collusion is likely minimal:
		- the economic opportunity to validators is zero or relatively small (only specific addresses can participate in private events, and a lower delay time does not imply higher returns)
		- event owners are usually trying to achieve a fair distribution of access to their event

## L2OracleWithSequencerCheck

Data feed oracle for use on optimistic L2s (Arbiturm, Optimism, Base, 
Metis) that uses a data feed that tracks the last known status of the 
L2 sequencer at a given point in time, and reverts if the sequencer is 
down, or is up but a specified grace period has not passed.

_For a list of available Sequencer Uptime Feed proxy addresses, see: 
https://docs.chain.link/docs/data-feeds/l2-sequencer-feeds_

### dataFeed

```solidity
contract AggregatorV3Interface dataFeed
```

### sequencerUptimeFeed

```solidity
contract AggregatorV3Interface sequencerUptimeFeed
```

### SequencerDown

```solidity
error SequencerDown()
```

### GracePeriodNotOver

```solidity
error GracePeriodNotOver()
```

### constructor

```solidity
constructor(address _dataFeed, address _sequencerUptimeFeed) public
```

### latestRoundData

```solidity
function latestRoundData() public view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

### decimals

```solidity
function decimals() public view returns (uint8)
```

## Registry

### DeployRegistry

```solidity
event DeployRegistry()
```

### Register

```solidity
event Register(address addressRegistered, bytes4[] interfaceIds, address registeredBy)
```

### Unregister

```solidity
event Unregister(address addressUnregistered, bytes4[] interfaceIds, address unregisteredBy)
```

### ADMIN_ROLE

```solidity
bytes32 ADMIN_ROLE
```

### constructor

```solidity
constructor() public
```

### addAdmin

```solidity
function addAdmin(address admin) public
```

### removeAdmin

```solidity
function removeAdmin(address admin) public
```

### register

```solidity
function register(address addressRegistered, bytes4[] interfaceIds) public
```

### unregister

```solidity
function unregister(address addressUnregistered, bytes4[] interfaceIds) public
```

### targetSupportsInterface

```solidity
function targetSupportsInterface(address target, bytes4 interfaceId) public view returns (bool)
```

## Sweepable

### SetSweepRecipient

```solidity
event SetSweepRecipient(address recipient)
```

### SweepToken

```solidity
event SweepToken(address token, uint256 amount)
```

### SweepNative

```solidity
event SweepNative(uint256 amount)
```

### constructor

```solidity
constructor(address payable _recipient) internal
```

### sweepToken

```solidity
function sweepToken(contract IERC20 token) external
```

### sweepToken

```solidity
function sweepToken(contract IERC20 token, uint256 amount) external
```

### sweepNative

```solidity
function sweepNative() external
```

### sweepNative

```solidity
function sweepNative(uint256 amount) external
```

### getSweepRecipient

```solidity
function getSweepRecipient() public view returns (address payable)
```

### _setSweepRecipient

```solidity
function _setSweepRecipient(address payable _recipient) internal
```

