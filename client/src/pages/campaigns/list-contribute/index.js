import React, { Component } from "react";
import { Button, Table, Grid, Icon, Label } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaigns from "../../utils/campaign";
import web3 from "../../utils/web3";
import { Link } from '../../routes';
import ListContributeRow from "../../../components/ListContributeRow";

export default  class ListContributeIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaigns(address);
        const listContributesCount = await campaign.methods.getListContributeCount().call();
        const summary = await campaign.methods.getSummary().call();
        const contractBalance = summary[4];

        const list_contributes = await Promise.all(
            Array(parseInt(listContributesCount)).fill().map((element, index) => {
                return campaign.methods.listcontributes(index).call()
            })
        );
        return { address, list_contributes, listContributesCount, contractBalance}
    }
    
    renderRows() {
        return this.props.list_contributes.map((list_contribute, index) => {
            return <ListContributeRow
                key={index}
                list_contribute={list_contribute}
                id={index}
            />;
        });
    }

    render() {

        const { Header, Row, HeaderCell, Body } = Table;
        const campaignsBalance = this.props.contractBalance;

        return (
            <Layout>
                <h3>List Contribute</h3>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            <Link route={`/campaigns/${this.props.address}/`}>
                                <a>
                                    <Button icon><Icon name='backward' /></Button>
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column textAlign='justified'>
                            <Label>
                                <Icon name='ethereum' /> {web3.utils.fromWei(campaignsBalance, 'ether')} ether
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Date</HeaderCell>
                            <HeaderCell>Contributer</HeaderCell>
                            <HeaderCell>Mount</HeaderCell>
                        </Row>
                    </Header>   
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.listContributesCount} contributes.</div>
            </Layout>
        )
    }
}