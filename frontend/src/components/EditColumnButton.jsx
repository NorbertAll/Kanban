import React, {Component} from "react";
import axios from 'axios';
import styled from 'styled-components';
import BoardContext from './BoardContext';
import Refresh from './Refresh';
import {getCookie} from './Helpers';

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

const EditColumnButtonContainer = styled.div`
    display: flex;
    border-radius: 10px;
    color: #ff7f27;
    margin: 1px;
    padding: 1px;
    &:hover {
        cursor: pointer;
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
export default class EditColumnButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            limit: props.column.limit,
            title: props.column.title,
            limitPerUser: props.column.limitPerUser,
            limitPerTeam: props.column.limitPerTeam,

        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        this.commitColumn = this.commitColumn.bind(this);
        
    }

    commitColumn(board){
        
        let po=Object.keys(this.props.board.state.users);
        let list=Object.keys(this.props.board.state.tasks);
        let limitperuseralert=0;
        let idobkol=this.props.column.id;
        console.log("obecna kolumna");
        console.log(idobkol);
        let limitperus=0;
        let i=0;
        let use=this.props.board.state.users;
        console.log(use);
        let ta=this.props.board.state.tasks;
        let end=list.length;
        console.log("ilość tasków");
        console.log(end);
        for (let prop in use) { 
            console.log("użytkonik  "+prop);
            
            for (let propt in ta) {
                console.log(this.props.board.state.tasks[list[i]].user);
              if((this.props.board.state.tasks[list[i]].column==idobkol)&&(this.props.board.state.tasks[list[i]].user==prop)){
                
                  limitperus++;
                }
              if(limitperus>this.state.limitPerUser){
                  limitperuseralert=1;
                  break;
              }
               if(i==end){
                 break;   
               }
                i++;
            }
            i=0;
            limitperus=0;
        }


        if(this.state.limit < this.props.colObj.getTasksQuantity() && this.state.limit != 0){
            alert("Save impossible: Limit value ("+this.state.limit+") under tasks quantity ("+this.props.colObj.getTasksQuantity()+")");
        }
        else if(this.state.limitPerTeam < this.props.colObj.getTasksQuantity() && this.state.limitPerTeam != 0){
            alert("Save impossible: Limit value ("+this.state.limitPerTeam+") under tasks quantity ("+this.props.colObj.getTasksQuantity()+")");
        }
        else if(limitperuseralert==1 && this.state.limitPerUser != 0){
            alert("Save imposible limit per user is exceeded");
        } 
        
        
        else{
            this.setState({ visible: false });
            axios
            .put("http://localhost:8000/kanban/column/"+this.props.column.id+"/", {"title": this.state.title, "limit":this.state.limit, "limitPerUser":this.state.limitPerUser, "limitPerTeam":this.state.limitPerTeam, "taskOrder":JSON.stringify(this.props.column.taskOrder), "board":this.props.column.board}, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
            .then( (response) => {
            })
            .catch( (error) => {
            }).then( () => {
                board.refreshState();
                
            })
           
        }
       
    }


    showComponent() {
        this.setState({ visible: true });
    }
    hideComponent() {
        this.setState({ visible: false });
    }

    
    handleChangeTitle = (event) =>{
        this.setState({title: event.target.value});
    }

    handleChangeLimit = (event) => {
        this.setState({limit: event.target.value});
    }

    handleChangelimitPerUser = (event) => {
        this.setState({limitPerUser: event.target.value});
        
    }

    handleChangelimitPerTeam= (event) => {
        this.setState({limitPerTeam: event.target.value});
        
    }
    render() {
        const { visible, limit, title , limitPerUser, limitPerTeam} = this.state;
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
                                            <div>Edit Column</div>
                                        </Title>
                                        <p>Title</p>
                                        <input type="text" name="title" value={title} onChange={this.handleChangeTitle} />
                                        <p>Limit</p>
                                        <input type="number" name="limit" value={limit} onChange={this.handleChangeLimit} />
                                        <p>Limit per user</p>
                                        <input type="number" name="limitPerUser" value={limitPerUser} onChange={this.handleChangelimitPerUser} />
                                        <div/>
                                        <p>Limit per team</p>
                                        <input type="number" name="limitPerTeam" value={limitPerTeam} onChange={this.handleChangelimitPerTeam} />
                                        <div/>
                                        <br/>
                                        <SaveButton> 
                                            <button onClick={() => {this.commitColumn(value)}}>Save</button>
                                        </SaveButton> 
                                    </div>
                                   
                                </FormContainer>
                            </Container>
                        }
                        <div>
                            <EditColumnButtonContainer>
                                <div onClick={this.showComponent}>
                                    <img src="/icons/edit.png" alt="" style={{"borderRadius": "12px", "width": "24px", "height": "24px" }}/>
                                </div>
                            </EditColumnButtonContainer>
                        </div>
                    </div>
                }
            </BoardContext.Consumer>
            
        );
    }
}
