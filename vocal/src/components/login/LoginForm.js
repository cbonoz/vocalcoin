import React, { Component } from 'react'
import { Button, Checkbox, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { createUser, signInUser } from './../../utils/fire';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeatPassword: '',
      error: '',
      isRegister: false,
      loginButtonStyle: "success",
      loginButtonText: "Sign In"
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleRepeatPasswordChange(event) {
    this.setState({ repeatPassword: event.target.value });
  }

  handleCheckboxChange(event) {
    const isRegister = event.target.checked;
    console.log("checkbox changed!", isRegister);
    const newLoginText = isRegister ? "Register" : "Sign In";
    const newLoginStyle = isRegister ? "danger" : "success";
    this.setState({ isRegister: isRegister, loginButtonText: newLoginText, loginButtonStyle: newLoginStyle });

  }

  clearError() {
    this.setState({ error: '' });
  }

  handleLogin(event) {
    if (this.state.isRegister) {
      this.handleRegister(event);
    } else {
      this.handleSignIn(event);
    }
  }

  handleRegister(event) {
    const self = this;
    self.clearError();
    const email = self.state.email;
    const password = self.state.password;
    const repeatPassword = self.state.repeatPassword;
    if (password !== repeatPassword) {
      self.setState({ error: "Passwords do not match." });
      return;
    }

    createUser(email, password)
      .then(function (res) {
        self.props.onLogin();
      })
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
      .then(function (res) {
        self.props.onLogin();
      })
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
          <Form>
            <FormGroup className="login-form-group">
            <Row>
              <Col componentClass={ControlLabel} sm={1} md={2}>
                Email:
              </Col>
              <Col sm={10} md={8}>
                <FormControl placeholder="email" type="text" value={self.state.email} onChange={self.handleEmailChange} />
              </Col>
              <Col sm={1} md={2} />
              </Row>
            </FormGroup>
            <FormGroup className="login-form-group">
              <Col xsHidden md={1} />
              <Col componentClass={ControlLabel} sm={2} md={2}>
                Password:
          </Col>
              <Col sm={10} md={8}>
                <FormControl placeholder="password" type="password" value={self.state.password} onChange={self.handlePasswordChange} />
              </Col>
              <Col xsHidden md={1} />
            </FormGroup>
            {/* {!self.state.isRegister && <div className="login-form-group"></div>} */}
            {self.state.isRegister && <div className="repeat-password">
              <FormGroup className="login-form-group">
                <Col xsHidden md={1} />
                <Col componentClass={ControlLabel} sm={2} md={2}>
                  Repeat Password:
            </Col>
                <Col sm={10} md={8}>
                  <FormControl placeholder="password" type="password" value={self.state.repeatPassword} onChange={self.handleRepeatPasswordChange} />
                </Col>
                <Col xsHidden md={1} />
              </FormGroup>
            </div>}
            <FormGroup className="login-form-group">
              <Button bsSize="large" bsStyle={self.state.loginButtonStyle} className="login-button" onClick={self.handleLogin}>{self.state.loginButtonText}</Button>
              <Checkbox onChange={self.handleCheckboxChange} checked={self.state.isRegister}>Register</Checkbox>
              {/* <Button bsSize="large" bsStyle="danger" className="login-button" onClick={self.handleRegister}>Register</Button> */}
            </FormGroup>
            {self.state.error &&
              <p className="error-text centered red italics medium">{self.state.error}</p>}
          </Form>
      </div>
    );
  }
}
