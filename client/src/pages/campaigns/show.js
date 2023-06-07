import React, { Component } from 'react';
import Layout from "../../components/Layout";
import { Button, Card, Grid, Image, Icon, Label } from "semantic-ui-react";
import Campaign from "../utils/campaign";
import  ContributeForm  from '../../components/ContributeForm'
import web3 from "../utils/web3";
import { Link } from '../routes.js';
import CountDown from '../../components/CountDown';

export default class CampaignShow extends Component {
    
  static async getInitialProps(props) {
      
      const campaign = Campaign(props.query.address);
      const summary = await campaign.methods.getSummary().call();
      const listRatingCount = await campaign.methods.getRatingCount().call();
      const sumRating = await campaign.methods.sumRating().call();
      
      return {
          address: props.query.address,
          minimumContribution: summary[0],
          campaignName : summary[1],
          campaignDescription : summary[2],
          campaignImage : summary[3],
          campaignBalance: summary[4],
          noOfReq: summary[5],
          noOfContributor: summary[6],
          manager: summary[7],
          campaignStart : summary[8],
          campaignEnd : summary[9],
          listRatingCount : listRatingCount,
          sumRating : sumRating
      };
    }

  renderCard() {

      // de structuring
      const {
          minimumContribution,
          campaignName,
          campaignDescription,
          campaignBalance,
          noOfReq,
          noOfContributor,
          manager,
      } = this.props;

      const items = [
          {
              header: manager,
              description: 'The Manager created this Campaign and can create requests to withdraw money.',
              meta: 'Address of Manager',
              style: { overflowWrap: 'break-word' }
          },
          {
                header: campaignName,
                description: campaignDescription,
                meta: "Descriptions for campaign",
                style: { overflowWrap: 'break-word' }
          },
          {
              header: web3.utils.fromWei(minimumContribution, 'ether'),
              description: 'You must contribute atleast this much wei to become a approver.',
              meta: 'Minimum Contribution (ether)',
          },
          {
              header: noOfReq,
              description: 'A request tries to withdraw money from the contract. A request must be approved by approvers.',
              meta: 'Number of Requests',

              
          },
          {
              header: noOfContributor,
              description: 'the number of people who have already donated to the campaign.',
              meta: 'No of Approvers',
          },
          {
              header: web3.utils.fromWei(campaignBalance, 'ether'),
              description: 'The amount of money campaign has left to spend.',
              meta: 'Campaign Balance (ether)',
          }
      ];

      return <Card.Group items={items} />;
  }

  render() {
      return (
          <Layout>
               <div style={{ textAlign:'center', marginBottom:'5px' }}>
                   <Button as='div' labelPosition='right' >
                        <Button basic color='blue'>
                            <Icon name='clock' />
                        </Button>
                        <Label as='a' basic color='blue' pointing='left'> 
                        { 
                            <CountDown duration = {
                                (Date.parse(this.props.campaignEnd) > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
                                new Date().getHours(), new Date().getMinutes(), new Date().getSeconds() )) ? (Date.parse(this.props.campaignEnd) - 
                                new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate(), new Date().getHours(), 
                                new Date().getMinutes(), new Date().getSeconds() ))/1000 : 0
                            }/> 
                        }
                        </Label>
                    </Button>
                </div>
              <Grid  divided>
                <Grid.Row stretched>
                    <Grid.Column width={9}>
                        {this.renderCard()}
                    </Grid.Column>
                    <Grid.Column width={7} >
                        <Grid.Column>
                            <Image src= {this.props.campaignImage} size='big' rounded centered bordered />
                        </Grid.Column>
                        <Grid.Column>
                          <ContributeForm address={this.props.address} /> 
                        </Grid.Column>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={2}>
                        <Link route={`/campaigns/${this.props.address}/requests`}>
                            <a>
                                <Button basic primary>View Requests!</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Link route={`/campaigns/${this.props.address}/list-contribute`}>
                            <a>
                                <Button basic primary>List contribute!</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Link route={`/campaigns/${this.props.address}/rating-campaign`}>
                            <a>
                                <Button as='div' labelPosition='right'>
                                    <Button basic color='blue'>
                                        <Icon name='star' /> star
                                    </Button>
                                    <Label as='a' basic color='blue' pointing='left'> 
                                        {(this.props.listRatingCount>0) ? 
                                        ((parseInt(this.props.sumRating))/(parseInt(this.props.listRatingCount))).toFixed(1) 
                                        : "No have" } 
                                    </Label>
                                </Button>
                            </a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <span style={{fontFamily:'-moz-initial', fontSize: '16px', color: 'GrayText'}}> 
                            Start time: {this.props.campaignStart}</span>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <span style={{fontFamily:'-moz-initial', fontSize: '16px', color: 'GrayText'}}>
                            End time: {this.props.campaignEnd} </span>
                    </Grid.Column>
                </Grid.Row>
              </Grid>
          </Layout>
      );
  }
}
