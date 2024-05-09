const { BN, expectRevert, ether, time } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const { ERC20Mock } = require('@openzeppelin/contracts/mocks');

const StakingContract = artifacts.require('StakingContract');

contract('StakingContract', ([deployer, user1, user2]) => {
  let stakingContract, softToken, nftContract, feeSwitchContract;
  const stakingAmount = ether('100');
  const unstakeAmount = ether('50');

  beforeEach(async () => {
    softToken = await ERC20Mock.new('Soft Token', 'SOFT', deployer, ether('1000000'));
    nftContract = await ERC721Mock.new('NFT Token', 'NFT');
    feeSwitchContract = await FeeSwitchContract.new(); // You'll need to create a FeeSwitchContract for testing
    stakingContract = await StakingContract.new(
      softToken.address,
      nftContract.address,
      feeSwitchContract.address
    );
    await softToken.transfer(user1, ether('1000'));
    await softToken.transfer(user2, ether('1000'));
  });

  it('should allow staking', async () => {
    await softToken.approve(stakingContract.address, stakingAmount, { from: user1 });
    await stakingContract.stake(stakingAmount, { from: user1 });
    const userStake = await stakingContract.stakedTokens(user1);
    expect(userStake.amount).to.be.bignumber.equal(stakingAmount);
  });

  it('should not allow staking with insufficient balance', async () => {
    await expectRevert(
      stakingContract.stake(ether('1001'), { from: user1 }),
      'ERC20: transfer amount exceeds balance'
    );
  });

  it('should allow unstaking', async () => {
    await softToken.approve(stakingContract.address, stakingAmount, { from: user1 });
    await stakingContract.stake(stakingAmount, { from: user1 });
    await stakingContract.unstake(unstakeAmount, { from: user1 });
    const userStake = await stakingContract.stakedTokens(user1);
    expect(userStake.amount).to.be.bignumber.equal(stakingAmount.sub(unstakeAmount));
  });

  it('should not allow unstaking more than staked', async () => {
    await softToken.approve(stakingContract.address, stakingAmount, { from: user1 });
    await stakingContract.stake(stakingAmount, { from: user1 });
    await expectRevert(
      stakingContract.unstake(stakingAmount.add(ether('1')), { from: user1 }),
      'Insufficient staked tokens'
    );
  });

  it('should claim rewards based on staking duration and amount', async () => {
    await softToken.approve(stakingContract.address, stakingAmount, { from: user1 });
    await stakingContract.stake(stakingAmount, { from: user1 });

    // Fast-forward time by 12 months
    await time.increase(time.duration.years(1));

    const initialBalance = await softToken.balanceOf(user1);
    await stakingContract.claimRewards({ from: user1 });
    const finalBalance = await softToken.balanceOf(user1);

    expect(finalBalance.sub(initialBalance)).to.be.bignumber.equal(new BN('12'));
  });

  it('should not claim rewards for small staking amounts', async () => {
    await softToken.approve(stakingContract.address, ether('500'), { from: user1 });
    await stakingContract.stake(ether('500'), { from: user1 });

    // Fast-forward time by 12 months
    await time.increase(time.duration.years(1));

    const initialBalance = await softToken.balanceOf(user1);
    await stakingContract.claimRewards({ from: user1 });
    const finalBalance = await softToken.balanceOf(user1);

    expect(finalBalance.sub(initialBalance)).to.be.bignumber.equal(new BN('0'));
  });

  it('should mint NFT when staked tokens are present', async () => {
    await softToken.approve(stakingContract.address, stakingAmount, { from: user1 });
    await stakingContract.stake(stakingAmount, { from: user1 });

    const initialBalance = await nftContract.balanceOf(user1);
    await stakingContract.mintNFT({ from: user1 });
    const finalBalance = await nftContract.balanceOf(user1);

    expect(finalBalance.sub(initialBalance)).to.be.bignumber.equal(new BN('1'));
  });

  it('should not mint NFT when no tokens are staked', async () => {
    await expectRevert(
      stakingContract.mintNFT({ from: user1 }),
      'No staked tokens'
    );
  });
});