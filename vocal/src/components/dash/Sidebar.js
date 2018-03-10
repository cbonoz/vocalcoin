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
        const balance = self.props.balance;

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

                <div className="your-balance">Vocal Account Balance:<br/> <span className="emph">{balance && parseFloat(balance).toFixed(8)}</span></div>
               
            </div>
        )
    }
}
