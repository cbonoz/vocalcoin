import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import HelpSteps from './../HelpSteps';

export default class Help extends Component {
    render() {
        return (
            <div>
                <div>
                    <ListGroup>
                        <ListGroupItem header={"Getting Started"} bsStyle="info"/>
                        <ListGroupItem className="dark-background">
                            <HelpSteps maxSize={9} />
                        </ListGroupItem>
                    </ListGroup>
                </div>
            </div>
        )
    }
}
