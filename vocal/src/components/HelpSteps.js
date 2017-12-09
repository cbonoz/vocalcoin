import React, { Component } from 'react'
import {  Button, Row, Col, Grid } from 'react-bootstrap';
import HeaderBox from './data/HeaderBox';

export default class HelpSteps extends Component {
    render() {

        const third = this.props.maxSize / 3;
        const half = this.props.maxSize / 2;

        return (
            <div>

                <Grid className="home-box-grid">
                    <Row className="show-grid">
                        <Col xs={half} md={third}>
                            <div className="home-box-number">1.</div>
                            <HeaderBox header={"Register"}>
                                <div className="centered home-box">
                                To participate and create new petitions/issues, create a new Vocal account.
                                    <i className="centered clear fa fa-4x fa-login help-icon" aria-hidden="true"></i>
                            </div>
                            </HeaderBox>
                        </Col>

                        {/* Hidden middle remainder space */}
                        <Col mdHidden xs={half % 2}></Col>

                        <Col xs={half} md={third}>
                            <div className="home-box-number">2.</div>
                            <HeaderBox header={"Label"}>
                                <div className="centered home-box">
                                <b>Explore</b> existing issues by going to the map view and navigating to your local community, or any community around the world. 
                                    <i className="centered clear fa fa-4x fa-tag help-icon" aria-hidden="true"></i>
                            </div>
                            </HeaderBox>
                        </Col>
                        <Col xs={half*2} md={third}>
                            <div className="home-box-number">3.</div>
                            <HeaderBox header={"Discover and Build"}>
                                <div className="centered home-box">
                                Find issues that affect you <b>personally</b>, and others at large using an easy interface. 
                                Track your contributions and redeem for advertising/political promotion ability using <b>Vocal</b> coin.
                                    <i className="centered clear fa fa-4x fa-database help-icon" aria-hidden="true"></i>
                                </div>
                            </HeaderBox>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={half*2} md={this.props.maxSize}>
                            <p className="centered home-bottom-text bold">That's it. People from around the world can now search for, create and contribute to these issues and petitions.</p>
                        </Col>
                    </Row>
                </Grid>

            </div>
        )
    }
}
