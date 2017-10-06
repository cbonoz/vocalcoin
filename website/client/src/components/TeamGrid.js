import React, { Component } from 'react'
import {Row, Col, Image} from 'react-bootstrap';

export default class TeamGrid extends Component {
    render() {
        return (
            <div>
                <h1>Team</h1>
                        <Image src="../assets/home_token.png" rounded />
                <Row>
                    <Col xs={6} md={4}>
                        <Image src="../assets/home_token.png" rounded />
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src="../assets/thumbnail.png" rounded />
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src="../assets/thumbnail.png" rounded />
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={4}>
                        <Image src="../assets/thumbnail.png" rounded />
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src="../assets/thumbnail.png" rounded />
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src="../assets/thumbnail.png" rounded />
                    </Col>
                </Row>
                
            </div>
        )
    }
}
