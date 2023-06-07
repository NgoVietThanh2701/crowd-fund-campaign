import React, { Component } from 'react';
import { Form, Button, Message, Input, Icon, TextArea } from 'semantic-ui-react';
import Campaigns from "../../utils/campaign";
import web3 from "../../utils/web3";
import { Link, Router } from '../../routes';
import Layout from '../../../components/Layout';
import { FaStar } from 'react-icons/fa';

export default class RatingNew extends Component {

    state = {
        rating: '',
        hover:'',
        description: '',
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
        const { description, rating } = this.state;

        try {
            const accounts = await web3.eth.getAccounts();

            if (rating == '') {
                throw new Error('Rating star for campaign!');
            } else {
            await campaign.methods.createRating(
                new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
                new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()).toString(),
                description,
                rating
            ).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${this.props.address}/rating-campaign`)
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
                <Link route={`/campaigns/${this.props.address}/rating-campaign`}>
                    <a>
                        <Button icon><Icon name='backward'/></Button>
                    </a>
                </Link>
                <Message>
                    <Message.Header>Rating for campaign</Message.Header>
                    <p>
                    You can rating the campaign after you have contributed to it. 
                    </p>
                </Message>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <div  style={{ textAlign:'center' }}> 
                        {[...Array(5)].map((star, i) => {
                            const ratingValue = i+1;
                            return (
                                <label>
                                    <input type="radio" name="rating" style={{ display:'none' }} 
                                        value={ratingValue} 
                                        onClick={() => this.setState({rating : ratingValue}) } 
                                />
                                <FaStar 
                                    className="star" 
                                    color={ratingValue <= (this.state.hover || this.state.rating)  ? "#ffc107" : "#e4e5e9"} 
                                    size={100}
                                    onMouseEnter = {() => this.setState({hover : ratingValue})}
                                    onMouseLeave = {() => this.setState({hover : null })}
                                />
                                </label>   
                            );
                        })}
                    </div>
                    <Form.Field>
                        <TextArea placeholder="Enter description rating for campaign!"
                            onChange={event =>
                                this.setState({ description: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <div style={{ textAlign:'center' }}><Button primary loading={this.state.loading}>Submit!</Button> </div>
                </Form>
            </Layout>
        );
    }
}