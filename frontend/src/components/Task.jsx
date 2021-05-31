import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import EditTaskButton from './EditTaskButton';
import DeleteTaskButton from './DeleteTaskButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 5px;
  background-color: #322f68;
`;


const TaskUpBar = styled.div`
  display: flex;
  flex-direction: row;
`;

    const TaskTitle = styled.div`
      margin: 4px;
      padding: 4px;
    `;

    const TaskTitleSpacing = styled.div`
      margin: auto;
    `;
  

const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 4px 0px 4px;
  padding: 0px 4px 0px 4px;
`;

const TaskDownBar = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px;
  padding: 4px;
`;

    const UserInfo = styled.div`
      display: flex;
      margin: 5px;
      padding: 5px;
    `;

    const UserAvatar = styled.div`
      display: flex;
      width: 24px;
      height: 24px;
    `;




export default class Task extends React.Component {

  renderTitle(){
    if(this.props.task.title){
      return(
        this.props.task.title
        );
    }
    return(
      "TITLE N/A"
      );
    
  }

  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <TaskUpBar>
              <TaskTitle>
                {this.renderTitle()}
              </TaskTitle>
              <TaskTitleSpacing>
                
              </TaskTitleSpacing>
              <EditTaskButton task={this.props.task}>

              </EditTaskButton>
              <DeleteTaskButton task={this.props.task}>

              </DeleteTaskButton>
            </TaskUpBar>
            <TaskContent>
              {this.props.task.content}
            </TaskContent>
            <TaskDownBar>
              <UserAvatar>
                <img src={"http://localhost:8000"+this.props.user.avatar_url} style={{"borderRadius": "10px", "width": "20px", "height": "20px" }}></img>
              </UserAvatar>
              <UserInfo>
                {this.props.user.username}
              </UserInfo>
            </TaskDownBar>
            
          </Container>
        )}
      </Draggable>
    );
  }
}
