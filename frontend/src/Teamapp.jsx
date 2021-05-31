import React from 'react';
import axios from "axios";
import styled from 'styled-components';
import {setCookie, getCookie, loggedIn} from './components/Helpers';
import UserAll from './components/UserAll';
import UserWihoutTeamc from './components/UserWihoutTeam';
import styles from "./buton.css";
import AddUserToTeam from './components/AddUserToTeam'


const NotLoggedInfo = styled.div`
  color: blue !important;
  margin: auto;
  font-weight: 500;
  background-color: #14132b;
`;


const Title = styled.div`
    text-align:center;
    color:blue;
    font-size: 40px;
`;
const SmallTitle = styled.div`

color:blue;
font-size: 25px;
`;
const UserWithTeam = styled.div`
    text-align:center;
    color:blue;
    font-size: 30px;
    width: 50%;
    float: left;
`;
const UserWithoutTeam = styled.div`
    text-align:center;
    color:blue;
    font-size: 30px;
    width: 50%;
    float: left;
`;
const TeamappContainer = styled.div`
    text-align:center;
`;

const DeleteTopicButtonContainer = styled.div`
    border-radius: 15px;
    margin: 10px;
    padding: 10px;
    color: red;
    background: #232149;
    &:hover {
        cursor: pointer;
        color: #ff4040;
    }
`;

