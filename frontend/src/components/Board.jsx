import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import mockData from './mock_data';
import Column from './Column';
import axios from 'axios';
import AddColumnButton from "./AddColumn";
import AddTopicButton from "./AddTopic";
import DeleteTopicButton from "./DeleteTopicButton";
import BoardContext from './BoardContext';
import mock_response from './mock_response';
import EditBoardButton from './EditBoardButton';
import { ProgressBar, Button, CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import _default from '@atlaskit/css-reset';
import {getCookie, loggedIn} from './Helpers';

const NotLoggedInfo = styled.div`
  color: blue !important;
  margin: auto;
  font-weight: 500;
  background-color: #14132b;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #03A9F4;
  font-weight: 500;
  background-color: #14132b;
`;


const BoardUpBar = styled.div`
  display: flex;
  flex-direction: column;
`;

    const BoardInfo = styled.div`
      display: flex;
      margin: auto;
      flex-direction: row;
    `;

        const BoardTitle = styled.div`
          font-size: 140%;
          margin: 5px;
          padding: 5px;
        `;
        
        const EditBoardButtonContainer = styled.div`
          display: none;
          margin: 5px;
          padding: 5px;
        `;

    const BoardProgress = styled.div`
      width: 90vw;
      margin: auto;
    `;


const BoardContent = styled.div`
  display: flex;
  flex-direction: row;
  background: #14132b;
  margin: 5px;
  padding: 5px;
`;

const BoardContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: #14132b;
  margin: auto;
  padding: 5px;
`;

const BoardDownBar = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
`;

    const AddColumnButtonContainer = styled.div`
      min-width: 250px;
      background: green;
      display: flex;
      margin: 5px;
      padding: 5px;
    `;


class ColumnList extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const {board} = this.props;

    return (
      board.state.columnOrder.map((column_id, index) => (
        <Column key={board.state.columns[column_id].title} column={board.state.columns[column_id]} index={index} board={board}/>
      ))
    );
    
  }
}

