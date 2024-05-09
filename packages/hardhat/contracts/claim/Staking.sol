// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract StakingContract {
    IERC20 public softToken;
    IERC721 public nftContract;
    address public feeSwitchContract;

    struct StakedToken {
        uint256 amount;
        uint256 stakingTime;
    }

    mapping(address => StakedToken) public stakedTokens;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event NFTMinted(address indexed user, uint256 tokenId);

    constructor(address _softToken, address _nftContract, address _feeSwitchContract) {
        softToken = IERC20(_softToken);
        nftContract = IERC721(_nftContract);
        feeSwitchContract = _feeSwitchContract;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        softToken.transferFrom(msg.sender, address(this), amount);
        stakedTokens[msg.sender] = StakedToken(stakedTokens[msg.sender].amount + amount, block.timestamp);
        emit Staked(msg.sender, amount);
        adjustFees();
    }

    function unstake(uint256 amount) external {
        require(stakedTokens[msg.sender].amount >= amount, "Insufficient staked tokens");
        stakedTokens[msg.sender].amount -= amount;
        softToken.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
        adjustFees();
    }

    function claimRewards() external {
        // Calculate and distribute rewards (e.g., based on staking duration and amount)
        uint256 rewards = calculateRewards(msg.sender);
        softToken.transfer(msg.sender, rewards);
        emit RewardsClaimed(msg.sender, rewards);
    }

    function mintNFT() external {
        require(stakedTokens[msg.sender].amount > 0, "No staked tokens");
        // TODO: Implement NFT minting logic
        uint256 tokenId = nftContract.mint(msg.sender);
        emit NFTMinted(msg.sender, tokenId);
    }

    function adjustFees() internal {
        // Communicate with the Fee Switch contract to adjust fees based on the total staked amount
        uint256 totalStaked = getTotalStaked();
        // Call the Fee Switch contract's function to update fees
        feeSwitchContract.updateFees(totalStaked);
    }

    function getTotalStaked() public view returns (uint256) {
        uint256 totalStaked = 0;
        for (uint256 i = 0; i < stakedTokens.length; i++) {
            totalStaked += stakedTokens[i].amount;
        }
        return totalStaked;
    }

    function calculateRewards(address user) internal view returns (uint256) {
        uint256 stakingDuration = block.timestamp - stakedTokens[user].stakingTime;
        uint256 monthsStaked = stakingDuration / (30 days);

        if (stakedTokens[user].amount < 1000) {
            return 0;
        }

        if (monthsStaked >= 12) {
            return 12;
        } else {
            return monthsStaked;
        }
    }
}