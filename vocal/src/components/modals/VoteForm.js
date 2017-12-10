import React, { Component } from 'react'
import { Button, Checkbox, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

export default class VoteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeatPassword: '',
      error: '',
      isRegister: false,
      voteButtonStyle: "success",
      voteButtonText: "Sign In"
    };

    this.handleVote = this.handleVote.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  handleCheckboxChange(event) {
    const isRegister = event.target.checked;
    console.log("checkbox changed!", isRegister);
    const newVoteText = isRegister ? "Register" : "Sign In";
    const newVoteStyle = isRegister ? "danger" : "success";
    this.setState({ isRegister: isRegister, voteButtonText: newVoteText, voteButtonStyle: newVoteStyle });

  }

  clearError() {
    this.setState({ error: '' });
  }

  handleVote(event) {
    // Submit the vote for the issue to the server (with lat/lng and timestamp)
  }

  render() {
    const self = this;
    return (
      <div className="vote-form">
        <Row>
          <Form>
            {self.state.error &&
              <p className="error-text centered red italics medium">{self.state.error}</p>}
          </Form>
        </Row>
      </div>
    );
  }
}
