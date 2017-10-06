import React, { Component } from 'react'
import {Button, Nav, Navbar, NavItem} from 'react-bootstrap';

import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'
export default class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: "Vocal"
        }
    }
    
    render() {
        return (
            <div>
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">{this.props.title}</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="#">TEAM</NavItem>
                        <NavItem eventKey={2} href="#">FAQ</NavItem>
                        <NavItem eventKey={2} href="#">ICO</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">WHITEPAPER</NavItem>
                        <NavItem eventKey={2} href="#">BUY TOKENS</NavItem>
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}
