import React, { Component } from 'react'

import api from './../../utils/api';
import { firebaseAuth } from '../../utils/fire';

export default class UpdateAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            error: null,
            currentUser: null,
            loading: false
        };

        this._getAddress = this._getAddress.bind(this);
    }

    componentWillMount() {
        const self = this;
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            self.setState({ currentUser: user });
            self._getAddress();
        })
    }

    componentWillUnmount() {
        this.removeListener();
    }

    _getAddress() {
        const self = this;
        const user = self.state.currentUser;
        api.getAddress(user);
    }

    render() {
        const self = this;
        return (
            <div>
                {/* Input box for address */}

                Current Address: {self.state.lastAddress}
            </div>
        )
    }
}
