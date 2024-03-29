import React from "react";
import axios from 'axios';
import {getCookie} from './Helpers';
import styled from 'styled-components';



const Container = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: #172b4dde;
    text-align:center;
`;


const FormContainer = styled.div`
    position: fixed;
    padding: 10px 30px 15px 30px;
    top: 20vh;
    left: 50vw;
    display: flex;
    background-color: #322f68;
    text-align:center
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
const CancelButton = styled.div`
    text-align:right
`;

const SaveButton = styled.div`
    text-align:center;
`;
const Title = styled.div`
    text-align:center;
    colo:blue;
    font-size: 30px;
`;
export default class AddUserToTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            datall:{}
            
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
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
        //User with Team
        console.log(this.state);
        let x= Object.keys(this.state);
        console.log(x);
        let y=this.state[x[0]];
        if(y.length===undefined)
        return;
        let z= Object.keys(y);
        let q= y[z[1]]
        let w= Object.keys(q);
        let e= q[w[0]]
        let r= Object.keys(e);
        let t= e[r[0]]
        //wybrani użytkonicy w teamie
        let userwithteam = t.users;
        //User without Team
        
        //console.log(z);
        let v= y[z[0]];
        //console.log(q);
        let usetwithoutteam = v.users;
        console.log(usetwithoutteam);
      
      }

    showComponent() {
        this.setState({ user:"", visible: true });
    }
    hideComponent() {
        this.setState({ visible: false });
    }


    handleChangeTopic = (event) =>{
        
        this.setState({user: event.target.value});
    }

    render() {
        const { visible, user } = this.state;
        return (
            <div>
            {(value) => 
                <div>
                    {visible &&
                    <Container>
                        <FormContainer>
                            <div>
                                <CancelButton>
                                    <button onClick={() => {this.hideComponent()}}>X</button>
                                </CancelButton>
                                <Title>
                                    <div>Add User</div>
                                </Title>
                                

                                <select value={user} onChange={this.handleChangeTopic} defaultValue={1}>
                                <option value="0">choose user</option>
                                    { 
                                    
                                   // console.log(this.props.board.state.topics)
                                  //  Object.values(this.props.board.state.topics).map((topic, id) =>
                                  //                 <option value={topic.id} key={topic.id}>{topic.title}</option>)
                                        
                                }
                                    
                                       
                                </select>

                                <div/>
                                <br/>
                                
                                <SaveButton>
                                    <button onClick={() => {value.deleteTopic(this.state.topic)}}>Delete</button>
                                </SaveButton>
                            </div>
                        </FormContainer>
                    </Container>
                    }
                    <div>
                        <DeleteTopicButtonContainer>
                            <div onClick={this.showComponent}>
                                Delete topic
                            </div>
                        </DeleteTopicButtonContainer>
                    </div>
                </div>
            }
        </div>
        );
    }
}

