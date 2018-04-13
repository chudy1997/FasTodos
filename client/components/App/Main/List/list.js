import React, { Component } from 'react';
import './list.scss';
import Input from "./Input/input";

class List extends Component {
    state = {
      todos: [],
      chosenTodoId: '0',
      text : ' '
    };

    componentDidMount(){
        $.get('http://localhost:8000/todos').then((res) => this.setState({todos: res}));
        
        this.chooseTodo = (e) => {
            this.setState({chosenTodoId: e.target.id})
        }


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(){
        $.get('http://localhost:8000/todos').then((res) => this.setState({todos: res}));

    }

    handleChange(e) {
        this.setState({ text: e.target.value});
    }

    handleSubmit() {
        $.post('http://localhost:8000/todos/new?text='.concat(this.state.text)).then(console.log("saved"));


    }

    render() {
        return (
            <span className='list-span'>
            <form onSubmit={this.handleSubmit} >
                <input type="text"  onChange={this.handleChange} value={this.state.text} className="input-area"/>
            </form>
            <ol className='list'>

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
