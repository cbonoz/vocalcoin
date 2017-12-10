import React, { Component } from 'react'
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import api from '../../utils/api';

import { getIssueDetails, postVote } from '../../utils/api';

import vocal from '../../assets/vocal_square_trans.png';

export default class IssueModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: false,
        };

        this._createIssueFromForm = this._createIssueFromForm.bind(this);
        this.postIssue = this.postIssue.bind(this);

    }

    _createIssueFromForm(form) {
        return {};
    }

    componentWillMount() {
        // TODO: invoke web request (if necessary) to retrieve the details for the selected issue id.
    }

    postIssue() {
        const self = this;
        self.setState({loading: true});
        // TODO: grab fields from form and post to server.
        const form = null;
        const issue = self._createIssueFromForm(form)

        api.postIssue(issue).then((res) => {
            self.setState({loading: false, error: null});
            console.log('postIssue: ' + res);
            // TODO: alert user that issue created and close the modal.

        }).catch((err) => {
            self.setState({loading: false, error: err});
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
        return (
            <div>
                <Modal show={this.props.showModal} onHide={this.props.toggleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title className="centered">Create New Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <hr />
                        {/* Overflowing text vertically will automatically scroll */}
                        <div className="centered">
                            {/* TODO: Add form to create new issue and post to server. */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.toggleModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}