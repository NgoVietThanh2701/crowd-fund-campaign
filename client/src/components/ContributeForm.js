import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from "../pages/utils/campaign";
import web3 from "../pages/utils/web3";
import { Router } from '../pages/routes';

export default class ContributeForm extends Component {
    
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {

        const campaign = Campaign(this.props.address);
        const summary = await campaign.methods.getSummary().call();

        event.preventDefault();

        this.setState({
            loading: true,
            errorMessage: ''
        });

        try {
            const accounts = await web3.eth.getAccounts();
            if( Date.parse(summary[9])  < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
            new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()) ) {
                throw new Error('The campaign is over! you dont can contribute')
            } else if(web3.utils.toWei(this.state.value, 'ether') < summary[0]) {
                throw new Error('Please contribute amount than more minimum contribute!')
            } else {
                await campaign.methods.contribute( new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
                new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()).toString(), web3.utils.toWei(this.state.value, 'ether'))
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.value, 'ether')
                });
                
                Router.replaceRoute(`/campaigns/${this.props.address}`);
            }
        } catch (error) {
            this.setState({
                errorMessage: error.message
            });
        }

        this.setState({
            loading: false,
            value: ''
        });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label style={{ color:'#1a75ff', marginTop:'5px', marginBottom:'5px', fontFamily: '-moz-initial', fontSize:'16px' }}>Amount to Contribute </label>
                    <Input 
                        value={this.state.value}
                        label="ether"
                        labelPosition="right"
                        onChange={event => this.setState({
                            value: event.target.value
                        })}
                    />
                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage} />
                <div style={{ textAlign:'center' }}> 
                    <Button primary loading={this.state.loading} >
                        Contribute!
                    </Button> 
                </div>
            </Form>
        );
    }
}