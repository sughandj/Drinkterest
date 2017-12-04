import React, { Component } from 'react';
import Navbar from './Navbar';
import Loading from './Loading';
import Info from './Info';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Browse from './Browse';
import Favorites from './Favorites';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigate: null,
      authorized: null,
      info: null,
    };

    this.navigate = this.navigate.bind(this);
    this.changeInfo = this.changeInfo.bind(this);
    this.onSigninClick = this.onSigninClick.bind(this);
    this.onSignupClick = this.onSignupClick.bind(this);
    this.onSignoutClick = this.onSignoutClick.bind(this);
  }
  
  componentDidMount() {
    this.getAuthorized();
  }

  navigate(to) {
    this.setState({ navigate: to });
  }

  changeInfo(type, title, message) {
    this.setState({
      info: (
        <Info type={type} title={title} message={message}/>
      )
    });
  }

  checkStatus = (res) => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      let error = new Error(res.statusText);
      error.res = res;
      throw error;
    }
  }

  getAuthorized = () => {
    fetch('/api/authorized', {
      method: "get",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache',
      },
      credentials: 'same-origin',
    })
      .then(this.checkStatus)
      .then(res => res.json())
      .then(authorized => this.setState({ authorized }))
      .catch(e => e.res.text().then(e => this.changeInfo("danger", "Error", e)));
  }

  onSigninClick = (username, password) => {
    fetch('/api/signin', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
      .then(this.checkStatus)
      .then(res => res.json())
      .then(user => this.setState({ authorized: username, navigate: "browse", info: null }))
      .catch(e => e.res.text().then(e => this.changeInfo("danger", "Error", e)));
  }

  onSignupClick = (username, password1, password2) => {
    if (username.length === 0 || password1.length === 0 || password2.length === 0) {
      this.changeInfo("info", "Info", "You cannot leave any field blank");
    }
    else if (password1 !== password2) {
      this.changeInfo("warning", "Warning", "Passwords don't match");
    }
    else {
      fetch('/api/user', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: username,
          password: password1,
        })
      })
        .then(this.checkStatus)
        .then(res => res.json())
        .then(user => this.setState({ navigate: "signin", info: null }))
        .catch(e => e.res.text().then(e => this.changeInfo("danger", "Error", e)));
    }    
  }

  onSignoutClick = () => {
    fetch('/api/signout', {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache',
      },
      credentials: 'same-origin',
    })
      .then(this.checkStatus)
      .then(res => this.setState({ authorized: false, navigate: "signin", info: null }))
      .catch(e => e.res.text().then(e => this.changeInfo("danger", "Error", e)));
  }

  render() {
    let content;

    if (this.state.authorized === null) {
      content = (
        <Loading/>
      );
    }
    else if (this.state.navigate === "signup") {
      content = (
        <SignupForm
          changeInfo={this.changeInfo}
          onSignupClick={this.onSignupClick}
          onSigninNavigate={() => this.navigate("signin")}/>
      );
    }
    else if (this.state.authorized === false) {
      content = (
        <SigninForm
          changeInfo={this.changeInfo}
          onSigninClick={this.onSigninClick}
          onSignupNavigate={() => this.navigate("signup")}/>
      );
    }
    else if (this.state.navigate === "favorites") {
      content = (
        <Favorites
          changeInfo={this.changeInfo}/>
      );
    }
    else {
      content = (
        <Browse
          changeInfo={this.changeInfo}/>
      );
    }

    return (
      <div>
        <Navbar
          authorized={this.state.authorized}
          navigate={this.state.navigate}
          onBrowseClick={() => this.navigate("browse")}
          onFavoritesClick={() => this.navigate("favorites")}
          onSignoutClick={this.onSignoutClick}/>
        
        <main id="app" role="main" className="container">
          <div id="info">
            {this.state.info}
          </div>
          <div id="content">
            {content}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
