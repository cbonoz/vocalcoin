import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap';
import LoginForm from './LoginForm';

import vocal from '../../assets/vocal_title.png';
import vocalWebp from '../../optimized_media/vocal_title.webp';

export default class LoginModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            previewBuild: false // Controls whether the login form is visible/accessible (or 'Coming Soon' messaged instead).
        };
        // console.log('preview', this.state.previewBuild);
    }

    render() {
        const self = this;
        const previewBuild = self.state.previewBuild;
        return (
            <div>
                <Modal show={this.props.showModal} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title className="centered">Log into Vocal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="centered">
                            {/*<img src={vocal} webp={vocalWebp} className="centered login-image"/>*/}
                            <img webp={vocalWebp} className="centered login-image"/>
                            {previewBuild && <p className="preview-text">Coming Soon</p>}
                            {!previewBuild && <LoginForm onLogin={this.props.close}/>}
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