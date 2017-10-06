import React, { Component } from 'react'
import {Doughnut} from 'react-chartjs-2';

export default class Distribution extends Component {

    constructor(props) {
        super(props)
        const data = {
            labels: [
                'Initial Token Offering',
                'Founding Team',
                'Reserved'
            ],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ]
            }]
        };

        this.state = {
            data: data
        };
    }
    
    
    componentWillMount() {
        
    }
    
    render() {
        return (
            <div>
                <h2>Initial Coin Distribution</h2>
               <Doughnut data={this.state.data} /> 
            </div>
        )
    }
}
