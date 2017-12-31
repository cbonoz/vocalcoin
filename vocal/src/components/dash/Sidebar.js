import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import api from '../../utils/api';

export default class Sidebar extends Component {

    constructor(props) {
        super(props);
    }

    _activePage(page) {
        return this.props.currentPage === page;
    }

    render() {
        const self = this;
        const pageList = [
            // 'Account History',
            'Your Issues',
            'Help'
        ];

        return (
            <div className="sidebar-container">
                <ListGroup>
                    <ListGroupItem className={"sidebar-item"} header={"Vocal Control Panel"} bsStyle="info">
                    </ListGroupItem>
                    {pageList.map((pageTitle, index) => {
                        return (<ListGroupItem key={index} className={"sidebar-item " + (self._activePage(index) ? 'selected-item' : '')} onClick={() => this.props.updateCurrentPage(index)}>
                            {pageTitle}
                        </ListGroupItem>)
                    })}
                </ListGroup>

                <div className="your-balance">Account Balance:<br/> <span className="emph">{self.props.balance}</span></div>
                <div className="your-balance">Account Address:<br/> <span className="emph">{self.props.address}</span></div>
            </div>
        )
    }
}
