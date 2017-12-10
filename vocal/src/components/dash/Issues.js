import React, { Component } from 'react'
import api from '../../utils/api';

export default class Issues extends Component {

    constructor(props) {
        super(props);
        this.state = {
            issues: [],
            loading: false,
            currentUser: this.props.currentUser
        }
    }
    
    componentWillMount() {
        const self = this;
        self.setState( {loading: true});
        const user = this.state.currentUser;
        api.getIssuesForUser(user).then((data => {
            const yourIssues = data.data;
            self.setState( {loading: true, issues: yourIssues} );
        }));
    }
    
    render() {
        return (
            <div>
                {/* TODO: allow the user to manage and view his or her created issues from this page */}
                
            </div>
        )
    }
}
