import React, { Component } from "react";
import axios from "axios";
import styled from 'styled-components';
import {setCookie, getCookie, loggedIn} from './components/Helpers';

const Title = styled.div`
    text-align:center;
    color:blue;
    font-size: 30px;
`;
const LoginContainer = styled.div`
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
`; 

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loginErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

 
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    
    const { username, password } = this.state;
 
  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
    axios
      .post(
        "http://localhost:8000/kanban/api-token-auth/",
        formData
      )
      .then(response => {
        setCookie("auth_token", response.data.token, 3);
        if(loggedIn()){
          window.location.assign("/board");
        }
      })
      .catch(error => {
        console.log("login error", error);
        alert("login error");
      });
    event.preventDefault();
  }

  render() {
    return (
      <LoginContainer><br/>
      <Title>Login</Title>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          />
<br/><br/>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
<br/><br/>
          <button type="submit">Login</button>
        </form>
      </LoginContainer>
    );
  }
}










