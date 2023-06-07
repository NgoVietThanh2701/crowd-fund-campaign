// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

//this contract creates campaigns and tracks the campaigns that have been deployed
contract CampaignFactory {
    //stores deployed campaigns in array
    address[] public deployedContracts;

    //creates campaign and adds it to the array for tracking
    function createCampaign(uint256 minimum, string memory name, string memory des, string memory img, string memory startTimer, string memory endTimer) public {
        address newCampaign = address(new Campaign(minimum, msg.sender, name, des, img, startTimer, endTimer));
        deployedContracts.push(newCampaign);

        emit CampaignFactoryAction("New campaign deployed via CampaignFactory");
    }

    //returns an array of deployed campaign contract addresses
    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }

    event CampaignFactoryAction(string actionTaken);
}

contract Campaign {
    event CampaignAction(string actionTaken);

    //stores manager/contract creator
    address public manager;

    //stores min. contribution to create a Campaign
    uint256 public minimumContribution;
    string public campaignName;
    string public campaignDescription;
    string public campaginImage;
    string public campaignStartTimer;
    string public campaignEndTimer;

    //stores approvers/contributors
    mapping(address => bool) public approvers;

    //store user rating
    mapping(address => bool) public reviewers;
    uint public sumRating;


    //stores the number of approvers (used in the formula when determining if > 50% have approved request)
    uint256 public approversCount;

    //struct stores Request info
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool)  approvals;
    }

    //stores array of campaign request
    Request[] public requests;

    struct ListContribute {
        string dateContribute;
        address contributer;
        uint mountContribute;
    }

    ListContribute[] public listcontributes;
    
    //struct store rating campaign
    struct Rating {
        string dateRating;
        address reviewer;
        string descriptionRating;
        uint starRating;
    }
    Rating[] public ratings;

    //constructor requires a min. wei amount, and the creators eth address
    constructor(uint256 _minimumContribution, address creator, string memory _campaginName, string memory _campaignDescription, 
        string memory _campaginImage, string memory timerStart, string memory timerEnd) {
        manager = creator;
        minimumContribution = _minimumContribution;
        campaignName = _campaginName;
        campaignDescription = _campaignDescription;
        campaginImage = _campaginImage;
        campaignStartTimer = timerStart;
        campaignEndTimer = timerEnd;
        emit CampaignAction("Campaign was created"); 
    }

    //
    function contribute(string memory _dateContribute, uint _mountContribute) public payable {
        //validates the minimum contribution amount is sent to the Campaign contract
        require(
            msg.value >= minimumContribution,
            "You must contribute a minimum amount of wei"
        );

        //adds the contributors address to the approver array and increments the approver count by 1

        if(approvers[msg.sender] == false ) {
            approversCount++;
        }
        approvers[msg.sender] = true;
        
        ListContribute storage newListContribute = listcontributes.push();
        newListContribute.dateContribute = _dateContribute;
        newListContribute.contributer = msg.sender;
        newListContribute.mountContribute = _mountContribute;

        emit CampaignAction("Contribution was made");
    }

    //creates a campaign request only is the caller is the owner of the contract
    function createRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public onlyOwner {
        Request storage newRequest = requests.push();
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        emit CampaignAction("Request created");
    }

    // creaete rating

    function createRating(string memory _dateRating, string memory _descriptionRating, uint _star) public onlyApprover {
        require(
            !reviewers[msg.sender],
            "You can't rating campaign more than once"
        );
        Rating storage newRating = ratings.push();
        newRating.dateRating = _dateRating;
        newRating.reviewer = msg.sender;
        newRating.descriptionRating = _descriptionRating;
        newRating.starRating = _star;
        reviewers[msg.sender] = true;
        sumRating+=_star;
    }

    function approveRequest(uint256 _index) public onlyApprover {
        //retrieves the campaign request from the ethereum blockchain
        Request storage request = requests[_index];

        //makes sure contract caller does not approve request more than once
        require(
            !request.approvals[msg.sender],
            "You can't approve request more than once"
        );

        //increments the approvalCount by 1
        request.approvalCount++;
        request.approvals[msg.sender] = true; //helper function to add callers address to approvals mapping
        
        emit CampaignAction("Approval request sent");
    }


    function finalizeRequest(uint256 _index) public onlyOwner {
        //using storage keyword to show that we are looking at the same Request that already exist in storage
        Request storage request = requests[_index];

        //validates request has not already been approved
        require(
            !request.complete,
            "You can't finalize a request more than once!"
        );

        //validates more than 50% of the approvers have approved te request
        require(
            request.approvalCount > (approversCount / 2),
            "At least 50% of the approvers must have approved this request before it can be finalized"
        );

        //sets the request as approved and transfers the ETH to the recipient address in the request 
        request.complete = true;
        request.recipient.transfer(request.value);

        emit CampaignAction("Request was finalized");
    }

    //returns a summary of the campaign request in a Result object

    function getSummary() public  view returns (uint,string memory, string memory, string memory, uint, uint, uint, address, string memory, string memory)  {
        return (
            minimumContribution,
            campaignName,
            campaignDescription,
            campaginImage,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            campaignStartTimer,
            campaignEndTimer
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getListContributeCount() public view returns (uint) {
        return listcontributes.length;
    }

    function getRatingCount() public view returns (uint) {
        return ratings.length;
    }

    //modifier to check if address is an approver
    modifier onlyApprover() {
        require(approvers[msg.sender], "Your must be an approver");
        _;
    }

    //modifier to check if the caller is the contract owner
    modifier onlyOwner() {
        require(
            manager == msg.sender,
            "Only the owner can perform this action!"
        );
        _;
    }
}