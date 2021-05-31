import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

import Navbar from './components/leftMenu/Navbar'; 
import Menu from './components/topMenu/Menu';
import Board from './components/Board';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Boardapp from './Boardapp';
import Teamapp from './Teamapp';
import Userapp from './Userapp';
import Welcome from './Welcome';
import Login from './Login';
import Register from './Register';
export default class App extends React.Component{
  render(){
    return(
      <div>
      
      <Router>
        <div>
          <Navbar />
          <Menu />
       </div>
        
        <Switch>
          <Route path='/' exact component={Welcome} />
          <Route path='/board' component={Boardapp} />
          <Route path='/team' component={Teamapp} />
          <Route path='/user' component={Userapp} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
      </Router>
    </div>
    );
  }
}