export default class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = mockData;
    this.refreshState = this.refreshState.bind(this);
    this.registerColumn.bind(this);
    this.registerRow.bind(this);
    this.updateRowHeight.bind(this);

    // store for existing objects
    this.columns = {};
    this.rows = {};
    this.tasks = {};
    this.users = {};
    this.topics = {};
    this.rowHeight = 10;
    this.newRowHeight = 10;
  }

  registerColumn(column){
    this.columns[column.title] = column;
  }
  
  registerRow(row){
    this.rows[row.id] = row;
  }

  getUserTeam(user){
    return this.state.team;
  }

  updateRowHeight(){
    let x = document.getElementsByClassName('rowsdsahdjkasd');
    let minHeight = 10;
    for(let row of x){
      row.style["min-height"] = "10px";
    } 
    for(let row of x){
      if(minHeight < row.clientHeight){
        minHeight = row.clientHeight;
      }
    } 
    minHeight+=5;
    for(let row of x){
      row.style["min-height"] = minHeight+"px";
    } 
  }

  registerTask(task){
    this.columns[task.id] = task;
  }

  renderTitle(){
    if(this.state.name){
      return(
        this.state.name
        );
    }
    return(
      "TITLE N/A"
      );
  }

  renderProgress(){
    try{
      if(this.state.columns["Done"]){

        let tasksIds = [];
        let tasksQuantity = 0;
        let tasksDoneQuantity = 0;
        let tasksCompletePercentage = 0;
  
        tasksIds = Object.keys(this.state.tasks);
        
        tasksIds.forEach( (task_id, index) => {
          if(this.state.tasks[task_id].column == this.state.columns["Done"].id){
            tasksDoneQuantity++;
          }
        });
  
        tasksQuantity = tasksIds.length;
  
        tasksCompletePercentage = parseInt(""+( (tasksDoneQuantity/tasksQuantity ) * 100));
  
        return(
          <div>
            <ProgressBar animated now={tasksCompletePercentage} style={{"color": "black", "backgroundColor": "darkblue"}} label={"Progress"}/>
          </div>
        );
      }
    }catch(e){
      console.error("Board: renderProgress");
    }
    
    return "";
  }

  componentDidMount(){
    this.refreshState();
  }

  refreshState(){
    axios
    .get("http://localhost:8000/kanban/return-boards/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
    .then( (response) => {
      this.parseBoardToState(response.data[0]);
    })
    .catch( (error) => {
      console.error(error);
      //this.parseBoardToState(mock_response);
    });
  }

  parseBoardToState(board){
    this.id = board.id;

    const new_state = {
      name: board.name,
      columnOrder: JSON.parse(board.columnOrder),
      columns: {},
      columnsArray: board.columns,
      rows: {},
      rowsArray: [],
      tasks: {},
      tasksArray: [],
      users: {},
      usersArray: board.teams[0].users,
      topics: {},
      topicsArray: board.topics,
      team: board.teams[0]
    };

    board.teams[0].users.forEach((user, index) => {
      new_state.users[user.id] = user;
    });

    board.topics.forEach((topic, index)=>{
      new_state.topics[""+topic.id] = topic;
    });

    board.columns.forEach((column, index)=>{
      new_state.columns[column.title] = column;
      new_state.columns[column.title].taskOrder = JSON.parse(column.taskOrder);
    });

    board.columns.forEach((column, index)=>{
      column.tasks.forEach((task, index)=>{
        new_state.tasks[""+task.id] = task;
        new_state.tasks[""+task.id].id = ""+new_state.tasks[""+task.id].id;
      });
    });

    new_state.tasksArray = Object.values(new_state.tasks);

    board.columns.forEach((column, index)=>{
      board.topics.forEach((topic, index)=>{
        let new_row = {
          id: "column_"+column.id+"-topic_"+topic.id,
          topic: topic,
          column: column,
        }
        new_state.rowsArray.push(new_row);
      });
    });

    new_state.rowsArray.forEach( (row, index)=>{
      new_state.rows[""+row.id] = row;
    });

    this.setState(new_state);
  }

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    
    if(!destination){
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let formData = new FormData();

    if (type === 'board') {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      };

      formData.append("board_id", this.id);
      formData.append("current_columnOrder", JSON.stringify(this.state.columnOrder) );
      formData.append("new_columnOrder", JSON.stringify(newColumnOrder) );

      axios.post("http://localhost:8000/kanban/column-ordering-update/", formData, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
          this.refreshState();
      })
      .catch( (error) => {
      });

      this.setState(newState);
      return;
    }

    const newState = {
      ...this.state
    };
    const home = this.state.rows[source.droppableId];
    const foreign = this.state.rows[destination.droppableId];
    let task = this.state.tasks[draggableId];

    // same row / same col
    if (home === foreign) {
      const newtaskOrder = Array.from(home.column.taskOrder);
      newtaskOrder.splice(source.index, 1);
      newtaskOrder.splice(destination.index, 0, draggableId);

      formData.append("task_id", draggableId);
      formData.append("column_id", home.column.id);
      formData.append("current_taskOrder", JSON.stringify(home.column.taskOrder));
      formData.append("new_taskOrder", JSON.stringify(newtaskOrder));


      axios.post("http://localhost:8000/kanban/tasks-ordering-update-one-column/", formData, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
          this.refreshState();
      })
      .catch( (error) => {
      });

      newState.columns[home.column.title].taskOrder = newtaskOrder;
      newState.columnsArray = Object.values(newState.columns);

      this.setState(newState);
      return;
    }


    // diff row / same col
    if (home.column.title == foreign.column.title) {
      const newtaskOrder = Array.from(home.column.taskOrder);
      newtaskOrder.splice(source.index, 1);
      newtaskOrder.splice(destination.index, 0, draggableId);

      formData.append("task_id", draggableId);
      formData.append("new_topic", foreign.topic.id);
      formData.append("source_column_id", home.column.id);
      formData.append("destination_column_id", home.column.id);
      formData.append("source_column_taskorder", JSON.stringify(home.column.taskOrder));
      formData.append("new_source_column_taskorder", JSON.stringify(newtaskOrder));
      formData.append("destination_column_taskOrder", JSON.stringify(home.column.taskOrder));
      formData.append("new_destination_column_taskOrder", JSON.stringify(newtaskOrder));

      axios.post("http://localhost:8000/kanban/tasks-ordering-update-two-columns/", formData, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
          this.refreshState();
      })
      .catch( (error) => {
      });

      newState.columns[home.column.title].taskOrder = newtaskOrder;
      newState.columnsArray = Object.values(newState.columns);
      
      newState.tasks[task.id].topic = foreign.topic.id;
      newState.tasksArray = Object.values(newState.tasks);

      this.setState(newState);
      return;
    }

    // diff row/ diff col
    if(this.columns[foreign.column.title].addTaskPossible(task, true)){
      const hometaskOrder = Array.from(home.column.taskOrder);
      hometaskOrder.splice(source.index, 1);

      const foreigntaskOrder = Array.from(foreign.column.taskOrder);
      foreigntaskOrder.splice(destination.index, 0, draggableId);

      formData.append("task_id", draggableId);
      formData.append("new_topic", foreign.topic.id);
      formData.append("source_column_id", home.column.id);
      formData.append("destination_column_id", foreign.column.id);
      formData.append("source_column_taskorder", JSON.stringify(home.column.taskOrder));
      formData.append("new_source_column_taskorder", JSON.stringify(hometaskOrder));
      formData.append("destination_column_taskOrder", JSON.stringify(foreign.column.taskOrder));
      formData.append("new_destination_column_taskOrder", JSON.stringify(foreigntaskOrder));

      axios.post("http://localhost:8000/kanban/tasks-ordering-update-two-columns/", formData, {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
          this.refreshState();
      })
      .catch( (error) => {
      });
      
      newState.columns[home.column.title].taskOrder = hometaskOrder;
      newState.columns[foreign.column.title].taskOrder = foreigntaskOrder;
      newState.columnsArray = Object.values(newState.columns);

      newState.tasks[task.id].topic = foreign.topic.id;
      newState.tasksArray = Object.values(newState.tasks);

      this.setState(newState);
      return;
    }
  };

  deleteColumn(column){
    axios.delete("http://localhost:8000/kanban/column-delete/"+column.id+"/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
    .then(res => {
        this.refreshState();
    });
  }

  deleteTask(task){
    axios.delete("http://localhost:8000/kanban/task-delete/"+task.id+"/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
        this.refreshState();
      });
  }
  deleteTopic(topic){
    
    axios.delete("http://localhost:8000/kanban/topic-delete/"+topic+"/", {headers: {"Authorization": "Token "+getCookie("auth_token")}})
      .then(res => {
        this.refreshState();
      });
  }

  render() {
    if(!loggedIn()){
      return (<NotLoggedInfo>Please login first</NotLoggedInfo>);
    }
    return (
      <BoardContext.Provider value={this}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="board"
          >
            {provided => (
              <Container
                {...provided.droppableProps}
                ref={provided.innerRef}
              >

                <BoardUpBar>

                  <BoardInfo>
                    <BoardTitle>
                      {this.renderTitle()}
                    </BoardTitle>
                    <EditBoardButton board={this} name={this.state.name}>
                    </EditBoardButton>

                  </BoardInfo>

                  <BoardProgress>
                    {this.renderProgress()}
                  </BoardProgress>

                </BoardUpBar>
                <BoardContent>
                  <BoardContentWrapper>

                    <ColumnList board={this}>
                    </ColumnList>
                    
                    {provided.placeholder}
                    <div>
                    <AddColumnButton>
                    </AddColumnButton>
                    <AddTopicButton>
                    </AddTopicButton>
                    <DeleteTopicButton topic={this.props.topic} board={this}>
                    </DeleteTopicButton>
                    </div>
                  </BoardContentWrapper>

                </BoardContent>
                <BoardDownBar>
                </BoardDownBar>
            
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </BoardContext.Provider>
    );
  }
}

