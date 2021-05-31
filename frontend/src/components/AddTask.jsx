import React, {Component} from "react";
import axios from 'axios';
import styled from 'styled-components';
import {getCookie} from './Helpers';
import BoardContext from "./BoardContext";
import Refresh from './Refresh'

const Container = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: #172b4dde;
`;

const FormContainer = styled.div`
    position: fixed;
    padding: 10px 30px 15px 30px;
    top: 20vh;
    left: 50vw;
    display: flex;
    background-color: #322f68;
    text-align:center;
`;

const AddTaskButtonContainer = styled.div`
    border-radius: 0px 15px 0px 15px;
    margin-top 5px;
    padding: 10px;
    color: #1ace1a;
    background: #322f68;
    &:hover {
        cursor: pointer;
        color: lime;
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


export default class AddTaskButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: "",
            content: "",
            users: "",
            topic: "",
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        this.commitTask = this.commitTask.bind(this);
    }

    
    commitTask(board){
        
        board.refreshState();
        console.log(this.props.board.state.tasks);
        let listuser=Object.keys(this.props.board.state.users);
        let listtasks=Object.keys(this.props.board.state.tasks);
        console.log(listtasks);
        let limitperuseralert=0;
        let limitperteamalert=0;
        let idobkol=this.props.column.id;
        let ouser =this.state.userAssigned;
        console.log(idobkol);
        let limitperus=0;
        let limitpert=1;
        let i=0;
        let j=0;
        let use=this.props.board.state.users;
        let ta=this.props.board.state.tasks;
        let enduser=listuser.length;
        let endtasks=listtasks.length;
        console.log("Limit na user");
       console.log(this.props.column.props.column.limitPerUser);
        // Limit Per User    
        for (let prop in use) { 
           
           // 
            
            for (let propt in ta) {
                console.log(prop);
                if(ouser==prop&&(propt==idobkol)){
                                    limitperus++;
                                    console.log("Działa"+limitperus);
                                }
                            
              if((this.props.board.state.tasks[listtasks[i]].column==idobkol)&&(this.props.board.state.tasks[listtasks[i]].user==prop)){
                  limitperus=limitperus+1;
                }
                if(limitperus>(this.props.column.props.column.limitPerUser)){//dfdfdfdfd
                     limitperuseralert=1;
                       break;}
               if(i==(endtasks)){
                console.log('koniec literacji po tasku');
                 break;   
               }
               ++i;
            }
            i=0;
            limitperus=0;
            if(j==enduser){
                break;   
              }
              ++j;
        }
        i=0;
        j=0;
        //Limit Per Team
        console.log('================================');
        for (let propt in ta) {
                
            console.log("task" + propt); 
                    
              if(this.props.board.state.tasks[listtasks[i]].column==idobkol){
                  limitpert=limitpert+1;
                  console.log("Limitpert"+limitpert);
                }
                if(limitpert>(this.props.column.props.column.limitPerTeam)){
                     limitperteamalert=1;
                     console.log("Limitperteamalert"+limitperteamalert);
                       break;
                    }
               if(i==(endtasks)){
                console.log('koniec literacji po tasku');
                 break;   
               }
               ++i;
        }
        i=0;
        j=0;
    
        
        
        if(limitperuseralert==1 && this.props.column.props.column.limitPerUser > 0){
    
            alert("Add imposible limit per user is exceeded");
        } 


        else
        //    console.log("A co my tu mamy");
        //    console.log(this.props.column.state);
        //    console.log("A co my tu mamy");
        //    console.log("A co my tu mamy");
        //    console.log(limitperteamalert);

       if(limitperteamalert==1 && this.props.column.props.column.limitPerTeam > 0){
           
           alert("Add imposible limit per team is exceeded");
       } 

        else{
        if(this.state.topic==0 ||this.state.userAssigned==0)
            alert("Task nie dodany")
        else{   
        this.hideComponent();
        axios
        .post("http://localhost:8000/kanban/task/", {"title": this.state.title, "content":this.state.content, "topic":this.state.topic, "userAssigned":this.state.userAssigned, "column":this.props.column.id}, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
        
        .then( (response) => {
        })
        .catch( (error) => {
        }).then( () => {
            board.refreshState();
        });
        } 
        }
        
    }
    showComponent() {
        if(this.props.column.addTaskPossible()){
            this.setState({ visible: true });
        }else{
            alert("Task limit reached");
        }
    }
    hideComponent() {
        this.setState({ visible: false });
    }


    handleChangeTitle = (event) =>{
        this.setState({title: event.target.value});
    }

    handleChangeContent = (event) => {
        this.setState({content: event.target.value});
    }
    handleChangeUser = (event) => {
        this.setState({userAssigned: event.target.value});
    }
    handleChangeTopic = (event) => {
        this.setState({topic: event.target.value});
    }


    render() {
        
        
       // const Userxs = users.map(user => <Userx key={user.id} user={user} />)
        const { visible, content, title, userAssigned, topic} = this.state
        return (
            
            <BoardContext.Consumer>
               
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
                                        <div>Add Task</div>
                                    </Title>
                                    <br/>
                                    <p>Title</p>
                                    <input type="text" name="title" value={title} onChange={this.handleChangeTitle} />
                                    <br/><br/>
                                    <p>Content</p>
                                    <input type="text" name="content" value={content} onChange={this.handleChangeContent} />
                                    <br/><br/>
                                    <p>Person</p>
                                
                                    <select value={userAssigned} onChange={this.handleChangeUser}>
                                    <option value="0">choose person</option>
                                    { 

                                    //console.log(Object.values(this.props.board.state.users))
                                    Object.values(this.props.board.state.users).map((user) =>
                                                   <option value={user.id} key={user.id}>{user.userName}</option>)
                                        }
                                    </select>
                                    <br/><br/>
                                    <p>Topic</p>
                                
                                    <select value={topic} onChange={this.handleChangeTopic}>
                                    <option value="0">choose topic</option>
                                    { 
                                    
                                    //console.log(this.props.board.state.topics)
                                    Object.values(this.props.board.state.topics).map((topic) =>
                                                   <option value={topic.id} key={topic.id}>{topic.title}</option>)
                                        }
                                    
                                       
                                    </select>
                                    <div/>
                                    <br/>
                                    <SaveButton>
                                        <button onClick={() => {this.commitTask(value)}}>Save</button>
                                    </SaveButton>
                                </div>
                            </FormContainer>
                        </Container>
                        }
                        <AddTaskButtonContainer>
                            <div onClick={this.showComponent}>
                                Add Task +
                            </div>
                        </AddTaskButtonContainer>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}
