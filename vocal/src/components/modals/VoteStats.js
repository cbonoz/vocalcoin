import React, { Component } from 'react'
import Issue from './../dash/Issue';

export default class VoteStats extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const self = this;
        const issue = self.props.issue;
        const currentUser = self.props.currentUser;
        return (
            <div>
                <h2 className="facebook-blue">You Voted on this Issue!</h2>
                
                <Issue issue={issue} currentUser={currentUser}/>
            </div>
        )
    }
}
