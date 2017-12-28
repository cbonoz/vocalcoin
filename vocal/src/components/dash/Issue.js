import React, { Component } from 'react'
import api from '../../utils/api';

export default class Issue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            loading: false,
            err: null,
            votes: []
        }

        this.onIssueClick = this.onIssueClick.bind(this)
    }

    onIssueClick(issue) {
        const self = this;  
        console.log('clicked', issue);
        if (!self.state.loading) {
            self.setState({ loading: true, err: null });
            const user = this.state.currentUser;
            api.getVotesForIssue(issue.ID).then((data) => {
                const issueVotes = data.data;
                self.setState({ loading: true, votes: issueVotes });
            }).catch((err) => {
                self.setState( {loading: false, err: err})
            });
        }
        // TODO: fetch and expand the comments for this issue.
    }

    render() {
        const self = this;
        const issue = self.props.issue;
        const votes = self.state.votes;
        return (
            <div>
                <div className="issue-row" onClick={self.onIssueClick(issue)}>
                    {JSON.stringify(issue)}
                    {!votes.length && <div className="no-votes">No Votes yet.</div>}
                    {self.state.err && <div className="error-text">
                        {JSON.stringify(self.state.err)}
                    </div>}
                    {votes.map((vote) => {
                        <div className="vote-row">{JSON.stringify(vote)}</div>
                    })}
                </div>
            </div>
        )
    }
}
