import React, { Component } from 'react'
import { Row, Col, Grid } from 'react-bootstrap';
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
                                <i className="centered clear fa fa-5x fa-user-circle-o help-icon" aria-hidden="true"></i>
                                <div className="home-box">
                                    <span className="emph">Create</span> a Vocal account to search and participate in global petitions and <b>issues</b>.
                                </div>
                            </HeaderBox>
                        </Col>

                        {/* Hidden middle remainder space */}
                        <Col mdHidden xs={half % 2}></Col>

                        <Col xs={half} md={third}>
                            <div className="home-box-number">2.</div>
                            <HeaderBox header={"Label"}>
                                <i className="centered clear fa fa-5x fa-tag help-icon" aria-hidden="true"></i>
                                <div className="centered home-box">
                                    <span className="emph">Explore</span> existing issues by going to the map view and navigating to your local community,
                                    or any community around the <b>world</b>.
                                </div>
                            </HeaderBox>
                        </Col>
                        <Col xs={half * 2} md={third}>
                            <div className="home-box-number">3.</div>
                            <HeaderBox header={"Discover and Build"}>
                                <i className="centered clear fa fa-5x fa-database help-icon" aria-hidden="true"></i>
                                <div className="centered home-box">
                                    <span className="emph">Vote</span> on issues that affect both you <i>personally</i>, and people at large, using a map-based interface.
                                    Track your contributions and redeem them for issue promotion as you earn <b>Vocal Currency</b>.
                                </div>
                            </HeaderBox>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={half * 2} md={this.props.maxSize}>
                            <p className="centered home-bottom-text neo-logo-text">That's it. You can now search, create, and contribute to issues&nbsp;<br/>happening around the world.</p>
                        </Col>
                    </Row>
                </Grid>

            </div>
        )
    }
}
