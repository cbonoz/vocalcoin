import React, { Component } from 'react'
import { Button, Modal, Popover, Tooltip, OverlayTrigger, ControlLabel, Form, FormGroup, FormControl } from 'react-bootstrap';
import api from '../../utils/api';

import { getIssueDetails, postVote } from '../../utils/api';

import vocal from '../../assets/vocal_title.png';

export default class IssueModal extends Component {

    constructor(props) {
        super(props)

        console.log('currentUser', this.props.currentUser);

        this.state = {
            postIssueEnabled: true,
            error: null,
            issueTitle: '',
            issueDescription: '',
        };

        this._createIssueFromForm = this._createIssueFromForm.bind(this);
        this.postIssue = this.postIssue.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    handleDescriptionChange(e) {
        this.setState({ issueDescription: e.target.value });
    }

    handleTitleChange(e) {
        this.setState({ issueTitle: e.target.value });
    }

    _createIssueFromForm() {
        const self = this;
        const issueAuthorEmail = self.props.currentUser.email;
        const issueAuthorId = self.props.currentUser.id;

        const issueTitle = self.state.issueTitle;
        const issueDescription = self.state.issueDescription;

        const place = self.props.lastLocation;

        const center = JSON.parse(JSON.stringify(self.props.center));
        const issueLat = center.lat;
        const issueLng = center.lng;

        const issue = {
            title: issueTitle,
            userId: issueAuthorId,
            userEmail: issueAuthorEmail,
            description: issueDescription,
            lat: issueLat,
            lng: issueLng,
            place: place,
            active: true
        };
        console.log('issue', JSON.stringify(issue));
        return issue;
    }

    postIssue() {
        const self = this;
        self.setState({ postIssueEnabled: false, error: null });
        const issue = self._createIssueFromForm()

        api.postIssue(issue).then((res) => {
            self.setState({ postIssueEnabled: true });
            console.log('postIssue: ' + res);
        }).catch((err) => {
            self.setState({ postIssueEnabled: true, error: err });
        });
    }

    render() {
        const self = this;
        const issue = self.props.issue;

        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
            </Popover>
        );
        const tooltip = (
            <Tooltip id="modal-tooltip">
                wow.
            </Tooltip>
        );

        const center = JSON.parse(JSON.stringify(self.props.center));
        const lat = parseFloat(center['lat']).toFixed(2);
        const lng = parseFloat(center['lng']).toFixed(2);

        const lastLocation = self.props.lastLocation;

        const currentUser = self.props.currentUser;
        let userName = '';
        if (currentUser) {
            userName = currentUser.email.split('@')[0];
        }

        return (
            <div>
                <Modal show={this.props.showIssueModal} onHide={this.props.toggleIssueModal}>
                    <Modal.Header closeButton>
                        <Modal.Title className="centered">Create New Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <hr />
                        <div className="centered">
                            <img src={vocal} className="centered modal-image" />
                            <form>

                                <FormGroup bsSize="large" controlId="formBasicText" className="issue-form-group">
                                    <ControlLabel>Issue Title:</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.state.issueTitle}
                                        placeholder="Ex: Do you support Donald Trump?"
                                        onChange={this.handleTitleChange}/>
                                    <FormControl.Feedback />
                                </FormGroup>

                                <FormGroup controlId="formBasicText" className="issue-form-group">
                                    <ControlLabel>Issue Description:</ControlLabel>
                                    <FormControl
                                        rows="6"
                                        type="textarea"
                                        value={this.state.issueDescription}
                                        placeholder="Ex: Vote Yes or No if you generally support or disapprove of Trump's office."
                                        onChange={this.handleDescriptionChange}/>
                                    <FormControl.Feedback />
                                </FormGroup>

                                <FormGroup>
                                    <hr/>
                                    <p>Issue location will be your current map center location: i.e.</p>
                                    <p><b>Latitude:&nbsp;</b>{lat}, <b>Longitude: </b>{lng}</p>
                                    <p><b>Last Location:&nbsp;</b>{lastLocation}</p>
                                    <p>and will appear with the user handle: <b>{userName}</b></p>
                                </FormGroup>

                                <Button bsStyle="success" onClick={self.postIssue} disabled={!self.state.postIssueEnabled}>
                                    Create Issue
                                </Button>

                                {self.state.error && <div className="error-text">{self.state.error}</div>}

                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.toggleIssueModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}