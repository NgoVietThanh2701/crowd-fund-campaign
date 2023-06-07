import React, { Component } from 'react';
import { Button, Table, Grid, Icon, Label } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import Campaigns from "../../utils/campaign";
import web3 from "../../utils/web3";
import { Link } from '../../routes';

export default class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaigns(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        const summary = await campaign.methods.getSummary().call();
        const contractBalance = summary[4];

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        );

        return { address, requests, requestCount, approversCount, contractBalance };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key={index}
                request={request}
                id={index}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }

    render() {

        const { Header, Row, HeaderCell, Body } = Table;
        const campaignsBalance = this.props.contractBalance;

        return (
            <Layout>
                <h3>Request</h3>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/`}>
                                <a>
                                    <Button icon><Icon name='backward' /></Button>
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                            <Label>
                                <Icon name='ethereum' /> {web3.utils.fromWei(campaignsBalance, 'ether')} ether
                            </Label>
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            { (campaignsBalance>0) ? 
                             <Link route={`/campaigns/${this.props.address}/requests/new`}>
                             <a>
                                 <Button primary>Add Request</Button>
                             </a>
                            </Link> : "Need contributer for campaign to draw!"}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>

                <div>Found {this.props.requestCount} requests.</div>

            </Layout>
        )
    }
}