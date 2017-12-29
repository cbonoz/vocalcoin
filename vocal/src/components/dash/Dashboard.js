import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';
import Issues from './Issues';
import Help from './Help';
import AccountHistory from './AccountHistory';
import Sidebar from './Sidebar';

import { firebaseAuth } from '../../utils/fire';
import api from '../../utils/api';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentPage: 0,
            balance: 'Loading...'
        };

        this._renderCurrentPage = this._renderCurrentPage.bind(this);
        this._updateBalance = this._updateBalance.bind(this);
        this.updateCurrentPage = this.updateCurrentPage.bind(this);
    }

    componentDidMount() {
        const self = this;
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            self.setState({ currentUser: user });
        })
    }

    componentWillUnmount() {
        this.removeListener();
    }

    updateCurrentPage(currentPage) {
        this.setState({ currentPage: currentPage });
    }

    _updateBalance() {
        const self = this;
        const userId = self.state.currentUser.uid;
        api.getBalance(userId).then((res) => {
            self.setState({ balance: res });
            console.log('getBalance: ' + res);
        }).catch((err) => {
            console.error('getBalance error', JSON.stringify(err));
            self.setState({ balance: "Temporary error retrieving balance" });
        });
    }

    _renderCurrentPage() {
        const self = this;
        switch (self.state.currentPage) {
            // case 0:
            //     return <AccountHistory currentUser={self.state.currentUser} />
            case 0:
                self._updateBalance();
                return <Issues currentUser={self.state.currentUser} balance={self.state.balance} />
            case 1:
                return <Help currentUser={self.state.currentUser} />
            default: // 0
                return <AccountHistory currentUser={self.state.currentUser} />
        }
    }

    render() {
        const self = this;
        return (
            <div>
                <div className='dashboard-container'>
                    <Row>
                        <Col xs={12} md={3}>
                            <Sidebar currentPage={this.state.currentPage} updateCurrentPage={this.updateCurrentPage} />
                        </Col>
                        <Col xs={12} md={9}>
                            <div className="full-height">
                                {self._renderCurrentPage()}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
