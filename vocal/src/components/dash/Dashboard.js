import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';
import Issues from './Issues';
import Help from './Help';
import Sidebar from './Sidebar';

import { firebaseAuth } from '../../utils/fire';
import api from '../../utils/api';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: "Loading...",
            currentUser: null,
            currentPage: 0,
            loading: false,
            err: null,
            issues: [],
            balance: 'Loading...'
        };

        this._renderCurrentPage = this._renderCurrentPage.bind(this);
        this.updateIssues = this.updateIssues.bind(this);
        this._updateBalance = this._updateBalance.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.updateCurrentPage = this.updateCurrentPage.bind(this);
    }

    componentDidMount() {
        const self = this;
        self.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            self.setState({ currentUser: user });
            self.updateIssues();
            self.getAddress();
        })
    }
    
    componentWillUnmount() {
        this.removeListener();
    }

    updateIssues() {
        const self = this;
        if (!self.state.loading) {
            self.setState({ loading: true, err: null });
            const userId = self.state.currentUser.uid;
            api.getIssuesForUserId(userId).then((data) => {
                const yourIssues = data;
                self.setState({ loading: true, issues: yourIssues });
            }).catch((err) => {
                self.setState( {issues: [], loading: false, err: err});
            });
        }
    }

    updateCurrentPage(currentPage) {
        this.setState({ currentPage: currentPage });
    }

    getAddress() {
        const self = this;
        const currentUser = self.state.currentUser;

        // If I haven't retrieved the user yet, cancel.
        if (!currentUser) {
            return;
        }

        const userId = currentUser.uid;
        self.setState( {loading: true, err: null})

        api.getAddress(userId).then((data) => {
            console.log(JSON.stringify(data));
            self.setState({ loading: false, address: data });
            self._updateBalance();
        }).catch((err) => {
            self.setState({ loading: false, err: err})
        });
    }

    _updateBalance() {
        const self = this;
        const currentUser = self.state.currentUser;
          const userId = currentUser.uid;
        api.getBalance(userId).then((res) => {
            self.setState({ balance: res + " vocal" });
            console.log('getBalance: ' + res);
        }).catch((err) => {
            console.error('getBalance error', JSON.stringify(err));
            self.setState({ balance: "Temporary error retrieving balance" });
        });
    }

    _renderCurrentPage() {
        const self = this;
        switch (self.state.currentPage) {
            case 1:
                return <Help currentUser={self.state.currentUser} />
            default: // includes 0.
                return <Issues loading={self.state.loading} updateIssues={() => self.updateIssues} issues={self.state.issues} currentUser={self.state.currentUser} balance={self.state.balance} />
        }
    }

    render() {
        const self = this;
        const currentUser = self.state.currentUser;

        return (
            <div>
                <div className='dashboard-container'>
                    <Row>
                        <Col xs={12} md={3}>
                            <Sidebar address={self.state.address} balance={self.state.balance} currentPage={this.state.currentPage} updateCurrentPage={this.updateCurrentPage} />
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
