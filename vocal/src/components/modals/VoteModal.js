import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar, ControlLabel, FormControl, FormGroup, ToggleButton, ToggleButtonGroup, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';

import VoteStats from './VoteStats';

import { postVote } from './../../utils/api';
import api from './../../utils/api';
import helper from './../../utils/helper';

import { ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import { toast } from 'react-toastify';

export default class VoteModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            postVoteEnabled: true,
            issue: this.props.issue,
            error: null,
            voteAgree: 1, // defaults to agree
            voteMessage: ''
        };

        this._createVoteFromForm = this._createVoteFromForm.bind(this);
        this.handleVoteChange = this.handleVoteChange.bind(this);
        this.handleVoteMessageChange = this.handleVoteMessageChange.bind(this);
        this.postVote = this.postVote.bind(this);
    }

    handleVoteChange(selectedVotes) {
        const self = this;
        // console.info(selectedVotes);
        self.setState({voteAgree: selectedVotes});
    }

    handleVoteMessageChange(e) {
        this.setState({ voteMessage: e.target.value });
    }

    _createVoteFromForm() {
        const self = this;

        const issue = self.props.issue;
        // console.log('create vote for issue', issue.id);
        const currentUser = self.props.currentUser;

        const voteAgree = self.state.voteAgree;
        const voteMessage = self.state.voteMessage;

        const center = JSON.parse(JSON.stringify(self.props.center));
        const voteLat = center.lat;
        const voteLng = center.lng;

        const vote = {
            agree: voteAgree,
            message: voteMessage,
            issueId: issue.id,
            justVoted: false,
            userId: currentUser.uid,
            lat: voteLat,
            lng: voteLng,
            time: Date.now()
        };

        // console.log('vote', JSON.stringify(vote));
        return vote;
    }

    postVote() {
        const self = this;
        self.setState({ postVoteEnabled: false, error: null });
        const vote = self._createVoteFromForm()
        const issue = self.props.issue;

        postVote(vote).then((res) => {
            self.setState({ postVoteEnabled: true, justVoted: true });
            // console.log('postVote: ' + res);
            toast(<div><b>Vote Cast! (Earned {api.VOTE_REWARD} Vocal)</b></div>);
            self.props.triggerVoteModal(issue, false);
            // TODO: alert vote that vote was cast and close the modal.

        }).catch((err) => {
            // console.log('post vote', err);
            self.setState({ postVoteEnabled: true, error: err});
        });
    }

    render() {
        const self = this;
        const issue = self.props.issue;
        const currentUser = self.props.currentUser;

        const hasVoted = self.props.hasVoted || self.state.justVoted;

        return (
            <div>
                <Modal show={self.props.showVoteModal} onHide={self.props.toggleVoteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title className="">Vote on Issue: <b>{issue && issue.title}</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {!hasVoted && <form>
                                <h3 className="modal-header">Issue:</h3>
                                <FormGroup className="vote-form-group">
                                    <p>Issue: <b>{helper.capitalize(issue.title)}</b></p>
                                    <p>Description: <b>{issue.description}</b></p>
                                    <p>Affects location: <b>{helper.capitalize(issue.place)}</b></p>
                                    <p>Created: <b>{helper.formatDateTimeMs(issue.time)}</b></p>
                                </FormGroup>

                                <h5 className="modal-header">Your Vote:</h5>

                                <FormGroup controlId="formRadioButton" className="vote-form-group">
                                    <ControlLabel>Vote: </ControlLabel>
                                    <ButtonToolbar className="radio-form-input">
                                        <ToggleButtonGroup 
                                            className="centered"
                                            type="radio"
                                            name="voteOptions"
                                            defaultValue={1}
                                            onChange={self.handleVoteChange}>
                                            <ToggleButton value={1}>Agree</ToggleButton>
                                            <ToggleButton value={-1}>Disagree</ToggleButton>
                                            <ToggleButton value={0}>Neutral</ToggleButton>
                                        </ToggleButtonGroup>
                                    </ButtonToolbar>
                                </FormGroup>

                                <FormGroup controlId="formBasicText" className="vote-form-group">
                                    <ControlLabel>Additional Comments: </ControlLabel>
                                    <FormControl
                                        rows="6"
                                        type="textarea"
                                        value={self.state.voteMessage}
                                        placeholder="Ex: I agree, we should also add a new children hospital wing to the downtown metro area."
                                        onChange={self.handleVoteMessageChange}/>
                                    <FormControl.Feedback />
                                </FormGroup>


                                <Button className="vote-button" bsStyle="success" onClick={self.postVote} disabled={!self.state.postVoteEnabled}>
                                    Cast Vote&nbsp;{!self.state.postVoteEnabled && <i className="centered clear fa fa-refresh fa-spin" aria-hidden="true"></i>}
                                </Button>

                                {!self.state.error && <p className="centered">See other votes after submitting yours!</p>}
                                {self.state.error && <div className="error-text">{helper.processError(self.state.error)}</div>}

                            </form>}
                            {hasVoted && <VoteStats currentUser={currentUser} issue={issue}/>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.toggleVoteModal}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}