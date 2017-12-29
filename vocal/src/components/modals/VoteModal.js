import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar, ControlLabel, FormControl, FormGroup, ToggleButton, ToggleButtonGroup, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';

import api from '../../utils/api';
import helper from '../../utils/helper';

import { ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import { toast } from 'react-toastify';

import vocal from '../../assets/vocal_title.png';

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
        console.info(selectedVotes);
        self.setState({voteAgree: selectedVotes});
    }

    handleVoteMessageChange(e) {
        this.setState({ voteMessage: e.target.value });
    }

    _createVoteFromForm() {
        const self = this;

        const issue = self.props.issue;
        const currentUser = self.props.currentUser;

        const voteAgree = self.state.voteAgree;
        const voteMessage = self.state.voteMessage;

        const center = JSON.parse(JSON.stringify(self.props.center));
        const voteLat = center.lat;
        const voteLng = center.lng;

        const vote = {
            agree: voteAgree,
            message: voteMessage,
            issueId: issue.ID,
            userId: currentUser.uid,
            lat: voteLat,
            lng: voteLng,
            time: Date.now()
        };

        console.log('vote', JSON.stringify(vote));
        return vote;
    }

    postVote() {
        const self = this;
        self.setState({ postVoteEnabled: false, error: null });
        const vote = self._createVoteFromForm()

        api.postVote(vote).then((res) => {
            self.setState({ postVoteEnabled: true });
            console.log('postVote: ' + res);
            toast(<div><b>Vote Cast!</b></div>);
            self.props.toggleVoteModal();
            // TODO: alert vote that vote was cast and close the modal.

        }).catch((err) => {
            self.setState({ postVoteEnabled: true, error: err.statusText });
        });
    }

    render() {
        const self = this;
        const issue = self.props.issue;

        return (
            <div>
                <Modal show={self.props.showVoteModal} onHide={self.props.toggleVoteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title className="centered">Vote on: <b>{issue && issue.title}</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <hr />
                        <div>
                            <img src={vocal} className="centered modal-image" />
                            <form>

                                <h3 className="centered modal-header">Issue:</h3>

                                <p>Issue: <b>{issue.title}</b></p>
                                <p>Description: <b>{issue.description}</b></p>
                                <p>Affects location: <b>{issue.place}</b></p>
                                <p>Created: <b>{helper.formatDateTimeMs(issue.time)}</b></p>

                                <h5 className="centered modal-header">Your Vote:</h5>

                                <FormGroup controlId="formRadioButton" className="vote-form-group centered">
                                    <ControlLabel>Vote</ControlLabel>
                                    <ButtonToolbar className="centered radio-form-input">
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
                                    <ControlLabel>Additional Comments</ControlLabel>
                                    <FormControl
                                        rows="6"
                                        type="textarea"
                                        value={self.state.voteMessage}
                                        placeholder="Ex: I agree, we should also add a new children hospital wing to the downtown metro area."
                                        onChange={self.handleVoteMessageChange}/>
                                    <FormControl.Feedback />
                                </FormGroup>


                                <Button bsStyle="success" onClick={self.postVote} disabled={!self.state.postVoteEnabled}>
                                    Cast Vote
                                </Button>

                                {self.state.error && <div className="error-text">{self.state.error}</div>}

                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.toggleVoteModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}