import React, {Component} from "react";
import axios from 'axios';
import styled from 'styled-components';
import {getCookie} from './Helpers';
import BoardContext from "./BoardContext";


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

const AddTopicButtonContainer = styled.div`
    border-radius: 15px;
    margin: 10px;
    padding: 10px;
    color: #1ace1a;
    background: #232149;
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
export default class AddColumnTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: "",
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        this.commitColumn = this.commitColumn.bind(this);
    }


    commitColumn(board){
        this.hideComponent();
        axios.post("http://localhost:8000/kanban/topic/", {"title": this.state.title, "taskOrder": JSON.stringify([]), "board":board.id}, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
        .then( (response) => {
        })
        .catch( (error) => {
        }).then( () => {
            board.refreshState();
        });
    }


    showComponent() {
        this.setState({ title:"", visible: true });
    }
    hideComponent() {
        this.setState({ visible: false });
    }


    handleChangeTitle = (event) =>{
        this.setState({title: event.target.value});
    }




    render() {
        const { visible, title } = this.state;
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
                                        <div>Add Topic</div>
                                    </Title>
                                    <p>Title</p>
                                    <input type="text" name="title" value={title} onChange={this.handleChangeTitle} />
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
                            <AddTopicButtonContainer>
                                <div onClick={this.showComponent}>
                                    Add Topic +
                                </div>
                            </AddTopicButtonContainer>
                        </div>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}
