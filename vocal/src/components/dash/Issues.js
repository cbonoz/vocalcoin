import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import Issue from './Issue';
import api from '../../utils/api';

export default class Issues extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const self = this;
        const issues = self.props.issues;
        const currentUser = self.props.currentUser;

        return (
            <div>
                <div className="centered">
                    <div className="your-balance">Account Address:<br/> <span className="emph">{self.props.address}</span></div>
                </div>
                <ListGroup>
                    <ListGroupItem className={"sidebar-item"} header={"Vocal Control Panel"} bsStyle="info" />
                    <h3 className="dash-heading">Your Issues:</h3>

                    {!issues.length && <div className="your-issues">
                        {self.props.loading && <p><b>Loading...</b></p>}
                        {!self.props.loading && <p><b>No active Issues or Vote topics created yet, why not start one?</b></p>}
                    </div>}

                    {issues.map((issue, index) => {
                        return <Issue updateIssues={self.props.updateIssues} key={index} issue={issue} currentUser={currentUser} />
                    })}
                </ListGroup>
            </div>
        )
    }
}
