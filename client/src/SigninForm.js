import React, { Component } from 'react';

class SigninForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
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
      <div id="signin">
        <form id="signin-form">
          <fieldset>
            <legend>Sign In</legend>
            <div className="form-group">
              <label htmlFor="SignInInputUser">Username</label>
              <input name="username" onChange={this.handleInputChange} type="text" className="form-control" placeholder="Enter username"/>
            </div>
            <div className="form-group">
              <label htmlFor="SignInInputPassword">Password</label>
              <input name="password" onChange={this.handleInputChange} type="password" className="form-control" placeholder="Enter password"/>
            </div>
            <button onClick={() => this.props.onSigninClick(this.state.username, this.state.password)} type="button" className="btn btn-primary">Submit</button>
          </fieldset>
        </form>
        <br/><br/>
        <h5>{"Don't have an account?"}</h5>
        <button onClick={this.props.onSignupNavigate} type="button" className="btn btn-secondary">Sign Up</button>
      </div>
    );
  }
}

export default SigninForm;
