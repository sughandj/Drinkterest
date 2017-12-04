import React, { Component } from 'react';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password1: "",
      password2: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render () {
    return (
      <div id="signup">
        <form id="signup-form">
          <fieldset>
            <legend>Sign Up</legend>
            <div className="form-group">
              <label htmlFor="SignUpInputUser">Username</label>
              <input
                name="username"
                onChange={this.handleInputChange}
                type="text"
                className="form-control"
                placeholder="Enter username"/>
            </div>
            <div className="form-group">
              <label htmlFor="SignUpInputPassword1">Password</label>
              <input
                name="password1"
                onChange={this.handleInputChange}
                type="password"
                className="form-control"
                placeholder="Enter password"/>
            </div>
            <div className="form-group">
              <label htmlFor="SignUpInputPassword2">Confirm password</label>
              <input
                name="password2"
                onChange={this.handleInputChange}
                type="password"
                className="form-control"
                placeholder="Enter password again"/>
            </div>
            <button
              onClick={() => this.props.onSignupClick(this.state.username, this.state.password1, this.state.password2)}
              type="button" className="btn btn-primary">Submit</button>
          </fieldset>
        </form>
        <br/><br/>
        <h5>{"Have an account?"}</h5>
        <button onClick={this.props.onSigninNavigate} type="button" className="btn btn-secondary">Sign In</button>
      </div>
    );
  }
}

export default SignupForm;
