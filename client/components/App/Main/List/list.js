import React, { Component } from 'react';
import './list.scss';

class List extends Component {
    state = {
      todos: [],
      chosenTodoId: '0',
      input : ' '
    };

    componentDidMount(){

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        $.get('http://localhost:8000/todos').then((res) => this.setState({todos: res}));
        
        this.chooseTodo = (e) => {
            this.setState({chosenTodoId: e.target.id});
            this.handleFinished(e);
        }
    }


    getList(){
        $.get('http://localhost:8000/todos').then((res) => this.setState({ todos: res }));

    }


    handleChange(e) {
        this.setState({ input: e.target.value});
    }

    handleSubmit(e) {
        $.post('http://localhost:8000/todos/new?text='.concat(this.state.input)).then();
        let todos = this.state.todos;
        var val = {text:this.state.input , todoId : todos.length+1};
        todos.push(val);
        this.setState({chosenTodoID: e.target.id});
        e.preventDefault();

    }



    render() {
        return (
            <span className='list-span'>
            <form onSubmit={this.handleSubmit} className="input">
                <input type="text"  onChange={this.handleChange} value={this.state.input} className="input-area"/>
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
