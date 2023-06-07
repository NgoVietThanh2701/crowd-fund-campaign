import React, { Component } from 'react'
import { Table, Button, Message, Icon, Popup } from 'semantic-ui-react';
import web3 from "../pages/utils/web3";

export default class ListContributeRow extends Component {

    render() {
        const { Row, Cell } = Table;
        const { id, list_contribute } = this.props;

        return (
            <Row >
                <Cell>{id}</Cell>
                <Cell>{(list_contribute.dateContribute).replace("GMT+0700 (Giờ Đông Dương)", "")}</Cell>
                <Cell>{list_contribute.contributer}</Cell>
                <Cell>{web3.utils.fromWei(list_contribute.mountContribute, 'ether')} ether</Cell>
            </Row>
        );
    }
}