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
export default class EditBoardButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            name: props.board.state.name,
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        this.commitBoard = this.commitBoard.bind(this);
    }


    commitBoard(board){
        this.setState({ visible: false });
        let obj_to_send = {};
        obj_to_send.name = this.state.name;
        axios
        .put("http://localhost:8000/kanban/board/"+this.props.board.id+"/", obj_to_send, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
        .then( (response) => {
        })
        .catch( (error) => {
        }).then( () => {
            board.refreshState();
        });
    }


    showComponent(board) {
        const new_state = {...this.state};
        new_state.visible = true;
        new_state.name = board.state.name;
        this.setState(new_state);
    }
    hideComponent() {
        this.setState({ visible: false });
    }

    updateName(new_name) {
        const new_state = {...this.state};
        new_state.name = new_name;
        this.setState(new_state);
    }
    
    handleChangeTitle = (event) =>{
        this.setState({name: event.target.value});
    }

    render() {
        const {visible} = this.state;
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
                                            <div>Edit Board</div>
                                        </Title>
                                        <p>Title</p>
                                        <input type="text" name="name" value={this.state.name} onChange={this.handleChangeTitle} />
                                        <br/><br/>
                                        <SaveButton>    
                                            <button onClick={() => {this.commitBoard(value)}}>Save</button>
                                        </SaveButton> 
                                    </div>
                                </FormContainer>
                            </Container>
                        }
                        <div>
                            <EditTaskButtonContainer>
                                <div onClick={() => this.showComponent(value)}>
                                    <img src="/icons/edit.png" alt=""/>
                                </div>
                            </EditTaskButtonContainer>
                        </div>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}
