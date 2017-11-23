import React, { Component } from 'react'
import Accordion from './data/Accordion';
import { firebaseAuth } from './../utils/fire';

export default class FAQ extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null
        };
        this.questions = [
            {
                question: "What is Vocal?",
                answer: "Vocal is a currency platform that puts the advertising experience back in the hands of users by rewarding them for engaging with advertisers."
            },
            {
                question: "How does Vocal work?",
                answer: "Vocal credits a market rate amount of coin for each ad you watch. This amount is dynamic and will gradually decrease with time as more users join the platform. The best time to start earning is now."
            },
            {
                question: "How long has Vocal been around?",
                answer: "Vocal was launched in Winter 2017."
            },
            {
                question: "Do I need an account?",
                answer: "Yes"
            },
        ]
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

    render() {
        const self = this;
        return (
            <div className="container full-height">
                <h1 className="centered black page-header">FAQ</h1>
                {self.questions.map((entry, index) => {
                    return (<Accordion key={index} question={entry.question}>
                        <p className="large faq-box">{entry.answer}</p>
                    </Accordion>);
                })}
                {}
                {!self.state.currentUser && <p className="centered faq-bottom-text large">Ready? Click login in the Header bar to begin.</p>}
            </div>
        )
    }
}
