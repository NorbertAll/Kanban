import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  background-color: #14132b;
  
`;

const AppContent = styled.div`
  margin: auto;
  background-color: #14132b;
`;

export default class Boardapp extends React.Component{
  render(){
    return(
     
     
     <AppWrapper>
        
        <AppContent>
        
          <Board>

          </Board>
        </AppContent>
      </AppWrapper>
    );
  }
}