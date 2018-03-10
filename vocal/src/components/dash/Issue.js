import React, { Component } from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap';
import api from '../../utils/api';
import helper from '../../utils/helper';

import { ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import { toast } from 'react-toastify';

export default class Issue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            loading: false,
            err: null,
            votes: undefined
        }

        this.fetchComments = this.fetchComments.bind(this)
        this.deleteIssue = this.deleteIssue.bind(this);
    }

    deleteIssue(issue) {
        const self = this;
        const issueId = issue.id
        // console.log('delete', issueId);

        const userId = self.props.currentUser.uid;

        if (!self.state.loading) {
            self.setState({ loading: true , err: null});
            api.postDeleteIssue(userId, issueId).then((data) => {
                // console.log(JSON.stringify(data));
                self.setState({ loading: false });
                toast(<div><b>Deleted Issue</b></div>);
                if (self.props.updateIssues) {
                    self.props.updateIssues();
                }
            }).catch((err) => {
                self.setState({ loading: false, err: err })
            });
        }
    }

    fetchComments(issue) {
        const self = this;
        // console.log('clicked', issue.id);
        if (!self.state.loading) {
            self.setState({ loading: true, err: null });
            api.getVotesForIssueId(issue.id).then((data) => {
                const issueVotes = data;
                // console.log(JSON.stringify(issueVotes));
                self.setState({ loading: false, votes: issueVotes });
            }).catch((err) => {
                self.setState({ loading: false, err: err })
            });
        }
    }

    render() {
        const self = this;
        const issue = self.props.issue;
        const currentUser = self.props.currentUser;
        const votes = self.state.votes;

        const isOwner = issue.userId === currentUser.uid;

        const fetchCommentsPopover = (
            <Popover id="fetch-comments-popover" title="Fetch Comments">
                <p>Click to Refresh Comments below</p>
            </Popover>
        );

        const deleteIssuePopover = (
            <Popover id="delete-issue-popover" title="Delete Issue">
                <p>Click to Delete this Issue. Warning this cannot be undone.</p>
            </Popover>
        );

        return (
            <div>
                <div className="issue-row issue-text">
                    <div className="issue-heading">
                    <div>
                        <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={fetchCommentsPopover}>
                            <i onClick={() => self.fetchComments(issue)} className="issue-row-icon fa fa-3x fa-comments" aria-hidden="true"></i>
                        </OverlayTrigger>
                        {isOwner && <span className="pull-right">
                            <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={deleteIssuePopover}>
                                <i onClick={() => self.deleteIssue(issue)} className="issue-row-icon fa fa-3x fa-trash-o" aria-hidden="true"></i>
                            </OverlayTrigger>
                        </span>}
                    </div>


                        <h3>
                            Issue: <b>{issue.title}</b>
                        </h3><br/>
                            <p>Issue Description: <b>{issue.description}</b></p>
                            <p>Issue Created: <b>{helper.formatDateTimeMs(issue.time)}</b></p>
                    </div>

                    {self.state.err && <div className="error-text">
                        {helper.processError(self.state.err)}
                    </div>}

                    <hr/>

                    {(votes === undefined) && <div onClick={() => self.fetchComments(issue)}>Click here or comment icon above to load public comments</div>}
                    {(votes !== undefined && votes.length == 0) && <div>No Votes yet.</div>}
                    {(votes !== undefined && votes.length > 0) && <div>
                        <h5>Net Vote Score: <b>{helper.getAgreeScoreFromVotes(votes)}</b></h5>
                        {votes.map((vote, index) => {
                            return (<div key={index} className="vote-row">
                                <p>Vote: <b>{helper.convertAgreeToText(vote.agree)}</b></p>
                                <p>Comment: {vote.message}</p>
                                <p>Time: <b>{helper.formatDateTimeMs(vote.time)}</b></p>
                            </div>);
                        })}
                    </div>}
                </div>
            </div>
        )
    }
}
