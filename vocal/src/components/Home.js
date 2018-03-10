import React, {Component} from 'react'
import {Jumbotron, Button, Row, Col} from 'react-bootstrap';
// import ReactRotatingText from 'react-rotating-text';

import HelpSteps from './HelpSteps';

import webpVocal from '../optimized_media/vocal_trans_black.webp';
import webpBgImage from '../optimized_media/banner_10.webp';
import neoLogo from '../assets/neo_trans.png';

import Image from 'react-image-webp';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'The Future is Vocal',
            slogan: "Vocal is a cryptocurrency platform promoting social change and civic engagement.",
            words: ['building', 'sharing', 'discovering'],
            blocks: [],
            authed: this.props.authed
        }
    }

    render() {
        const self = this;

        const backgroundStyle = {
            backgroundImage: `url(${webpBgImage})`,
        };

        return (
            <div className="home-background">
                <div className="home-content">
                    <Row>
                        <Jumbotron className="jumbotron transparency-jumbotron" style={backgroundStyle}>
                            <Col xs={12} md={12}>
                                <div className="static-modal-jumbotron opaque centered">
                                    {/*<img className="home-banner-image" src={vocal} />*/}
                                    <Image className="home-banner-image" webp={webpVocal}/>
                                    <h2 className="bold title-text animated fadeIn">
                                        {self.state.title}
                                    </h2>
                                    <p className="bold slogan-text animated fadeIn">
                                        {self.state.slogan}
                                    </p>
                                    <div className="header-text-section">
                                        <span className="header-text">
                                            <div className="centered">
                                                <p className="centered large bold">What are you waiting for?<br /></p>
                                                <Button bsStyle="primary" className="start-button" onClick={() => {
                                                    window.location = "/faq"
                                                }}>
                                                    See our FAQ
                                                    {/* &nbsp;<i className="centered clear fa fa-refresh fa-spin" aria-hidden="true"></i> */}
                                                </Button>
                                            </div>
                                        </span>
                                    </div>

                                </div>
                            </Col>
                        </Jumbotron>
                    </Row>
                </div>
                <Row>
                    <Col xs={12} md={12}>
                        <h1 className="centered neo-logo-text">Built on the NEO Blockchain</h1>
                        <img src={neoLogo} alt="Neo" className="centered neo-logo"/>

                        <h3 className="centered neo-logo-text">Vocal Coin is a NEP-5 (Neo-based) Cryptocurrency <br/>Earn
                            Vocal by voting and participating in active issues</h3>
                        <h4 className="centered neo-logo-text">All you need is an email and password to get started</h4>

                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                    </Col>
                </Row>
                <HelpSteps maxSize={12}/>
            </div>
        )
    }
}
