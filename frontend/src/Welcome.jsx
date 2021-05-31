import React from 'react';
import Boardapp from './Boardapp';
import Teamapp from './Teamapp';
import Userapp from './Userapp';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import './index.css';
const AppWelcome = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  background-color: #14132b;
  color: white;
  text-align: center;
  
`;
const AppText = styled.h1`
  color: white;
  text-align: center;
  top: 50vh;
  color: #f5f5f5;
`;

const Title = styled.div`
    text-align:center;
    color:white;
    font-size: 80px;
    
`;
export default class Welcome extends React.Component{
  render(){
    return(
        <AppWelcome>
          <AppText>
            <div className='welcom'>
            <br/><br/><br/><br/>
            <Title>Welcome to our kanban page </Title>
            <Link to={'/login'}>
                <span>{'Log in'}</span>
            </Link>
            </div>
            </AppText>
        </AppWelcome>
    );
  }
}  