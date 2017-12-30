import React, { Component } from 'react'
import Issue from './../dash/Issue';

export default class VoteStats extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const issue = self.props.issue;
        const currentUser = self.props.currentUser;
        return (
            <div>
                {/* TODO: add modal specific vote stats */}
                <Issue issue={issue} currentUser={currentUser}/>
            </div>
        )
    }
}
