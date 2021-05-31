import React from "react";
import axios from 'axios';
import styled from 'styled-components';
import BoardContext from './BoardContext';


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
export default class DeleteTopicButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            topic: this.props.topic,
            
        };
        this.showComponent = this.showComponent.bind(this);
        this.hideComponent = this.hideComponent.bind(this);
        
    }





    showComponent() {
        this.setState({ topic:"", visible: true });
    }
    hideComponent() {
        this.setState({ visible: false });
    }


    handleChangeTopic = (event) =>{
        
        this.setState({topic: event.target.value});
    }

    render() {
        const { visible, topic } = this.state;
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
                                    <div>Delete Topic</div>
                                </Title>
                                

                                <select value={topic} onChange={this.handleChangeTopic} defaultValue={1}>
                                <option value="0">choose topic</option>
                                    { 
                                    
                                   // console.log(this.props.board.state.topics)
                                    Object.values(this.props.board.state.topics).map((topic, id) =>
                                                   <option value={topic.id} key={topic.id}>{topic.title}</option>)
                                        
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
        </BoardContext.Consumer>
        );
    }
}

