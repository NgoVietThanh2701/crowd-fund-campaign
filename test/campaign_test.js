const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

let campaign;

contract("CampaignFactory", async () => {
  it("Campaign factory should be deployed", async () => {
    const campaignFactory = await CampaignFactory.new(10);
    const campaignFactoryAddress = await campaignFactory.address;
    assert(campaignFactoryAddress);
  });
});

contract("Campaign", async (accounts) => {
  let owner;

  beforeEach(async () => {
    owner = accounts[0];
    campaign = await Campaign.new(1, owner, "", "", "", "", "");
  });

  it("validating campaign manager is owner", async () => {
    const manager = await campaign.manager.call();
    assert.equal(manager, owner);
  });

  // it("allows people to contribute and marks them as approver", async () => {
  //   await campaign.contribute({ from: accounts[1], value: 2 }, 100000000000000 );

  //   const approver = await campaign.approvers(accounts[1]);
  //   assert.equal(approver, true);
  // });

  // it("checks minimum contribution value", async () => {
  //   const campaign = await Campaign.new(3, owner, "", "", "", "", "");
  //   await campaign.contribute({ from: accounts[1], value: web3.utils.toWei("1", "ether") }, 4);

  //   const min = await campaign.minimumContribution();
  //   assert.equal(min.toNumber(), 3);
  // });

  it("validates minimum contribution is sent", async () => {
    const min = 10;

    try {
      const newCampaign = await Campaign.new(min, owner);
      await newCampaign.contribute({ from: accounts[1], value: 0 });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allow manager to make payment request and validate request values", async () => {
    const description = "buy battery";
    const value = 100;
    const account = accounts[3];

    await campaign.createRequest(description, value, account, {
      from: owner,
    });

    request = await campaign.requests(0);

    assert.equal(request.description, description);
    assert.equal(request.value.toNumber(), value);
    assert.equal(account, accounts[3]);
  });

  // it("test entire campaign process - create, contribute, approve and finalize request", async () => {
  //   await campaign.contribute({
  //     from: accounts[0],
  //     value: web3.utils.toWei("1", "ether"),
  //   }, 2);

  //   const description = "buy battery";
  //   const value = web3.utils.toWei("1", "ether");
  //   const recipient = accounts[3];

  //   await campaign.createRequest(description, value, recipient, {
  //     from: owner,
  //   });

  //   const summary = await campaign.getSummary();

  //   let recipientOldBalance = await web3.eth.getBalance(recipient);
  //   recipientOldBalance = web3.utils.fromWei(recipientOldBalance, "ether");

  //   await campaign.approveRequest(0);
  //   await campaign.finalizeRequest(0);

  //   let recipientNewBalance = await web3.eth.getBalance(recipient);
  //   recipientNewBalance = web3.utils.fromWei(recipientNewBalance, "ether");

  //   assert(recipientNewBalance > recipientOldBalance);
  // });
});
