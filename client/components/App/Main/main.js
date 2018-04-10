import React, { Component } from 'react';
import Categories from './Categories/categories';
import List from './List/list';
import './main.scss';

class Main extends Component {
    render() {
        return (
            <div className='main'>
                <Categories />
                <List />
            </div>
        );
    }
}

export default Main;
