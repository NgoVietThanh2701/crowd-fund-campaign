const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

module.exports = async function (deployer, network, accounts) {
  // await deployer.deploy(Campaign, 1, accounts[0], { from: accounts[0] }, "", "", "", "");
  await deployer.deploy(Campaign, web3.utils.toWei("1", "ether"), accounts[0], "", "", "", "", "", { from: accounts[0] });
  await deployer.deploy(CampaignFactory, { from: accounts[0] });
};
