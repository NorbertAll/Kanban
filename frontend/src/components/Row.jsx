import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import AddTaskButton from "./AddTask";
import BoardContext from "./BoardContext";
import DeleteTopicButton from "./DeleteTopicButton";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  border: solid 2px #232149;
  background-color: #14132b;
`;

    const Wrapper = styled.div`
    `;

        const RowUpBar = styled.div`
          display: flex;
          flex-direction: row;
          padding 5px;
          border-radius: 15px 15px 0px 0px;
        `;

            const RowTitle = styled.div`
              font-size: 100%;
              color: #0778ab;
            `;

            const RowTitleSpacing = styled.div`
              margin: auto;
              padding: 5px;
            `;

            const RowLimitInfo = styled.div`
              padding: 5px;
            `;

        const RowContent = styled.div`
          margin: 0px 5px 0px 5px;
          padding: 2px 0px 2px 0px;
          border-radius: 5px;
          &:hover {
            background-color: #232149;
          }
        `;

            const TaskList = styled.div`
              flex-grow: 1;
            `;

        const RowDownBar = styled.div`
          display: flex;
          flex-direction: row;
          background-color: #3c387e;
          border-radius: 0px 0px 15px 15px;
        `;

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    /*
    if (nextProps === this.props) {
      return false;
    }
    */
    return true;
  }
  render() {
    const {tasks, tasksArray} = this.props.board.state;
  
    return(
      this.props.row.column.taskOrder.map( (task_id, index)=>{
        let task = tasks[task_id];
        if(task.topic == this.props.row.topic.id){
          let user = this.props.board.state.users[task.user];
          return <Task key={task.id} task={task} index={index} user={user} board={this.props.board}/>
        }
        return;
      })
    );
  }
}

export default class Row extends React.Component {
  constructor(props){
    super(props);
    this.id = "";
    this.updateId();
    this.containerRef = React.createRef();
  }

  shouldComponentUpdate(){
    return true;
  }

  updateId(){
    this.id = "column_"+this.props.row.column.id+"-topic_"+this.props.row.topic.id;
  }

  registerOnBoard(board){
    board.registerRow(this);
  }

  renderTitle(){
    if(this.props.row.topic.title){
      return(
        this.props.row.topic.title
        );
    }
    return(
      "TITLE N/A"
      );
    
  }

  componentDidMount(){
    this.props.board.updateRowHeight(this.getHeight());
  }

  componentDidUpdate(){
    this.props.board.updateRowHeight();
  }

  getHeight(){
    return document.getElementById("container"+this.id).clientHeight;
  }

  render() {
    return (
      <BoardContext.Consumer>
        {(value) => 
              <Container id={"container"+this.id} ref={this.containerRef} style={{"minHeight" : value.rowHeight+"px"}} className={"rowsdsahdjkasd"}>
                {this.registerOnBoard(value)}
                <Wrapper>
                  <RowUpBar>
                  
                    <RowTitle>
                      {this.renderTitle()}
                    </RowTitle>
                    <RowTitleSpacing>
                    </RowTitleSpacing>
                  </RowUpBar>
                  
                  <RowContent style={{"minHeight": "10px"}}>
                    <Droppable droppableId={"column_"+this.props.row.column.id+"-topic_"+this.props.row.topic.id} type="row" >
                      {(provided, snapshot) => (
                        <TaskList
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          isDraggingOver={snapshot.isDraggingOver}
                        >
                          <InnerList board={this.props.board} row={this.props.row}/>
                          {provided.placeholder}
                        </TaskList>
                      )}
                    </Droppable>
                  </RowContent>

                </Wrapper>
              </Container>
        }
      </BoardContext.Consumer>
    );
  }

}
