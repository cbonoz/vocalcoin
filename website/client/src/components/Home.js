import React, { Component } from 'react'
import logo from './../assets/home_token_trans.png';

import TeamGrid from './TeamGrid';

export default class Home extends Component {
    render() {
        return (
            <div className="home-content">
                <h1>Home</h1>
                <img className='home-image-rotate' src={logo}/>

                <TeamGrid/>

            </div>
        )
    }
}
