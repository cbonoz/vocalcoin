import React, { Component } from 'react'
import { Button, Modal, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import api from '../../utils/api';
import helper from '../../utils/helper';

import { ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import { toast } from 'react-toastify';

import vocalTitle from '../../assets/vocal_title.png';
import vocalWebp from '../../optimized_media/vocal_title.webp';

export default class IssueModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vocalBalance: -1,
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
        const currentUser = self.props.currentUser;

        const issueTitle = self.state.issueTitle;
        const issueDescription = self.state.issueDescription;

        const place = self.props.lastLocation;

        const center = JSON.parse(JSON.stringify(self.props.center));
        const issueLat = center.lat;
        const issueLng = center.lng;

        const issue = {
            title: issueTitle,
            userId: currentUser.uid,
            description: issueDescription,
            lat: issueLat,
            lng: issueLng,
            place: place,
            active: true,
            time: Date.now()
        };
        // console.log('issue', JSON.stringify(issue));
        return issue;
    }

    postIssue() {
        const self = this;
        self.setState({ postIssueEnabled: false, error: null });
        const issue = self._createIssueFromForm();

        api.postIssue(issue).then((res) => {
            self.setState({ postIssueEnabled: true });
            // console.log('postIssue: ' + res);
            toast(<div><b>Issue Created! (Cost {api.ISSUE_COST} Vocal)</b></div>);
            self.props.toggleIssueModal();
        }).catch((err) => {
            self.setState({ postIssueEnabled: true, error: err});
        });
    }

    render() {
        const self = this;
        const issue = self.props.issue;

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
                        <Modal.Title>Create New Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <hr />
                        <div>
                            <img src={vocalTitle} webp={vocalWebp} className="modal-image" />

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
                                    <p>Issue location will be your current map location: i.e.</p>
                                    {lastLocation && <p>Location: <b>&nbsp;{lastLocation} (lat: {lat}, lng: {lng})</b></p>}
                                    {!lastLocation && <p className="error-text">Navigate/Search on the map to select your issue location</p>}
                                    {/* <p>and will appear with the user handle: <b>{userName}</b></p> */}
                                </FormGroup>

                                <Button bsStyle="success" onClick={self.postIssue} disabled={(!self.state.postIssueEnabled || !lastLocation)}>
                                    Create Issue&nbsp;{!self.state.postIssueEnabled && <i className="centered clear fa fa-refresh fa-spin" aria-hidden="true"></i>}
                                </Button>

                                {self.state.error && <div className="error-text">{helper.processError(self.state.error)}</div>}
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.toggleIssueModal}>Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}