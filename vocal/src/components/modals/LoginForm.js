import React, {Component} from 'react'
import {
    Button,
    Checkbox,
    Form,
    Popover,
    OverlayTrigger,
    FormGroup,
    FormControl,
    ControlLabel,
    Col,
    Row
} from 'react-bootstrap';
import {createUser, signInUser} from './../../utils/fire';
import helper from './../../utils/helper';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            repeatPassword: '',
            error: '',
            loading: false,
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
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleRepeatPasswordChange(event) {
        this.setState({repeatPassword: event.target.value});
    }

    handleCheckboxChange(event) {
        const isRegister = event.target.checked;
        // console.log("checkbox changed!", isRegister);
        const newLoginText = isRegister ? "Register" : "Sign In";
        const newLoginStyle = isRegister ? "danger" : "success";
        this.setState({isRegister: isRegister, loginButtonText: newLoginText, loginButtonStyle: newLoginStyle});

    }

    clearError() {
        this.setState({error: ''});
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
            self.setState({error: "Passwords do not match."});
            return;
        }

        if (!password) {
            self.setState({error: "Password must not be empty"});
            return;
        }

        // console.log('handle register');

        self.setState({loading: true});

        createUser(email, password)
            .then(function (res) {
                // console.log('logged in');
                self.setState({loading: false});
                self.props.onLogin();
            })
            .catch(function (error) {
                self.setState({error: error, loading: false});
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.error('error creating new account', errorCode, errorMessage);
            });

        event.preventDefault();
    }

    handleSignIn(event) {
        const self = this;
        self.clearError();
        const email = self.state.email;
        const password = self.state.password;
        self.setState({loading: true});
        signInUser(email, password)
            .then(function (res) {
                self.setState({loading: false});
                self.props.onLogin();
            })
            .catch(function (error) {
                self.setState({error: error, loading: false});
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('error creating new account', errorCode, errorMessage);
            });
        event.preventDefault();
    }

    render() {
        const self = this;

        return (
            <div className="login-form">
                <Form>
                    <div className="login-form-field-name">Email:</div>
                    <FormGroup className="login-form-group">
                        <FormControl placeholder="email" type="text" value={self.state.email}
                                     onChange={self.handleEmailChange}/>
                    </FormGroup>
                    <div className="login-form-field-name">Password:</div>
                    <FormGroup className="login-form-group">
                        <FormControl placeholder="password" type="password" value={self.state.password}
                                     onChange={self.handlePasswordChange}/>
                    </FormGroup>

                    {self.state.isRegister && <div className="register-form">
                        <div className="repeat-password">
                            <div className="login-form-field-name">Repeat Password:</div>
                            <FormGroup className="login-form-group">
                                <FormControl placeholder="password" type="password" value={self.state.repeatPassword}
                                             onChange={self.handleRepeatPasswordChange}/>
                            </FormGroup>
                        </div>
                        <hr/>

                    </div>}

                    <FormGroup className="login-form-group">
                        <Button bsSize="large" bsStyle={self.state.loginButtonStyle} className="login-button"
                                onClick={self.handleLogin}>{self.state.loginButtonText}</Button>
                        <Checkbox onChange={self.handleCheckboxChange}
                                  checked={self.state.isRegister}>Register</Checkbox>
                    </FormGroup>

                    {self.state.error &&
                    <p className="error-text centered red italics medium">{helper.processError(self.state.error)}</p>}
                </Form>
            </div>
        );
    }
}
