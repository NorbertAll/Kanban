import React, {Component}  from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./Button"
import {setCookie, getCookie, loggedIn} from '../Helpers';
import './Menu.css'

class Menu extends Component {
    handleClick = () => {
        setCookie('auth_token', 'xx', 0);
        window.location.assign("/board");
    }

    render() {
        return(
            <nav className="NavbarItems">
                <Link to={"/"}>
                    <h1 className="navbar-logo">Kanban<i className="fab fa-react"></i></h1>
                </Link>
                {!loggedIn() && 
                    <Button><Link to={'/login'}>
                        <span>{'LOGIN'}</span>
                    </Link></Button> 
                }
                {!loggedIn() && 
                    <Button><Link to={'/register'}>
                        <span>{'REGISTER'}</span>
                    </Link></Button>
                }
                {loggedIn() && 
                    <Button onClick={this.handleClick}>
                        <span>{'LOGOUT'}</span>
                    </Button>
                }
                
            </nav>
        )
    }
}

export default Menu