// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface ISoftMfers {
    function redeem(address receiver, uint256 amount) external;
}

contract StakingContract is Ownable2StepUpgradeable, PausableUpgradeable {
    IERC20 public softToken;
    ISoftMfers public softMfersContract;
    bool private initialized;

    struct StakedToken {
        uint256 amount;
        uint256 penaltyPeriodStartTime;
        uint256 nftsMinted;
        uint256 pendingFeeLevel;
        uint256 earnedFeeLevel;
    }

    mapping(address => StakedToken) public stakedTokens;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event NFTMinted(address indexed user, uint256 numNFTs);
    event FeesAdjusted(address indexed user, uint256 newFeeLevel);
    event SoftTokenAddressUpdated(address indexed newAddress);

    function initialize(address _softToken, address _softMfersAddress) public initializer {
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;
        softToken = IERC20(_softToken);
        softMfersContract = ISoftMfers(_softMfersAddress);
        __Ownable2Step_init();
    }

    function updateSoftTokenAddress(address _newSoftTokenAddress) external onlyOwner {
        require(_newSoftTokenAddress != address(0), "Invalid token address");
        softToken = IERC20(_newSoftTokenAddress);
        emit SoftTokenAddressUpdated(_newSoftTokenAddress);
    }

    function getStakedAmount(address user) public view returns (uint256) {
        return stakedTokens[user].amount;
    }

    function getTotalFutureRedeemableNFTCount(address user) public view returns (uint256) {
        uint256 amount = stakedTokens[user].amount;

        if (amount >= 10000e18) {
            return 12;
        } else if (amount >= 5000e18) {
            return 9;
        } else if (amount >= 2500e18) {
            return 6;
        } else if (amount >= 1000e18) {
            return 3;
        }

        return 0;
    }

    function redeemNFTs() external {
        uint256 timeElapsedSincePeriodStart = block.timestamp - stakedTokens[msg.sender].penaltyPeriodStartTime;
        uint256 monthsElapsedSincePeriodStart = timeElapsedSincePeriodStart / (30 days);
        uint256 totalFutureRedeemableNFTCount = getTotalFutureRedeemableNFTCount(msg.sender);
        uint256 nftsMinted = stakedTokens[msg.sender].nftsMinted;
        uint256 redeemableNFTCount = Math.min(monthsElapsedSincePeriodStart, totalFutureRedeemableNFTCount) - nftsMinted;

        require(redeemableNFTCount > 0, "No new NFTs to redeem");

        stakedTokens[msg.sender].nftsMinted += redeemableNFTCount;
        softMfersContract.redeem(msg.sender, redeemableNFTCount);
        emit NFTMinted(msg.sender, redeemableNFTCount);
    }

    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");

        if (hasPenaltyPeriodElapsed(msg.sender)) {
            stakedTokens[msg.sender].earnedFeeLevel = stakedTokens[msg.sender].pendingFeeLevel;
        }

        uint256 userBalance = softToken.balanceOf(msg.sender);
        require(userBalance >= amount, "Insufficient token balance");

        uint256 userAllowance = softToken.allowance(msg.sender, address(this));
        require(userAllowance >= amount, "Insufficient token allowance");

        bool transferSuccess = softToken.transferFrom(msg.sender, address(this), amount);
        require(transferSuccess, "Token transfer failed");

        stakedTokens[msg.sender].amount += amount;
        stakedTokens[msg.sender].penaltyPeriodStartTime = block.timestamp;
        stakedTokens[msg.sender].pendingFeeLevel = getPendingFeeLevel(msg.sender);

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external whenNotPaused {
        require(stakedTokens[msg.sender].amount >= amount, "Insufficient staked tokens");
        uint256 penalty = hasPenaltyPeriodElapsed(msg.sender) ? 0 : getPenaltyAmount(msg.sender);

        uint256 withdrawAmount = amount - penalty;
        stakedTokens[msg.sender].amount -= amount;
        stakedTokens[msg.sender].penaltyPeriodStartTime = block.timestamp;

        stakedTokens[msg.sender].earnedFeeLevel = 100;
        stakedTokens[msg.sender].pendingFeeLevel = getPendingFeeLevel(msg.sender);

        softToken.transfer(msg.sender, withdrawAmount);
        emit Unstaked(msg.sender, amount);
    }

    function hasPenaltyPeriodElapsed(address user) public view returns (bool) {
        uint256 timeElapsedSincePeriodStart = block.timestamp - stakedTokens[user].penaltyPeriodStartTime;
        uint256 penaltyPeriodDuration = getPenaltyPeriodDuration(user);

        return timeElapsedSincePeriodStart >= penaltyPeriodDuration;
    }

    function getPendingFeeLevel(address user) public view returns (uint256) {
        uint256 amount = stakedTokens[user].amount;

        if (amount >= 75000e18) {
            return 10;
        } else if (amount >= 50000e18) {
            return 25;
        } else if (amount >= 25000e18) {
            return 50;
        } else if (amount >= 10000e18) {
            return 65;
        } else if (amount >= 5000e18) {
            return 75;
        } else if (amount >= 2500e18) {
            return 85;
        }

        return 100;
    }

    function getFeeLevel(address user) public view returns (uint256) {
        if (hasPenaltyPeriodElapsed(user)) {
            return stakedTokens[user].pendingFeeLevel;
        }

        if (stakedTokens[user].earnedFeeLevel == 0) {
            return 100;
        }

        return stakedTokens[user].earnedFeeLevel;
    }

    function getRedeemableNFTCount(address user) public view returns (uint256) {
        uint256 timeElapsedSincePeriodStart = block.timestamp - stakedTokens[user].penaltyPeriodStartTime;
        uint256 monthsElapsedSincePeriodStart = timeElapsedSincePeriodStart / (30 days);
        uint256 totalFutureRedeemableNFTCount = getTotalFutureRedeemableNFTCount(user);
        uint256 nftsMinted = stakedTokens[user].nftsMinted;
        uint256 redeemableNFTCount = Math.min(monthsElapsedSincePeriodStart, totalFutureRedeemableNFTCount) - nftsMinted;
        return redeemableNFTCount;
    }

    function getTimeUntilNextRedeem(address user) public view returns (uint256) {
        uint256 lastRedeemTime = stakedTokens[user].penaltyPeriodStartTime;
        uint256 nextRedeemTime = lastRedeemTime + (30 days);

        if (block.timestamp >= nextRedeemTime) {
            return 0;
        } else {
            return nextRedeemTime - block.timestamp;
        }
    }

    function getPenaltyPeriodDuration(address user) public view returns (uint256) {
        uint256 amount = stakedTokens[user].amount;

        if (amount >= 75000e18) {
            return 90 days;
        } else if (amount >= 50000e18) {
            return 60 days;
        } else if (amount >= 25000e18) {
            return 45 days;
        } else if (amount >= 5000e18) {
            return 30 days;
        } else {
            return 15 days;
        }
    }

    function getPenaltyAmount(address user) public view returns (uint256) {
        uint256 amount = stakedTokens[user].amount;

        if (amount >= 50000e18) {
            return (amount * 200) / 10000; // 2%
        } else if (amount >= 10000e18) {
            return (amount * 500) / 10000; // 5%
        }

        return (amount * 1000) / 10000; // 10%
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
