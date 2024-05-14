// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("StakingNFT", "SNFT") {}

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }
}

contract FeeSwitchContract is Ownable {
    mapping(address => uint256) public userFees;

    event FeesUpdated(address indexed user, uint256 newFeeLevel);

    function updateFees(address user, uint256 newFeeLevel) external onlyOwner {
        require(newFeeLevel <= 100, "Invalid fee level");
        userFees[user] = newFeeLevel;
        emit FeesUpdated(user, newFeeLevel);
    }

    function getFeeLevel(address user) public view returns (uint256) {
        return userFees[user];
    }
}


contract StakingContract {
    IERC20 public softToken;
    NFTContract public nftContract;
    FeeSwitchContract public feeSwitchContract;



    struct StakedToken {
    uint256 amount;
    uint256 stakingTime;
    }

    mapping(address => StakedToken) public stakedTokens;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event NFTMinted(address indexed user);
    event FeesAdjusted(address indexed user, uint256 newFeeLevel);

    constructor() {
    // constructor(address _softToken) {
        // softToken = IERC20(_softToken);
        nftContract = new NFTContract();
        feeSwitchContract = new FeeSwitchContract();
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        softToken.transferFrom(msg.sender, address(this), amount);
        stakedTokens[msg.sender].amount += amount;
        stakedTokens[msg.sender].stakingTime = block.timestamp;
        emit Staked(msg.sender, amount);
        notifyNFTContract(msg.sender);
        adjustFees(msg.sender);
    }

    function unstake(uint256 amount) external {
        require(stakedTokens[msg.sender].amount >= amount, "Insufficient staked tokens");
        uint256 stakingDuration = block.timestamp - stakedTokens[msg.sender].stakingTime;
        uint256 monthsStaked = stakingDuration / 30 days;
        
        uint256 penalty;
        if (monthsStaked < 1 && stakedTokens[msg.sender].amount >= 2500) {
            penalty = amount * 1000 / 10000; // 10% penalty for early withdrawal
        } else if (monthsStaked < 2 && stakedTokens[msg.sender].amount >= 10000) {
            penalty = amount * 500 / 10000; // 5% penalty for early withdrawal
        } else if (monthsStaked < 3 && stakedTokens[msg.sender].amount >= 50000) {
            penalty = amount * 200 / 10000; // 2% penalty for early withdrawal
        }
        
        uint256 withdrawAmount = amount - penalty;
        stakedTokens[msg.sender].amount -= amount;
        softToken.transfer(msg.sender, withdrawAmount);
        softToken.transfer(address(this), penalty);
        emit Unstaked(msg.sender, amount);
        adjustFees(msg.sender);
    }

    function notifyNFTContract(address user) internal {
        uint256 monthsStaked = (block.timestamp - stakedTokens[user].stakingTime) / 30 days;
        if (stakedTokens[user].amount >= 1000 && monthsStaked >= 1) {
            uint256 numNFTs = monthsStaked <= 12 ? monthsStaked : 12;
            for (uint256 i = 0; i < numNFTs; i++) {
                nftContract.mint(user);
            }
            emit NFTMinted(user);
        }
    }

    function adjustFees(address user) internal {
        uint256 newFeeLevel;
        uint256 stakedAmount = stakedTokens[user].amount;
        uint256 stakingDuration = block.timestamp - stakedTokens[user].stakingTime;

        if (stakedAmount >= 100000 && stakingDuration >= 120 days) {
            newFeeLevel = 0;
        } else if (stakedAmount >= 75000 && stakingDuration >= 90 days) {
            newFeeLevel = 10;
        } else if (stakedAmount >= 50000 && stakingDuration >= 60 days) {
            newFeeLevel = 25;
        } else if (stakedAmount >= 25000 && stakingDuration >= 45 days) {
            newFeeLevel = 50;
        } else if (stakedAmount >= 10000 && stakingDuration >= 30 days) {
            newFeeLevel = 65;
        } else if (stakedAmount >= 5000 && stakingDuration >= 30 days) {
            newFeeLevel = 75;
        } else if (stakedAmount >= 2500 && stakingDuration >= 15 days) {
            newFeeLevel = 85;
        } else {
            newFeeLevel = 100;
        }

        // Call the Fee Switch contract's function to update fees
        (bool success, ) = address(feeSwitchContract).call(abi.encodeWithSignature("updateFees(address,uint256)", user, newFeeLevel));
        require(success, "Failed to update fees in Fee Switch contract");

        emit FeesAdjusted(user, newFeeLevel);
    }
}