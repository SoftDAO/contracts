const { expectRevert, time } = require('@openzeppelin/test-helpers');
const NFTContract = artifacts.require("NFTContract");
const FeeSwitchContract = artifacts.require("FeeSwitchContract");
const StakingContract = artifacts.require("StakingContract");

contract('NFTContract', (accounts) => {
  const [owner, user1] = accounts;

  it('should allow owner to mint an NFT', async () => {
    const nft = await NFTContract.deployed();
    const result = await nft.mint(user1, { from: owner });
    assert(result.logs[0].event === 'Transfer', "NFT minted and transferred.");
  });

  it('should prevent non-owners from minting NFTs', async () => {
    const nft = await NFTContract.deployed();
    await expectRevert(nft.mint(user1, { from: user1 }), "Ownable: caller is not the owner");
  });
});

contract('FeeSwitchContract', (accounts) => {
  const [owner, user1] = accounts;

  it('should allow owner to update fees', async () => {
    const feeSwitch = await FeeSwitchContract.deployed();
    const newFeeLevel = 10;
    await feeSwitch.updateFees(user1, newFeeLevel, { from: owner });
    const fee = await feeSwitch.getFeeLevel(user1);
    assert.equal(fee.toNumber(), newFeeLevel, "Fee level updated correctly.");
  });

  it('should prevent non-owners from updating fees', async () => {
    const feeSwitch = await FeeSwitchContract.deployed();
    await expectRevert(feeSwitch.updateFees(user1, 50, { from: user1 }), "Ownable: caller is not the owner");
  });
});

contract('StakingContract', (accounts) => {
  const [owner, user1] = accounts;
  const amount = web3.utils.toWei('100', 'ether');

  before(async () => {
    this.token = await IERC20.new({ from: owner });
    this.nft = await NFTContract.new({ from: owner });
    this.feeSwitch = await FeeSwitchContract.new({ from: owner });
    this.staking = await StakingContract.new(this.token.address, { from: owner });
    await this.token.approve(this.staking.address, amount, { from: user1 });
  });

  it('should allow users to stake tokens', async () => {
    await this.staking.stake(amount, { from: user1 });
    const stakedData = await this.staking.stakedTokens(user1);
    assert.equal(stakedData.amount.toString(), amount, "Tokens staked correctly.");
  });

  it('should allow users to unstake tokens with correct penalties', async () => {
    // advance time chekcing
  });
});
