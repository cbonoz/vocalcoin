import React, { Component } from 'react'
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VoteForm from './VoteForm';

import { getVoteDetails, postVote } from '../../utils/api';

import vocal from '../../assets/vocal_square_trans.png';

export default class VoteModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vote: this.props.vote
        };

        this.postVote = this.postVote.bind(this);
        this._createVoteFromForm = this._createVoteFromForm.bind(this); 
    }

    componentWillMount() {
        // TODO: invoke web request (if necessary) to retrieve the details for the selected vote id.
    }

    _createVoteFromForm() {
        const form = null;
        return {

        };
    }

    postVote() {
        const self = this;
        self.setState({loading: true});
        // TODO: grab fields from form and post to server.
        const form = null;
        const vote = self._createVoteFromForm(form)

        api.postVote(vote).then((res) => {
            self.setState({loading: false, error: null});
            console.log('postVote: ' + res);
            // TODO: alert user that vote created and close the modal.

        }).catch((err) => {
            self.setState({loading: false, error: err});
        });
    }

    
    render() {
        const self = this;
        const vote = self.props.vote;

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
                        <Modal.Title className="centered">Vote on {vote.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <hr />
                        {/* Overflowing text vertically will automatically scroll */}
                        <div className="centered">
                            <img src={vocal} className="centered login-image"/>
                            <p>{JSON.stringify(vote)}</p>
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