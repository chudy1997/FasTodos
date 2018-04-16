import React, { Component } from 'react';
import './list.scss';

var CONFIG = require('client/components/App/config.json');

class List extends Component {
  state = {
    todos: [],
    chosenTodoId: '0'
  };


  chooseTodo = (e) => {
    this.setState({ chosenTodoId: e.target.id });
  }


  componentDidMount(){
    $.get(CONFIG.serverUrl+'/todos').then((res) => this.setState({ todos: res }));
  }


  render() {
    return (
      <span className='list-span'>
        <ol className='list'>
          {
            this.state.todos.map((todo) => (<li
              className={this.state.chosenTodoId === todo.todoId ? 'list-element chosen-list-element': 'list-element'}
              id={todo.todoId}
              key={todo.todoId}
              onClick={this.chooseTodo}>
              {todo.text}
            </li>))
          }
        </ol>
      </span>
    );
  }
}

export default List;
