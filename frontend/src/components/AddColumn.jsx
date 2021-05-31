import React, {Component} from "react";
import axios from 'axios';
import {getCookie} from './Helpers';
import styled from 'styled-components';
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

const AddColumnButtonContainer = styled.div`
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
export default class AddColumnButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            limit: 0,
            title: "",
            limitPerUser: 0,
            limitPerTeam: 0,
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        this.commitColumn = this.commitColumn.bind(this);
    }


    commitColumn(board){
        this.hideComponent();
        axios.post("http://localhost:8000/kanban/column/", {"title": this.state.title, "limit":this.state.limit, "limitPerUser":this.state.limitPerUser, "limitPerTeam":this.state.limitPerTeam, "taskOrder": JSON.stringify([]), "board":board.id}, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
        .then( (response) => {
        })
        .catch( (error) => {
        }).then( () => {
            board.refreshState();
        });
    }


    showComponent() {
        this.setState({ title:"", limit:0, visible: true });
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
                                        <div>Add Column</div>
                                    </Title>
                                    <p>Title</p>
                                    <input type="text" name="title" value={title} onChange={this.handleChangeTitle} />
                                    <p>Limit</p>
                                    <input type="number" name="limit" value={this.state.limit} onChange={this.handleChangeLimit} />
                                    <div/>
                                    <br/>
                                    <p>Limit per user</p>
                                    <input type="number" name="limitPerUser" value={limitPerUser} onChange={this.handleChangelimitPerUser} />
                                    <div/>
                                    <p>Limit per team</p>
                                    <input type="number" name="limitPerUser" value={limitPerTeam} onChange={this.handleChangelimitPerTeam} />
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
                            <AddColumnButtonContainer>
                                <div onClick={this.showComponent}>
                                    Add Column +
                                </div>
                            </AddColumnButtonContainer>
                        </div>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}
