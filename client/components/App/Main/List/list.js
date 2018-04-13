import React, { Component } from 'react';
import './list.scss';
import Input from "./Input/input";

class List extends Component {
    state = {
      todos: [],
      chosenTodoId: '0'
    };

    componentDidMount(){
        $.get('http://localhost:8000/todos').then((res) => this.setState({todos: res}));
        
        this.chooseTodo = (e) => {
            this.setState({chosenTodoId: e.target.id})
        }
    }

    render() {
        return (
            <span className='list-span'>
            <ol className='list'>
            <Input/>
            {
                this.state.todos.map((todo) => <li id={todo.todoId} key={todo.todoId} onClick={this.chooseTodo} 
                    className={this.state.chosenTodoId == todo.todoId ? 'list-element chosen-list-element': 'list-element'}>{todo.text}</li>)
            }
            </ol>
            </span>
        );
    }
}

export default List;
