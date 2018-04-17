import React, { Component } from 'react';
import Categories from './../../containers/categories';
import Todos from './../../containers/todos';

export default class Main extends Component {
    render() {
        return (
            <div className='main'>
                <Categories />
                <Todos />
            </div>
        );
    }
}
