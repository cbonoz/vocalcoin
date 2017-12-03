import React, { Component } from 'react'
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VoteForm from './VoteForm';

import { getIssueDetails, postVote } from '../../utils/api';

import vocal from '../../assets/vocal_square_trans.png';

export default class IssueModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            issue: this.props.issue
        };
    }

    componentWillMount() {
        // TODO: invoke web request (if necessary) to retrieve the details for the selected issue id.
        
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
                <Modal show={this.props.showModal} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title className="centered">Log into Vocal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <hr />
                        {/* Overflowing text vertically will automatically scroll */}
                        <div className="centered">
                            <img src={vocal} className="centered login-image"/>
                            <p>{JSON.stringify(issue)}</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}