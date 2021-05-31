import React, {Component} from "react";
import axios from 'axios';
import styled from 'styled-components';
import BoardContext from './BoardContext';
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

const EditTaskButtonContainer = styled.div`
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
export default class EditTaskButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            content: props.task.content,
            title: props.task.title,
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        this.commitTask = this.commitTask.bind(this);
    }


    commitTask(board){
        this.setState({ visible: false });
        axios
        .put("http://localhost:8000/kanban/task/"+this.props.task.id+"/", {"title": this.state.title, "content":this.state.content, "column":this.props.task.column}, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
        .then( (response) => {
        })
        .catch( (error) => {
        }).then( () => {
            board.refreshState();
        });
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

    handleChangeContent = (event) => {
        this.setState({content: event.target.value});
    }


    render() {
        const { visible, content, title } = this.state;
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
                                            <div>  Edit Task </div>
                                        </Title>
                                        <p>Title</p>
                                        <input type="text" name="title" value={title} onChange={this.handleChangeTitle} />
                                        <p>content</p>
                                        <input type="text" name="content" value={content} onChange={this.handleChangeContent} />
                                        <div/>
                                        <br/>
                                        <SaveButton> 
                                            <button onClick={() => {this.commitTask(value)}}>Save</button>
                                        </SaveButton> 
                                    </div>
                                </FormContainer>
                            </Container>
                        }
                        <div>
                            <EditTaskButtonContainer>
                                <div onClick={this.showComponent}>
                                    <img src="/icons/edit.png" alt="" style={{"borderRadius": "12px", "width": "24px", "height": "24px" }}/>
                                </div>
                            </EditTaskButtonContainer>
                        </div>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}
