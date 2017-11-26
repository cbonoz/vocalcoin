import React, { Component } from 'react'
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';

import AccountHistory from './AccountHistory';
import UpdateAddress from './UpdateAddress';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        const self = this;
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            self.setState({ currentUser: user });
        })
    }

    componentWillUnmount() {
        this.removeListener();
    }

    render() {
        const self = this;
        return (
            <div className="dashboard-content">
                <h1>Dashboard (protected)</h1>
                <Row>
                    <Col xs={12} md={6}>
                        <ListGroup>
                            <ListGroupItem header={'Account History'}/>
                            <ListGroupItem>
                                <AccountHistory currentUser={self.state.currentUser}/>
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                            <ListGroupItem header={'Manage Deposit Address'}/>
                            <ListGroupItem>
                                <UpdateAddress currentUser={self.state.currentUser}/>
                            </ListGroupItem>
                    </Col>
                </Row>
            </div>
        )
    }
}
