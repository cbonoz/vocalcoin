import React, { Component } from 'react'

import api from './../../utils/api';

export default class UpdateAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            error: null,
            loading: false
        };

        this._getAddress = this._getAddress.bind(this);
    }
    
    componentWillMount() {
        this._getAddress();
    }

    _getAddress() {
        const self = this;
        const user = self.props.currentUser;
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
