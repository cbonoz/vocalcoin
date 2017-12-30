import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import HelpSteps from './../HelpSteps';
import api from './../../utils/api';
import helper from './../../utils/helper';

export default class Help extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: "Loading...",
            loading: false
        }

        this.getAddress = this.getAddress.bind(this);
    }

    getAddress() {
        const self = this;
        const currentUser = self.props.currentUser;
        const userId = currentUser.uid;
        self.setState( {loading: true, err: null})

        api.getAddress(userId).then((data) => {
            console.log(JSON.stringify(data));
            self.setState({ loading: false, address: data });
        }).catch((err) => {
            self.setState({ loading: false, err: err})
        });
    }
    
    componentWillMount() {
        this.getAddress();
    }
    
    render() {
        const self = this;
        const address = self.state.address;
        return (
            <div>
                <div>
                    <ListGroup>
                        <ListGroupItem header={"Update Address"}/>

                        <ListGroupItem>
                            <h3>Your Address:</h3><br/>
                            <b>{address}</b>
                            {self.state.err && <p className="centered error-text">{helper.processError(self.state.err)}</p>}
                        </ListGroupItem>

                    </ListGroup>

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