function DeleteFromTeam(idu, props, re){
  let tab=[];
  

  let p= Object.keys(props);
  let pp= props[p[0]];
  let ppp= Object.keys(pp);
  let pppp= pp[ppp[1]];

  let x= Object.keys(pppp);

    let y=pppp[x[0]];
    
 
    let z= Object.keys(y);
    let q= y[z[0]]
    let use= q.users;
   
    console.log(use);
 
    for (let prop in use)
    {
      let i=use[prop].id;
      tab.push(i);
    }
    let newtab=[];
    for (let prop in use)
    {
      
      let i=use[prop].id;
      if(i!==idu)
      newtab.push(i);
    }
    console.log("tab");
    console.log(tab);
    
    console.log("nowy tab");
    console.log(newtab);
    let team_id= 1;
    let current_assignedUsers=tab;
    let new_assignedUsers=newtab;
  let formData = new FormData();
  formData.append("team_id", team_id);
  formData.append("current_assignedUsers", current_assignedUsers);
  formData.append("new_assignedUsers", new_assignedUsers);
//koniec


  axios.post("http://localhost:8000/kanban/update-assigned-users-for-team/", formData, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
  .then(res => {
      re.refreshState();
  })
  .catch( (error) => {
  });



}
function AddToTeam(idu, props, re){
  let tab=[];
  let newtab=[];
  console.log(tab);
  console.log(idu);

  let p= Object.keys(props);
  let pp= props[p[0]];
  let ppp= Object.keys(pp);
  let pppp= pp[ppp[1]];

  let x= Object.keys(pppp);


    let y=pppp[x[0]];
    
 
    let z= Object.keys(y);
    let q= y[z[0]]
    let use= q.users;
    
    console.log(use);

    for (let prop in use)
    {
      let i=use[prop].id;
      tab.push(i);
      newtab.push(i);
    }
    
    newtab.push(idu);
    console.log("nowy tab");
    console.log(tab);
    console.log(newtab);
    let team_id= 1;
    let current_assignedUsers=tab;
    let new_assignedUsers=newtab;
  let formData = new FormData();
  formData.append("team_id", team_id);
  formData.append("current_assignedUsers", current_assignedUsers);
  formData.append("new_assignedUsers", new_assignedUsers);
//koniec


  axios.post("http://localhost:8000/kanban/update-assigned-users-for-team/", formData, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
  .then(res => {
      re.refreshState();
  })
  .catch( (error) => {
  });


}
function DeleteUser(idu, props, re){
  console.log("Działa");
  console.log(idu);
  console.log(props.refres);
  
    
    axios.delete("http://localhost:8000/kanban/remove-user/"+idu+"/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
        re.refreshState();
      });
  



}
function ListItem(props) {
  return( 

  <div>
       {console.log(props)}
    <h3>{props.value}
  
  </h3>
  <button className="btnu" onClick={() => {DeleteFromTeam(props.id, props.states, props.refres)}}>Delete User from Team</button>
  <br /><hr />
  

  </div>
  
  );
  
}
function InTeam(props){
    let x= Object.keys(props.states);
    //console.log(x);
    let y=props.states[x[0]];
    if(y.length===undefined)
    return;
    let z= Object.keys(y);
    let q= y[z[1]]
    let w= Object.keys(q);
    let e= q[w[0]]
    let r= Object.keys(e);
    let t= e[r[0]]
    let use=t.users;
    let key=Object.values(use)
  
    for (let prop in use)
    {
      let i=use[prop].id;
      if(i===props.id)
      return <div className="te">Użytkownik w teamie</div>
    }
    return <button className="btnd" onClick={() => {AddToTeam(props.id, props.states, props.refres)}}>Add to Team</button>
}


function ListItemAll(props) {
  return( 
   
  <div>
    <h3>{props.value}
  
  </h3>
  <button className="btnu" onClick={() => {DeleteUser(props.id, props.states, props.refres)}}>Delete User</button>
 {InTeam(props)}
  
 <br /><hr />
  </div>
  
  );
  
}
export default class Teamapp extends React.Component{
  constructor(props){
    super(props);
    this.state={
      datall:{}
    }
   
 this.refreshState = this.refreshState.bind(this);
   
  this.refreshState();


  }
componentDidMount(){
  this.refreshState();
}







refreshState(){
  axios
  .get("http://localhost:8000/kanban/users-and-teams/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
  .then( (response) => {
    
    this.setState({
      datall: response.data
    })
  })
  .catch( (error) => {
    console.error(error);   
  })
}
listuserwithoutteam(){
  
  let x= Object.keys(this.state);
  let y=this.state[x[0]];
  if(y.length===undefined)
  return;
  let z= Object.keys(y);
  let q= y[z[1]]
  let w= Object.keys(q);
  let e= q[w[0]]
  let r= Object.keys(e);
  let t= e[r[0]]
  let userwithteam = t.users;
  let v= y[z[0]];
  let usetwithoutteam = v.users;
}

listalluser(){
 
  let x= Object.keys(this.state);
  let y=this.state[x[0]];
  if(y.length===undefined)
  return;

  let z= Object.keys(y);

  let q= y[z[0]];

  let przekaz = q.users;
  return(
    
  Object.values(przekaz).map((user) =>
        
  <ListItemAll key={user.toString()}
  
            value={user.userName}
            id={user.id}
            states={this.state}
            refres={this}
             
            />
  )
           

);
}

listusers(){
  
 
  let x= Object.keys(this.state);
  let y=this.state[x[0]];
  if(y.length===undefined)
  return;
  let z= Object.keys(y);
  let q= y[z[1]];

  let w= Object.keys(q);

  let e= q[w[0]]

  let r= Object.keys(e);
  let t= e[r[0]]
  //wybrani użytkonicy w teamie
  let przekaz = t.users;
  return(
    
  Object.values(przekaz).map((user) =>
        
  <ListItem key={user.toString()}
            value={user.userName}
            id={user.id}
            states={this.state}
            refres={this}
             
            />
  )
           
  
         
);



}

  

 
  render(){
    if(!loggedIn()){
      return (<NotLoggedInfo>Please login first</NotLoggedInfo>);
    }
    return(
    
      <TeamappContainer><br/><br/>
      
      <Title>Team</Title>
      
      <UserWithTeam>
      <SmallTitle>Dream Team</SmallTitle>
      <hr />
      
      
      
      
      <ul>
      { this.listusers()
 
      
      }
     
    </ul>
    <AddUserToTeam>

    </AddUserToTeam>
      
    
   
      </UserWithTeam> 
    
      <UserWithoutTeam>
      
      <SmallTitle>All User</SmallTitle>
      <hr />
    <ul>
{this.listalluser()}

    </ul>
{this.listuserwithoutteam()
}
      </UserWithoutTeam>

      </TeamappContainer>
  
    );
  }
}


//<SmallTitle>Add user to Team</SmallTitle>
//<button className="btnd" onClick={() => {}}>Dodaj użytkownika do zespołu</button>