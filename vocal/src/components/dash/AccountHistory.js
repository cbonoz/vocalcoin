import React, { Component } from 'react'
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';

import api from './../../utils/api';
import helper from './../../utils/helper';
import { firebaseAuth } from '../../utils/fire';

export default class AccountHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionData: [
                { x: 1, y: 10 },
                { x: 2, y: 5 },
                { x: 3, y: 15 }
            ],
            currentUser: null,
            loading: false,
            error: null
        };

        this._getTransactionData = this._getTransactionData.bind(this);
    }

    componentWillMount() {
        const self = this;
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            self.setState({ currentUser: user });
            self._getTransactionData();
        })
    }

    componentWillUnmount() {
        this.removeListener();
    }

    _getTransactionData() {
        const self = this;
        self.setState({ loading: true, error: null });
        const user = self.state.currentUser;

        // TODO: handle error case
        api.getTransactionHistory(user);
        // .then((res) => {
        //     console.log('getTransactionHistory res: ' + JSON.stringify(res));
        //     self.setState( {transactionData: data, loading: false} );
        // }).catch((err) => {
        //     self.setState( {transactionData: [], loading: false, error: err})
        // });
    }

    render() {
        const self = this;
        return (
            <div className="centered">
                {!(self.state.loading && self.state.error) && <div className="centered">
                    <XYPlot
                    width={400}
                    height={400}
                    >
                        <HorizontalGridLines />
                        <LineSeries
                            data={self.state.transactionData} />
                        <XAxis />
                        <YAxis />
                    </XYPlot>
                </div>}
                {self.state.loading && <div className="loading-spinner"></div>}
                {(!self.state.loading && self.state.error) &&
                    <div className="history-error error-text red">
                        {helper.processError(self.state.error)}
                    </div>
                }
            </div>
        )
    }
}
