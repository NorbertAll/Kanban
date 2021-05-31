import React from 'react';
import axios from "axios";
import styled from 'styled-components';
import {getCookie} from './Helpers';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import _default from '@atlaskit/css-reset';

const Title = styled.div`
    text-align:center;
    color:blue;
    font-size: 40px;
`;
const UserContainer = styled.div`
  
`;

function ListItem(props) {
 
  return( 
   
  <div><h3>{props.value}
  <img src={props.avatar_url} style={{"borderRadius": "20px", "width": "40px", "height": "40px" }}></img></h3>
  
  <br /><hr />
  </div>
  
  );
  
}
//<button onClick={() => {Userapp.deleteUser(props.id)}}>Delete</button>

export default class UserinWithoutTeamc extends React.Component{
  constructor(props){
    super(props);
   this.state={
     user:{}
   }
    
    this.refreshState.bind(this);
   
    
  }
deleteUser(user){
  axios.delete("http://localhost:8000/kanban/user-delete/"+user+"/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
    .then(res => {
      this.refreshState();
    });
}
  refreshState(){
    axios
    .get("http://localhost:8000/kanban/user-detail/")
    .then( (response) => {
 
      this.setState({
        user: response.data
      })
    })
    .catch( (error) => {
      console.error(error);   
    })
  }



  render(){

    return(
      <UserContainer>
  <hr />
{
      <ul>
      {Object.values(this.state.user).map((user) =>
        
        <ListItem key={user.toString()}
                  value={user.userName}
                   avatar_url={user.avatar_url}
                   id={user.id}
                   
                  />
        
        
        //<button onClick={() => {}>Delete</button>
      
      )}
    </ul>
}
      </UserContainer>
    );
  }
}
//{Object.values(this.props.board.state.topics).map((topic) =>
//                                                   <option value={topic.id} key={topic.id}>{topic.title}</option>)
//      }