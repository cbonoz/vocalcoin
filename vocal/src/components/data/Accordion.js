import React, { Component } from 'react'
import {  Well, Collapse, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

export default class Accordion extends Component {

  constructor(...args) {
    super(...args);
    this.state = { open: false };
  }

  render() {
    return (
      <div>
        <ListGroup>
          <ListGroupItem
            onClick={() => this.setState({ open: !this.state.open })}
            header={this.props.question} bsStyle="info">
          </ListGroupItem>
          <Collapse in={this.state.open}>
            <Well>
              <ListGroupItem>
                {this.props.children}
              </ListGroupItem>
            </Well>
          </Collapse>
        </ListGroup>
      </div>
    );
  }
}
