import React, { Component } from "react";
import axios from "axios";
import styled from 'styled-components';
import FormData from 'form-data'
const Title = styled.div`
    text-align:center;
    color:blue;
    font-size: 30px;
`;
const RegisterContainer = styled.div`
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
`;
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      first_name:"",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      registrationErrors: "",
      avatar:null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
 // handleFileChange({target: {name, files}}) {
 //   toBase64(files[0]).then(dataUri => {
 //     this.setState(state => ({...state, [name]: dataUri}))
 //   })
 //}
 handleFileChange({target: {name, files}}) {
  this.setState(state => ({...state, [name]: files[0]}))
}
  handleSubmit(event) {
    const { username, firstname, lastname, email, password, password_confirmation, avatar } = this.state;
    let formData = new FormData();
    formData.append("username", username);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", password_confirmation);
    formData.append("avatar", avatar);

    axios
      .post(
        "http://127.0.0.1:8000/kanban/add-user/",
        formData
      )
      .then(response => {
        window.location.assign("/login");
        /*
        if (response.data.status === "created") {
          this.props.handleSuccessfulAuth(response.data);
        }
        */
      })
      .catch(error => {
        console.log("registration error", error);
        alert("registration error");
      });
    event.preventDefault();
    
  }

  render() {
    return (
      <RegisterContainer><br/>
      <Title>Registration</Title>
        <form onSubmit={this.handleSubmit} enctype="multipart/form-data" action="/upload/image" method="post">
        <input
            type="username"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          />
<br/><br/>
<input
            type="firstname"
            name="firstname"
            placeholder="firstname"
            value={this.state.firstname}
            onChange={this.handleChange}
            required
          />
<br/><br/>
<input
            type="lastname"
            name="lastname"
            placeholder="lastname"
            value={this.state.lastname}
            onChange={this.handleChange}
            required
          />
<br/><br/>
          
          
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
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
          <input
            type="password"
            name="password_confirmation"
            placeholder="Password confirmation"
            value={this.state.password_confirmation}
            onChange={this.handleChange}
            required
          />
<br/><br/>
          <input 
            type="file" 
            ref={this.fileInput}
            name="avatar"
            value={this.state.file}
            onChange={this.handleFileChange}
            required
            />
<br/><br/>


          <button type="submit">Register</button>
        </form>
        </RegisterContainer>
    );
  }
}