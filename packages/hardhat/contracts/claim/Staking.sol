// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface ISoftMfers {
    function redeem(address receiver, uint256 amount) external;
}

contract StakingContract is Ownable, Pausable {
    IERC20 public softToken;
    ISoftMfers public softMfersContract;

    struct StakedToken {
        uint256 amount;
        uint256 startTime;
        uint256 totalStakingDuration;
        uint256 stakingTime;
        uint256 nftsMinted;
        uint256 feeLevel;
    }

    mapping(address => StakedToken) public stakedTokens;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event NFTMinted(address indexed user, uint256 numNFTs);
    event FeesAdjusted(address indexed user, uint256 newFeeLevel);

    constructor(address _softToken, address _softMfersAddress) {
        softToken = IERC20(_softToken);
        softMfersContract = ISoftMfers(_softMfersAddress);
    }

    function getStakedAmount(address user) public view returns (uint256) {
        return stakedTokens[user].amount;
    }

    function redeemNFTs() external {
        uint256 totalSecondsStaked = stakedTokens[msg.sender]
            .totalStakingDuration;

        if (stakedTokens[msg.sender].amount > 0) {
            totalSecondsStaked +=
                block.timestamp -
                stakedTokens[msg.sender].stakingTime;
        }

        uint256 totalMonthsStaked = totalSecondsStaked / (30 days);
        uint256 stakedAmount = stakedTokens[msg.sender].amount;
        uint256 nftsToRedeem;

        if (stakedAmount >= 1000e18 && stakedAmount < 2500e18) {
            nftsToRedeem = totalMonthsStaked <= 3
                ? totalMonthsStaked - stakedTokens[msg.sender].nftsMinted
                : 3 - stakedTokens[msg.sender].nftsMinted;
        } else if (stakedAmount >= 2500e18 && stakedAmount < 5000e18) {
            nftsToRedeem = totalMonthsStaked <= 6
                ? totalMonthsStaked - stakedTokens[msg.sender].nftsMinted
                : 6 - stakedTokens[msg.sender].nftsMinted;
        } else if (stakedAmount >= 5000e18 && stakedAmount < 10000e18) {
            nftsToRedeem = totalMonthsStaked <= 9
                ? totalMonthsStaked - stakedTokens[msg.sender].nftsMinted
                : 9 - stakedTokens[msg.sender].nftsMinted;
        } else if (stakedAmount >= 10000e18) {
            nftsToRedeem = totalMonthsStaked <= 12
                ? totalMonthsStaked - stakedTokens[msg.sender].nftsMinted
                : 12 - stakedTokens[msg.sender].nftsMinted;
        }

        require(nftsToRedeem > 0, "No new NFTs to redeem");

        stakedTokens[msg.sender].nftsMinted += nftsToRedeem;
        softMfersContract.redeem(msg.sender, nftsToRedeem);
    }

    function stake(
        uint256 amount,
        address tokenAddress
    ) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenAddress != address(0), "Invalid token address");

        IERC20 token = IERC20(tokenAddress);
        uint256 userBalance = token.balanceOf(msg.sender);

        // uint256 userBalance = softToken.balanceOf(msg.sender);
        require(userBalance >= amount, "Insufficient token balance");

        uint256 userAllowance = token.allowance(msg.sender, address(this));
        require(userAllowance >= amount, "Insufficient token allowance");

        bool transferSuccess = token.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(transferSuccess, "Token transfer failed");

        if (stakedTokens[msg.sender].amount == 0) {
            stakedTokens[msg.sender].startTime = block.timestamp;
        } else {
            stakedTokens[msg.sender].totalStakingDuration +=
                block.timestamp -
                stakedTokens[msg.sender].stakingTime;
        }

        stakedTokens[msg.sender].amount += amount;
        stakedTokens[msg.sender].stakingTime = block.timestamp;

        emit Staked(msg.sender, amount);
        notifyNFTContract(msg.sender);
        adjustFees(msg.sender);
    }

    function unstake(
        uint256 amount,
        address tokenAddress
    ) external whenNotPaused {
        require(tokenAddress != address(0), "Invalid token address");

        IERC20 token = IERC20(tokenAddress);

        require(
            stakedTokens[msg.sender].amount >= amount,
            "Insufficient staked tokens"
        );
        uint256 stakingDuration = block.timestamp -
            stakedTokens[msg.sender].startTime;
        uint256 monthsStaked = (stakedTokens[msg.sender].totalStakingDuration +
            stakingDuration) / (30 days);

        uint256 penalty;
        if (monthsStaked < 1) {
            penalty = (amount * 1000) / 10000; // 10% penalty for early withdrawal
        } else if (
            monthsStaked < 2 && stakedTokens[msg.sender].amount >= 10000e18
        ) {
            penalty = (amount * 500) / 10000; // 5% penalty for early withdrawal
        } else if (
            monthsStaked < 3 && stakedTokens[msg.sender].amount >= 50000e18
        ) {
            penalty = (amount * 200) / 10000; // 2% penalty for early withdrawal
        }

        uint256 withdrawAmount = amount - penalty;
        stakedTokens[msg.sender].amount -= amount;
        stakedTokens[msg.sender].totalStakingDuration += stakingDuration;
        stakedTokens[msg.sender].startTime = block.timestamp;
        token.transfer(msg.sender, withdrawAmount);
        token.transfer(address(this), penalty);
        emit Unstaked(msg.sender, amount);
        adjustFees(msg.sender);
    }

    function notifyNFTContract(address user) internal {
        uint256 totalSecondsStaked = stakedTokens[user].totalStakingDuration;
        if (stakedTokens[user].amount > 0) {
            totalSecondsStaked +=
                block.timestamp -
                stakedTokens[user].stakingTime;
        }

        uint256 totalMonthsStaked = totalSecondsStaked / (30 days);
        uint256 stakedAmount = stakedTokens[user].amount;
        uint256 numNFTsToMint;

        if (stakedAmount >= 1000e18 && stakedAmount < 2500e18) {
            numNFTsToMint = totalMonthsStaked <= 3
                ? totalMonthsStaked - stakedTokens[user].nftsMinted
                : 3 - stakedTokens[user].nftsMinted;
        } else if (stakedAmount >= 2500e18 && stakedAmount < 5000e18) {
            numNFTsToMint = totalMonthsStaked <= 6
                ? totalMonthsStaked - stakedTokens[user].nftsMinted
                : 6 - stakedTokens[user].nftsMinted;
        } else if (stakedAmount >= 5000e18 && stakedAmount < 10000e18) {
            numNFTsToMint = totalMonthsStaked <= 9
                ? totalMonthsStaked - stakedTokens[user].nftsMinted
                : 9 - stakedTokens[user].nftsMinted;
        } else if (stakedAmount >= 10000e18) {
            numNFTsToMint = totalMonthsStaked <= 12
                ? totalMonthsStaked - stakedTokens[user].nftsMinted
                : 12 - stakedTokens[user].nftsMinted;
        }

        if (numNFTsToMint > 0) {
            softMfersContract.redeem(user, numNFTsToMint);
            stakedTokens[user].nftsMinted += numNFTsToMint;
            emit NFTMinted(user, numNFTsToMint);
        }
    }

    function adjustFees(address user) internal {
        uint256 newFeeLevel;
        uint256 stakedAmount = stakedTokens[user].amount;
        uint256 stakingDuration = stakedTokens[user].totalStakingDuration +
            (block.timestamp - stakedTokens[user].startTime);

        if (stakedAmount >= 100000e18 && stakingDuration >= 120 days) {
            newFeeLevel = 0;
        } else if (stakedAmount >= 75000e18 && stakingDuration >= 90 days) {
            newFeeLevel = 10;
        } else if (stakedAmount >= 50000e18 && stakingDuration >= 60 days) {
            newFeeLevel = 25;
        } else if (stakedAmount >= 25000e18 && stakingDuration >= 45 days) {
            newFeeLevel = 50;
        } else if (stakedAmount >= 10000e18 && stakingDuration >= 30 days) {
            newFeeLevel = 65;
        } else if (stakedAmount >= 5000e18 && stakingDuration >= 30 days) {
            newFeeLevel = 75;
        } else if (stakedAmount >= 2500e18 && stakingDuration >= 15 days) {
            newFeeLevel = 85;
        } else {
            newFeeLevel = 100;
        }

        stakedTokens[user].feeLevel = newFeeLevel;
        emit FeesAdjusted(user, newFeeLevel);
    }

    function getFeeLevel(address user) public view returns (uint256) {
        return stakedTokens[user].feeLevel;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
