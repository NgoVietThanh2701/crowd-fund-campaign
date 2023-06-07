import web3 from "./web3";
import CampaignFactory from "../../contracts/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  //You will place your smart contract address here
  "0x6a70FC26dbbf28b049498e6c6689bc436fe5560f"
);

export default instance;
