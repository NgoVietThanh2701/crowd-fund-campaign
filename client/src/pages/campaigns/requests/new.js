import React, { Component } from 'react';
import { Form, Button, Message, Input, Icon } from 'semantic-ui-react';
import Campaigns from "../../utils/campaign";
import web3 from "../../utils/web3";
import { Link, Router } from '../../routes';
import Layout from '../../../components/Layout';
import { FaStar } from 'react-icons/fa';

export default class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        loading: false
    };
    

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });

        const campaign = Campaigns(this.props.address);
        const { description, value, recipient, rating, hover } = this.state;

        try {
            const accounts = await web3.eth.getAccounts();

            if (recipient == '') {
                throw new Error('address recipient not blank!');
            }
            const summary = await campaign.methods.getSummary().call();
            const contractBalance = summary[1];
            if(value>contractBalance) {
                throw new Error('Balance for campaign only remaining '+web3.utils.fromWei(contractBalance, 'ether')+" ether, not enouught transaction!");
            } else {
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaigns/${this.props.address}/requests/`)
        }
        } catch (error) {
            this.setState({
                errorMessage: error.message
            });
        } finally {
            this.setState({
                loading: false
            });
        }
    };

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <Button icon><Icon name='backward'/></Button>
                    </a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            onChange={event =>
                                this.setState({ description: event.target.value })
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            onChange={event =>
                                this.setState({ value: event.target.value })
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            onChange={event =>
                                this.setState({ recipient: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create!</Button>
                </Form>
            </Layout>
        );
    }
}