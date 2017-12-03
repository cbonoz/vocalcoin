import React, { Component } from 'react'
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';

import { firebaseAuth } from '../../utils/fire';

import AccountHistory from './AccountHistory';
import UpdateAddress from './UpdateAddress';

import vocal from '../../assets/vocal_trans_black.png';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    render() {
        const self = this;
        return (
            <div className="dashboard-content centered">
                <img src={vocal} className="centered dashboard-image" />
                {/* <p class="italic">Dashboard</p> */}
                {self.state.currentUser && <p className="email-subtitle">{self.state.currentUser.email}</p>}
                <Row>
                    <Col xs={12} md={12}>
                        <ListGroup>
                            <ListGroupItem header={'User Dashboard'} bsStyle="success" />
                            <ListGroupItem>
                                <AccountHistory currentUser={self.state.currentUser} />
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col xsHidden md={1} />
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                        <ListGroupItem header={'Manage Deposit Address'} bsStyle="danger" />
                        <ListGroupItem>
                            <UpdateAddress currentUser={self.state.currentUser} />
                        </ListGroupItem>
                    </Col>
                </Row>
            </div>
        )
    }
}
