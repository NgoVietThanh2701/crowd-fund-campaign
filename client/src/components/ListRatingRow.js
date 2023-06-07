import React, { Component } from 'react'
import {  Comment } from 'semantic-ui-react';
import { FaStar } from 'react-icons/fa';

export default class ListRatingRow extends Component {

    render() {
        const { list_rating  } = this.props;

        return (
            <Comment.Group size='large'>
                <Comment>
                    <Comment.Avatar as='a' src='https://dongthap.gov.vn/documents/211570/1555274/avatar.png/777e79d3-111e-95cb-24a3-672f8f6889aa?t=1591874123798&download=true' />
                    <Comment.Content>
                        <Comment.Author>{list_rating.reviewer}</Comment.Author>
                        <Comment.Metadata>
                            <div>
                            {[...Array(5)].map((star, i) => {
                            const ratingValue = i+1;
                            return (   
                                <FaStar 
                                    className="star" 
                                    color={ratingValue <= list_rating.starRating  ? "#ffc107" : "#e4e5e9"} 
                                    size={20}
                                /> 
                            );
                        })}
                            </div>
                            <div>{(list_rating.dateRating).replace("GMT+0700 (Giờ Đông Dương)", "")}</div>
                        </Comment.Metadata>
                        <Comment.Text>
                            {list_rating.descriptionRating}
                        </Comment.Text>
                    </Comment.Content>
                </Comment>
            </Comment.Group>
        );
    }
}