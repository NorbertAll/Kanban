import React from "react";
import axios from 'axios';
import styled from 'styled-components';
import BoardContext from './BoardContext';

const Container = styled.div`
    display: flex;
    border-radius: 10px;
    color: #ed1c24;
    margin: 1px;
    padding: 1px;
    &:hover {
        cursor: pointer;
    }
`;

class DeleteColumnButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            column: this.props.column,
        };
    }

    render() {
        return (
            <BoardContext.Consumer>
                {(value) => 
                    <div>
                        <Container>
                            <div onClick={()=>{value.deleteColumn(this.props.column)}}>
                                <img src="/icons/remove.png" alt="" style={{"borderRadius": "12px", "width": "24px", "height": "24px" }} />
                            </div>
                        </Container>
                    </div>
                }
            </BoardContext.Consumer>
        );
    }
}

export default DeleteColumnButton;
