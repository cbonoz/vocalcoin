import React, { Component } from 'react'
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import vocal from '../assets/vocal_trans_black.png';
import LoginModal from './modals/LoginModal';
import { firebaseAuth } from '../utils/fire';
import firebase from 'firebase';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
        this._logout = this._logout.bind(this);
        this._login = this._login.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({ showModal: false });
        window.location = "/dashboard";
    }

    open() {
        this.setState({ showModal: true });
    }

    _login() {
        this.open();
    }

    _logout() {
        firebaseAuth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    }

    render() {
        const self = this;
        const authed = self.props.authed;
        const currentUser = firebase.auth().currentUser;
        return (
            <div className="border-bottom-blue">
                {/* <Navbar inverse collapseOnSelect> */}
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <LinkContainer to="/">
                                <img className="header-image" src={vocal} />
                                {/* <a className="white">vocal</a> */}
                            </LinkContainer>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        {authed && <LinkContainer to='/dashboard'>
                            <img className="header-image" src={currentUser.photoURL} />
                        </LinkContainer>}
                        <Nav pullRight>
                            {!authed && <LinkContainer to="/faq"><NavItem>What is Vocal - FAQ</NavItem></LinkContainer>}
                            {authed && <LinkContainer to="/dashboard"><NavItem>Your Account</NavItem></LinkContainer>}
                            {authed && <LinkContainer to="/map"><NavItem>Explore Issues</NavItem></LinkContainer>}
                            {!authed && <LinkContainer to="/whitepaper"><NavItem>View Whitepaper</NavItem></LinkContainer>}
                            {authed && <NavItem onClick={() => self._logout()}>Logout</NavItem>}
                            {!authed && <NavItem onClick={() => self._login()}>
                                Login&nbsp;&nbsp;<i className="centered clear fa fa-paper-plane facebook-blue" aria-hidden="true"></i>
                            </NavItem>}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <LoginModal showModal={this.state.showModal} close={self.close.bind(self)} />
            </div>
        )
    }
}