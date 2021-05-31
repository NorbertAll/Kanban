import React from 'react';
import axios from "axios";
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import {setCookie, getCookie, loggedIn} from './components/Helpers';
import '@atlaskit/css-reset';
import _default from '@atlaskit/css-reset';
import userData from './components/userdata';
import UserAll from './components/UserAll';

const NotLoggedInfo = styled.div`
  color: blue !important;
  margin: auto;
  font-weight: 500;
  background-color: #14132b;
`;

const Title = styled.div`
   top: 30vh;
    color:blue;
    font-size: 40px;
`;
const UserContainer = styled.div`
text-align:center;
`;


//<button onClick={() => {Userapp.deleteUser(props.id)}}>Delete</button>

export default class Userapp extends React.Component{
  constructor(props){
    super(props);
    this.state={
      all:{}
    }
   //this.team=[];
   
 //  this.refreshStateT();
   
this.refreshState();
  }
//deleteUser(user){
//  axios.delete("http://localhost:8000/kanban/user-delete/"+user+"/")
//    .then(res => {
//      this.refreshState();
//    });
//}
refreshState(){
  axios
  .get("http://localhost:8000/kanban/users-and-teams/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
  .then( (response) => {
    
    this.setState({
      all: response.data
    })
  })
  .catch( (error) => {
    console.error(error);   
  })
}
listusers(){
  
  
  let x= Object.keys(this.state.all);
  if(x.length==0)
  return;
  console.log("początek funkcji");
  //console.log(x);
  let y=this.state.all[x[0]];
  //console.log(y);
  let z=y;
  console.log(z);
  
  //console.log(z);

}
filtr(){
  let x=null;
  if(this.listusers()!==undefined)
    x=this.listusers();
  return x;
}
  //second refersh

 // refreshStateT(){
 //   axios
 //   .get("http://localhost:8000/kanban/team/")
 //   .then( (responses) => {
 //     let x=responses.data;
 //     let y= Object.keys(responses.data);
 //     let z=x[0].users;
 //     this.team=z;
 //     console.log(this.team);
 //     //this.setState({
 //     //
 //     //})
 //   })
 //   .catch( (error) => {
 //     console.error(error);   
 //   })
 // }


  render(){
    if(!loggedIn()){
      return (<NotLoggedInfo>Please login first</NotLoggedInfo>);
    }
  
    return(
     
      <UserContainer>

      <Title>Users</Title>
 
   
  <hr />
  <UserAll/>

      </UserContainer>
    );
  }
}
//{Object.values(this.props.board.state.topics).map((topic) =>
//                                                   <option value={topic.id} key={topic.id}>{topic.title}</option>)
//      }

//
//
  //    <ul>
  //    {Object.values(this.state.user).map((user) =>
  //      
  //      <ListItem key={user.toString()}
  //                value={user.userName}
  //                 avatar_url={user.avatar_url}
  //                 id={user.id}
  //                 
  //                />
  //      
  //      
  //      //<button onClick={() => {}>Delete</button>
  //    
  //    )}
  //  </ul>
 