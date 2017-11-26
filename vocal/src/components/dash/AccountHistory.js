import React, { Component } from 'react'
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';

import api from './../../utils/api';

import "./../../node_modules/react-vis/dist/style";

export default class AccountHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionData: [
                { x: 1, y: 10 },
                { x: 2, y: 5 },
                { x: 3, y: 15 }
            ],
            loading: false,
            error: null
        };

        this._getTransactionData = this._getTransactionData.bind(this);
        
    }

    _getTransactionData() {
        const self = this;
        self.setState( {loading: true, error: null} );
        const user = self.props.currentUser;

        // TODO: handle error case
        api.getTransactionHistory(user);
        // .then((res) => {
        //     console.log('getTransactionHistory res: ' + JSON.stringify(res));
        //     self.setState( {transactionData: data, loading: false} );
        // }).catch((err) => {
        //     self.setState( {transactionData: [], loading: false, error: err})
        // });
    }
    
    componentWillMount() {
        this._getTransactionData(this.props.currentUser);
    }
    
    render() {
        const self = this;
        return (
            <div>
                {!(self.state.loading && self.state.error) && <XYPlot
                    width={300}
                    height={300}>
                    <HorizontalGridLines />
                    <LineSeries
                        data={self.state.transactionData} />
                    <XAxis />
                    <YAxis />
                </XYPlot>}
                {self.state.loading && <div className="loading-spinner"></div>}
                {(!self.state.loading && self.state.error) &&
                     <div className="history-error error-text red">
                        {self.state.error}
                    </div>
                }
            </div>
        )
    }
}
