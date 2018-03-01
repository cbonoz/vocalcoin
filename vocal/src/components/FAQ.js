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
                // answer: "Vocal is a currency platform that puts the advertising experience back in the hands of users by rewarding them for engaging with advertisers."
                answer: "Vocal is a cryptocurrency platform designed to reward and promote civic engagement in voting for government initiatives",
            },
            {
                question: "How does Vocal work?",
                // answer: "Vocal credits a market rate amount of coin for each ad you watch. This amount is dynamic and will gradually decrease with time as more users join the platform. The best time to start earning is now."
                answer: "Vocal credits a variable* amount of coin for each vote that you submit to existing issues. This amount is dynamic and will gradually decrease as more users get involved. This coin can later be redeemed to create and promote new and existing issues on the platform.",
            },
            {
                question: "How long has Vocal been around?",
                answer: "Vocal was launched in Winter 2017."
            },
            {
                question: "Do I need an account to participate?",
                answer: "Yes. This account will be used to track the amount of token you have, as well as enable tracking of each user contextually in terms of whether a particular vote has already submitted or not by a certain user."
            },
            {
                question: "Explain the cryptocurrency component of Vocal",
                answer: "Each vote and issue that is created is recorded as a transaction on an immutable and hidden blockchain. This blockchain is immutable and will later serve as an auditable history of user activity on the platform. This data is stored on the Stellar blockchain."
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
                {!self.state.currentUser && <p className="centered faq-bottom-text large">Ready? Click login in the Header bar to begin.</p>}

                <div className='faq-whitepaper centered'><a href="/whitepaper">Or View the Whitepaper</a></div>
            </div>
        )
    }
}
