import React, { Component } from 'react'
import { Jumbotron, Button, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactRotatingText from 'react-rotating-text';
import HeaderBox from './data/HeaderBox';
import SocketFeed from './SocketFeed';
// import YouTube from 'react-youtube';

import HelpSteps from './HelpSteps';

import vocal from '../assets/vocal_trans_black.png';
import webpVocal from '../optimized_media/vocal_trans_black.webp';

import bgImage from '../assets/banner_10.png';
import webpBgImage from '../optimized_media/banner_10.webp';

import Image from 'react-image-webp';

import { firebaseAuth } from '../utils/fire';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'The Future is Vocal' ,
            // slogan: 'Vocal is a currency platform that puts the advertising experience back in the hands of users.',
            // slogan: 'Vocal is a currency platform for promoting civic engagement',
            slogan: "Vocal is a cryptocurrency platform for promoting social change and civic engagement.",
            words: ['building', 'sharing', 'discovering'],
            blocks: [],
            authed: this.props.authed
        }
        this._onVideoReady = this._onVideoReady.bind(this);
    }

    _onVideoReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    render() {
        const self = this;
        const videoOpts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };

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
                                    <Image className="home-banner-image" webp={webpVocal} />
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
                                                <Button bsStyle="primary" className="start-button" onClick={() => { window.location = "/faq"}}>
                                                    See our FAQ
                                                    {/* &nbsp;<i className="centered clear fa fa-refresh fa-spin" aria-hidden="true"></i> */}
                                                </Button>
                                                {/* <Link to="/faq">
                                                    <p className="home-learn-more medium facebook-blue"><b>See our FAQ</b></p>
                                                </Link> */}
                                            </div>
                                        </span>
                                    </div>

                                </div>
                            </Col>
                            {/* <Col xs={12} md={3} className="home-right-col">
                                <ListGroup>
                                    <HeaderBox header={"What's Happening"}>
                                        <SocketFeed />
                                    </HeaderBox>
                                </ListGroup>
                            </Col>
                            <Col xsHidden md={1} /> */}
                        </Jumbotron>
                    </Row>
                </div>
                <Row>
                    <Col xs={12} md={12}>
                        {/* <div className="home-video-section centered">
                            <h1 className='facebook-blue centered home-video-heading'>How it Works</h1>
                            <YouTube
                                videoId="-_xxKBeUTdg"
                                opts={videoOpts}
                                onVideoReady={this._onVideoReady}
                            />
                        </div> */}
                    </Col>
                </Row>
                <HelpSteps maxSize={12} />
            </div>
        )
    }
}
