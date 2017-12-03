import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export default class HeaderBox extends Component {
    render() {
        return (
            <div>
                <ListGroup>
                    <ListGroupItem className="centered" bsStyle="info"><span className="centered">{this.props.header}</span></ListGroupItem>
                    <ListGroupItem>
                        {this.props.children}
                    </ListGroupItem>
                </ListGroup>
            </div>
        )
    }
}
