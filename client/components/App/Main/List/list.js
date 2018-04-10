import React, { Component } from 'react';
import './list.scss';

class List extends Component {
    state = {
      todos: []
    };

    componentDidMount(){
        $.get('http://localhost:8000/todos').then((res) => this.setState({todos: res}));
    }

    render() {
        return (
            <div className='list'>
            <ol>
            {
                this.state.todos.map((todo) => <li>{todo.text}</li>)
            }
            </ol>
            </div>
        );
    }
}

export default List;
