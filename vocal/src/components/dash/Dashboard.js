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
                {/* <h1>User Dashboard</h1> */}
                {self.state.currentUser && <p className="email-subtitle">{self.state.currentUser.email}</p>}
                <Row>
                    <Col xsHidden md={1} />
                    <Col xs={12} md={10}>
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
                    <Col xsHidden md={1} />
                    <Col xs={12} md={10}>
                        <ListGroupItem header={'Manage Deposit Address'} bsStyle="danger" />
                        <ListGroupItem>
                            <UpdateAddress currentUser={self.state.currentUser} />
                        </ListGroupItem>
                    </Col>
                    <Col xsHidden md={1} />
                </Row>
            </div>
        )
    }
}
