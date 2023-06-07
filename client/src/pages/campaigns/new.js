import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message, TextArea } from "semantic-ui-react";
import factory from "../utils/factory";
import web3 from "../utils/web3";
import { useRouter } from "next/router";
import Datetime from "react-datetime";
import "../../node_modules/react-datetime/css/react-datetime.css";
import moment from 'moment';
import { FaStar } from 'react-icons/fa';

var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};

function CampaignNew() {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignImage, setCampaignImage] = useState("");
  const [campaignEndTimer, setCampaignEndTimer] = useState(new Date());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); 

  return (
    <Layout>

      <h3>Create a New Campaign</h3>
      <Form onSubmit={onSubmit} error={!!message}>
        <Message error header="Oops!" content={message} />
        <Form.Field>
          <label>Minimum Amount contribute for campaign</label>
          <Input placeholder = "Enter amount ether" focus
            label="ether"
            labelPosition="right"
            onChange={(event) => setMinimumContribution(event.target.value)}/>
        </Form.Field>
        <Form.Field required={true}>
          <label>Name for campaign</label>
          <Input placeholder="Enter name"
            onChange={(event) => setCampaignName(event.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Description for campaign</label>
          <TextArea placeholder="Enter description"
              onChange = {(event) => setCampaignDescription(event.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Campaign End time </label>
          <br />
            <div>
              <Datetime
                inputProps={{ placeholder: "Datetime Picker Here" }}
                dateFormat="DD-MM-YYYY"
                isValidDate={ valid }
                onChange = { campaignEndTimer => setCampaignEndTimer(campaignEndTimer) }
              />
            </div>
        </Form.Field>
        <Form.Field>
          <label>Campaign Image</label>
          <Input icon='images'  placeholder="Enter url image" iconPosition='left'
              onChange={(event) => setCampaignImage(event.target.value)}/>
        </Form.Field>

        <Button primary loading={loading}>
          Create Campaign
        </Button>
      </Form>
    </Layout>
  );

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();

      setMessage("");
      setLoading(true);
      
      await factory.methods.createCampaign( web3.utils.toWei(minimumContribution, 'ether'), campaignName, campaignDescription, campaignImage, 
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
          new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()).toString(), new Date(campaignEndTimer).toString() ).send({
        from: accounts[0], gas: '2000000'
      });

      setMessage("Transaction was successful!");
      setLoading(false);

      router.push(`/`);
    } catch (err) {
      console.log(err);
      setMessage(err.message);
      setLoading(false);
    }
  }
}

export default CampaignNew;
