import React, { Component } from 'react';
import './header.scss';

class Header extends Component {
    render() {
        return (
            <div className='header'>
                <p className='name'>FasTodos</p>
            </div>
        );
    }
}

export default Header;
