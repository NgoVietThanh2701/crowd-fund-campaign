import React, { Component } from "react";
import { Button, Icon  } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaigns from "../../utils/campaign";
import { Link } from '../../routes';
import ListRatingRow from "../../../components/ListRatingRow";


export default class Rating extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaigns(address);
        const listRatingCount = await campaign.methods.getRatingCount().call();
        const sumRating = await campaign.methods.sumRating().call();

        const list_ratings = await Promise.all(
            Array(parseInt(listRatingCount)).fill().map((element, index) => {
                return campaign.methods.ratings(index).call()
            })
        );

        return { address, list_ratings, listRatingCount, sumRating }
    }
    
    renderRows() {
        return this.props.list_ratings.map((list_rating, index) => {
            return <ListRatingRow
                key={index}
                list_rating={list_rating}
            />;
        });
    }

    render() {

        return (
            <Layout>
                 <Link route={`/campaigns/${this.props.address}`}>
                    <a>
                        <Button icon><Icon name='backward'/></Button>
                    </a>
                </Link>
                <div style={{ textAlign:'center'  }}>
                    <span style={{ color: "#0066ff", fontSize: "30px", fontFamily:"-moz-initial"}}>
                        Rating of campaign
                    </span>
                </div>
               <span style={{ color: "back", fontSize: "18px", marginLeft: "500px" }}> {(this.props.listRatingCount > 0) ? 
                    this.renderRows() : "No have rating!"} 
               </span>
               <br/>
                <Link route={`/campaigns/${this.props.address}/rating-campaign/newRating`}>
                        <a>
                            <Button animated primary style={{ marginTop: "5px" }}>
                                <Button.Content visible>Add Rating</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='add' />
                                </Button.Content>
                            </Button>
                        </a>
                </Link>
            </Layout>
        )
    }
}