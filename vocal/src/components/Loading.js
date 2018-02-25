import React, { Component } from 'react'
import vocalSquare from '../assets/vocal_square_trans.png';

export default class Loading extends Component {

    render() {
        return (
            <div className="center-middle animated fadeIn">
                <img src={vocalSquare}/>
                <div className="loading-text">Loading...</div>
            </div>
        )
    }
}
