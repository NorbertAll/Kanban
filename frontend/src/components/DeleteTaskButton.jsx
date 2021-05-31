import React, {Component} from "react";
import axios from 'axios';
import styled from 'styled-components';
import BoardContext from './BoardContext';

const Container = styled.div`
    display: flex;
    margin: 1px;
    padding: 1px;
    border-radius: 10px;
    color: #ed1c24;
    &:hover {
        cursor: pointer;
        bakcground: red;
    }
`;

export default class DeleteTaskButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: props.task,
        };
    }

    render() {
        return (
            <BoardContext.Consumer>
                {(value) => 
                    <div>
                        <Container>
                            <div onClick={()=>{value.deleteTask(this.props.task)}}>
                                <img src="/icons/remove.png" alt="" style={{"borderRadius": "12px", "width": "24px", "height": "24px" }}/>
                            </div>
                        </Container>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}