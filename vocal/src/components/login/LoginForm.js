import React, { Component } from 'react'
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { createUser, signInUser } from './../../utils/fire';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  clearError() {
    this.setState({ error: '' });
  }

  handleRegister(event) {
    const self = this;
    self.clearError();
    const email = self.state.email;
    const password = self.state.password;
    createUser(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        self.setState({ error: error.message });
        console.error('error creating new account', errorCode, errorMessage);
        // ...
      });

    event.preventDefault();
  }

  handleSignIn(event) {
    const self = this;
    self.clearError();
    const email = self.state.email;
    const password = self.state.password;
    signInUser(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        self.setState({ error: error.message });
        console.error('error creating new account', errorCode, errorMessage);
        // ...
      });
    event.preventDefault();
  }

  render() {
    const self = this;
    return (
      <div className="login-form">
        <Row>
      <Form>
        <FormGroup className="login-form-group">
          <Col xsHidden md={1}/>
          <Col componentClass={ControlLabel} sm={2} md={2}>
            Email:
          </Col>
          <Col sm={10} md={8}>
            <FormControl placeholder="email" type="text" value={self.state.email} onChange={self.handleEmailChange} />
          </Col>
          <Col xsHidden md={1}/>
        </FormGroup>
        <FormGroup className="login-form-group">
          <Col xsHidden md={1}/>
          <Col componentClass={ControlLabel} sm={2} md={2}>
            Password:
          </Col>
          <Col sm={10} md={8}>
            <FormControl placeholder="password" type="password" value={self.state.password} onChange={self.handlePasswordChange} />
          </Col>
          <Col xsHidden md={1}/>
        </FormGroup>
        <FormGroup className="login-form-group">
          <Button bsSize="large" bsStyle="success" className="login-button" onClick={self.handleSignIn}>Sign In</Button>
          <Button bsSize="large" bsStyle="danger" className="login-button" onClick={self.handleRegister}>Register</Button>
        </FormGroup>
        {self.state.error &&
          <p className="error-text centered red italics medium">{self.state.error}</p>}
      </Form>
      </Row>
      </div>
    );
  }
}
