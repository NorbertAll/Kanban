import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import EditColumnButton from './EditColumnButton';
import DeleteColumnButton from "./DeleteColumnButton";
import AddTaskButton from "./AddTask";
import BoardContext from "./BoardContext";
import Row from './Row';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 270px;
  margin: 0px;
  border-radius: 5px;
`;

const Wrapper = styled.div`
  border-radius: 5px;
`;

const RowListWrapper = styled.div`
  flex-grow: 1;
`;

const ColumnUpBar = styled.div`
  display: flex;
  flex-direction: row;
  padding 5px;
  border: solid 2px #232149;
  border-radius: 5px 5px 0px 0px;
  background-color: #18163a;
`;

    const ColumnTitle = styled.div`
      font-size: 100%;
      margin 2px;
      padding: 2px;
    `;

    const ColumnTitleSpacing = styled.div`
      margin: auto;
      padding: 2px;
    `;

    const ColumnLimitPerUserInfo = styled.div`
      margin 2px;
      padding: 2px;
    `;

    const ColumnLimitPerTeamInfo = styled.div`
      margin 2px;
      padding: 2px;
    `;

    const ColumnLimitInfo = styled.div`
      margin 2px;
      padding: 2px;
    `;
const ColumnContent = styled.div`
`;

const ColumnDownBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #18163a;
  border: solid 2px #232149;
  border-radius: 0px 0px 15px 15px;
`;

class RowList extends React.Component {
  shouldComponentUpdate(){
    return true;
  }

  render() {
    const {rows, rowsArray} = this.props.board.state;
    return (
      rowsArray.map(
        (row, index) => {
          if(row.column.id == this.props.column.id){
            return <Row row={row} board={this.props.board} />
          }
          return;
        }
      )
    );
  }
}

export default class Column extends React.Component {
  constructor(props){
    super(props);
    this.state = {...props.column};

    this.id = props.column.id;
    this.title = props.column.title;
    this.limit = props.column.limit;
    this.limitPerUser = props.column.limitPerUser;
    this.limitPerTeam = props.column.limitPerTeam;
    this.taskOrder = props.column.taskOrder;
    this.board = props.board;
    
    this.tasks = {};
    this.state.tasksArray = this.taskOrder.map(taskId => this.board.state.tasks[taskId]);

    this.getTasksQuantity = this.getTasksQuantity.bind(this);
  }

  shouldComponentUpdate(){
    return true;
  }

  registerOnBoard(board){
    board.registerColumn(this);
  }


  addTaskPossible(task, info){
    if(task){
      let user = this.props.board.state.users[task.user];
      let team = this.props.board.getUserTeam(user);

      if(
          ( this.addTaskForColumnPossible(info) ) &&
          ( this.addTaskForUserPossible(user, info) ) &&
          ( this.addTaskForTeamPossible(team, info) )
        )
      {
        return true;
      }
      return false;
    }

    return this.addTaskForColumnPossible(info);
  }

  addTaskForColumnPossible(info){
    if(this.props.column.limit > this.getTasksQuantity() || this.props.column.limit == 0){
      return true;
    }
    if(info){
      alert(" Tasks limit in Column \""+this.props.column.title+"\" reached ");
    }
    return false;
  }

  getTasksQuantity(){
    return this.props.column.taskOrder.length;
  }

  addTaskForUserPossible(user, info){
    if(this.props.column.limitPerUser > this.getUserTasks(user).length || this.props.column.limitPerUser == 0){
      return true;
    }
    if(info){
      alert(" Tasks limit for user \""+user.userName+"\" reached ");
    }
    return false;
  }

  getUserTasks(user){
    const taskArray = [];
    const {tasks} = this.props.board.state;
  
    for (const [task_id, task] of Object.entries(tasks)) {
      if (task.user == user.id && task.column == this.props.column.id){
        taskArray.push(task);
      }
    }

    return taskArray;
  }

  addTaskForTeamPossible(team, info){
    if(this.props.column.limitPerTeam > this.getTeamTasks(team).length || this.props.column.limitPerTeam == 0){
      return true;
    }
    if(info){
      alert(" Tasks limit for team \""+team.name+"\" reached ");
    }
    return false;
  }

  getTeamTasks(team){
    const taskArray = [];
    const {tasks} = this.props.board.state;
  
    for (const [task_id, task] of Object.entries(tasks)) {
      if (task.column == this.id && task.user != ""){
        taskArray.push(task);
      }
    }

    return taskArray;
  }
  
  renderLimitPerUser(){
    if(this.props.column.limitPerUser < 1){
      return("U:"+"∞");
    }
    return(
      "U:"+this.props.column.limitPerUser
    );
  }

  renderLimitPerTeam(){
    if(this.props.column.limitPerTeam < 1){
      return("T:"+"∞");
    }
    return(
      "T:"+this.props.column.limitPerTeam
    );
  }

  render() {
    return (
      <BoardContext.Consumer>
        {(value) => 
          <Draggable draggableId={this.props.column.title} index={this.props.index}>
            {provided => (
              <Container {...provided.draggableProps} ref={provided.innerRef}>
                {this.registerOnBoard(value)}
                <Wrapper>
                  <ColumnUpBar  {...provided.dragHandleProps}>
                    <ColumnTitle>
                      {this.renderTitle()}
                    </ColumnTitle>

                    <ColumnTitleSpacing>
                    </ColumnTitleSpacing>

                    <ColumnLimitPerUserInfo>
                      {this.renderLimitPerUser()}
                    </ColumnLimitPerUserInfo>

                    <ColumnLimitPerTeamInfo>
                      {this.renderLimitPerTeam()}
                    </ColumnLimitPerTeamInfo>
                    
                    <ColumnLimitInfo>
                      {this.renderLimit()}
                    </ColumnLimitInfo>

                    <EditColumnButton column={this.props.column} colObj={this} board={this.props.board}>
                    </EditColumnButton>

                    <DeleteColumnButton column={this.props.column}/>
                  </ColumnUpBar>

                  <ColumnContent>
                        <RowListWrapper>
                          <RowList column={this.props.column} board={value}/>
                          {provided.placeholder}
                        </RowListWrapper>
                  </ColumnContent>

                  <ColumnDownBar>
                    {this.addTaskPossible(false) &&
                      <AddTaskButton column={this} colObj={this} board={this.props.board} limitPerUser={this.props.limitPerUser} limitPerTeam={this.props.limitPerTeam}>
                      </AddTaskButton>
                    }
                  </ColumnDownBar>
                </Wrapper>
              </Container>
            )}
          </Draggable>
        }
      </BoardContext.Consumer>
    );
  }

  
  renderTitle(){
    if(this.props.column.title){
      return(
        this.props.column.title
        );
    }
    return(
      "TITLE N/A"
      );
  }

  renderLimit(){
    if(this.props.column.limit < 1){
      return(this.getTasksQuantity()+"/"+"∞");
    }
    return(
      this.getTasksQuantity()+"/"+this.props.column.limit
    );
  }

}
