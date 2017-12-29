import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import Issue from './Issue';
import api from '../../utils/api';

export default class Issues extends Component {

    constructor(props) {
        super(props);
        this.state = {
            issues: [],
            loading: false,
            err: null,
            currentUser: this.props.currentUser
        }
    }

    render() {
        const self = this;
        const issues = self.props.issues;

        return (
            <div>
                <ListGroup>
                    <ListGroupItem className={"sidebar-item"} header={"Vocal Control Panel"} bsStyle="info" />

                    <div className="your-balance">Your Balance: <b>{self.props.balance}</b> vocal</div>
                    {self.state.err && <div className="error-text">
                        {JSON.stringify(self.state.err)}
                    </div>}
                    {issues.map((issue, index) => {
                        return <Issue key={index} issue={issue} />
                    })}
                </ListGroup>
            </div>
        )
    }
}
