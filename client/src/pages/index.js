import React, { Component } from 'react';
import factory from './utils/factory';
import { Card, Button, Grid, Image, GridRow } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from './routes';
import Campaign from "../pages/utils/campaign";

class CampaignIndex extends Component {

   static async getInitialProps() {
        // next js execute on the server side
        const campaigns = await factory.methods.getDeployedContracts().call();
        const list_name = [];
        const list_description = [];
        const list_balance = [];
        const list_startTime = [];
        for(let i=0; i< campaigns.length ; i++) {
            const campaign = Campaign(campaigns[i]);
            const summary = await campaign.methods.getSummary().call();
            list_name.push(summary[1]);
            list_description.push(summary[2])
            list_balance.push(summary[4])
            list_startTime.push(summary[8])
        }
        
        return {campaigns, list_name, list_description, list_balance, list_startTime}
    }


    renderCampaigns() {
            
        const items = this.props.campaigns.map( (address, index) => { 
            return {
                header: this.props.list_name[index],
                meta : this.props.list_description[index] + " | " + this.props.list_startTime[index].replace("GMT+0700 (Giờ Đông Dương)", "") ,  
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true, 
                style: { overflowWrap: 'break-word', },
            }; 
        }).reverse();
  
        return <Card.Group items={items}/>;
    }

    render() {

        return (
            <Layout>
                <Grid >
                    <Grid.Column widescreen={6} style={{ marginTop: '5px' }}>
                        <Image src="https://knowledge.skema.edu/wp-content/uploads/2020/10/shutterstock_1356273047-scaled.jpg"/>
                    </Grid.Column>
                    <Grid.Column widescreen={10} style= {{ marginTop: '5px' }}>
                        <div style={{ marginBottom: '10px', marginTop: '10px', fontSize: '20px' }}>List Campaigns</div>
                        {this.renderCampaigns()}
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
    
}



export default CampaignIndex;
