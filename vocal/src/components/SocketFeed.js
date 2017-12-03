import React, { Component } from 'react'
import DataFeed from './data/DataFeed';
import helper from '../utils/helper';
import { socket, getSocketEvents, MAX_BLOCKS } from '../utils/api';

export default class SocketFeed extends Component {

    constructor(props) {
        super(props)
        this.state = {
            blocks: []
        }

        this._addEvent = this._addEvent.bind(this);
        this._setUpSocket = this._setUpSocket.bind(this);
    }

    componentWillUnmount() {
        socket.close();
    }
 
    componentWillMount() {
        const self = this;
        self._setUpSocket();
        getSocketEvents().then((res) => {
            const blocks = self.state.blocks;
            if (blocks.length <= MAX_BLOCKS && res instanceof Array && res.length > 0) {
                const count = Math.max(0, res.length - blocks.length)
                const neededBlocks =  res.slice(0, count);
                self.setState( {blocks: neededBlocks.concat(blocks)} );
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    
    _addEvent(event) {
        event['time'] = helper.formatDateTimeMs(event['time']);
        var newList = [event, ...this.state.blocks];
        if (newList.length > MAX_BLOCKS) {
            newList = newList.splice(-1, 1); // remove last element
        }
        this.setState({ blocks: newList });
    }

    _setUpSocket() {
        const self = this;
        socket.on('connect', function () {
        });
        socket.on('incoming', function (data) {
            self._addEvent(data);
        });
        socket.on('disconnect', function () {
        });
        socket.open();
    }
 
    render() {
        return (
            <div>
                <DataFeed blocks={this.state.blocks} />
            </div>
        )
    }
}
