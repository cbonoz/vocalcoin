import React, { Component } from 'react'
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import LoginForm from './LoginForm';

import vocal from '../../assets/vocal_square_trans.png';

export default class LoginModal extends Component {

    constructor(props) {
        super(props)
    }

    render() {
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
                            <LoginForm onLogin={this.props.close}/>
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