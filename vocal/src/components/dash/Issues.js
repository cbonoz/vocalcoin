import React, { Component } from 'react'
import Issue from './Issue';
import api from '../../utils/api';

export default class Issues extends Component {

    constructor(props) {
        super(props);
        this.state = {
            issues: [],
            loading: false,
            err: null,
            currentUser: this.props.currentUser
        }
    }

    componentWillMount() {
        const self = this;
        if (!self.state.loading) {
            self.setState({ loading: true, err: null });
            const userId = this.state.currentUser.uid;
            api.getIssuesForUserId(userId).then((data) => {
                const yourIssues = data.data;
                self.setState({ loading: true, issues: yourIssues });
            }).catch((err) => {
                self.setState( {loading: false, err: err});
            });
        }
    }

    render() {
        const self = this;
        const issues = self.state.issues;

        return (
            <div>
                <div className="your-balance">Your Balance: <b>{self.props.balance}</b> vocal</div>
                {self.state.err && <div className="error-text">
                    {JSON.stringify(self.state.err)}
                </div>}
                {issues.map((issue) => {
                    return <Issue issue={issue} />
                })}
            </div>
        )
    }
}
