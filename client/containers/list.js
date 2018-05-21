import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fetchTodos from './../actions/fetchTodos'
import chooseTodo from './../actions/chooseTodo';

import ajax from './../ajax';

class List extends Component {
    state = {
        input: ''
    }

    componentDidMount = () => {
        ajax('GET', 'todos', 5, 1000, todos => {
            this.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId).sort((a, b) => a.finished < b.finished ? -1 : 1));
        }, 
        () => {
            alert('Could not fetch todos...');
        });
    };

    fetchChangedTodos(todos, todo){
        const index = todos.findIndex(t => t.todoId === todo.todoId);
        todos[index] = {
            ...todo
        };
        this.props.fetchTodos(todos);
    }

    getCategoryId = () => {
        const category = this.props.categories[this.props.chosenCategoryId];
        return category ? category.categoryId : 0;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const text = this.state.input.trim();
        if (text.length > 0){
            const todos = this.props.todos;
            let categoryId = this.getCategoryId();
            if (categoryId === 0) 
                categoryId = 1;

            ajax('POST', `todos/new?text=${text}&categoryId=${categoryId}`, 5, 1000, res => {
                const newTodo = { todoId: res.insertId, text: text, categoryId: categoryId };
                todos.unshift(newTodo);
                this.props.fetchTodos(todos);
            }, 
            () => {
                alert('Could not add new todo...');
            });

            this.setState({ input: '' });
        }
    }

    handleChange = (e) => this.setState({ input: e.target.value });

    handleExpand = (todo) => {
        this.props.chooseTodo(this.props.chosenTodoId !== todo.todoId ? todo.todoId : -1);
    };

    handleCheck = (e, todo) => {      
        e.stopPropagation();
        const todos = this.props.todos;
        const oldValue = todo.finished;
        const newValue = oldValue ? 0 : 1;

        todo.finished = newValue;
        this.fetchChangedTodos(todos, todo);
        ajax('POST', `todos/finish?id=${todo.todoId}&value=${newValue}`, 5, 1000, () => {}, 
        () => {
            alert('Could not check todo...');
            todo.finished = oldValue;
            this.fetchChangedTodos(todos, todo);
        });
    };

     handleDelete = (e, todo) => {
        e.stopPropagation();
        if (confirm("Are you sure that you want to delete this todo?")) {
            const todos = this.props.todos;

            ajax('POST', `todos/delete?id=${todo.todoId}`, 5, 1000, () => {
                todos.splice(todos.findIndex(t => t.todoId === todo.todoId), 1);
                this.props.fetchTodos(todos);
            }, 
            () => {
                alert('Could not delete todo...');
            });
        }

        return false;
    };

    createTodos = () => {
        const categoryId = this.getCategoryId();
        const todos = this.props.todos.filter(todo => categoryId === 0 || todo.categoryId === categoryId);

        return todos.map(todo => {
            const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
            const className = this.props.chosenTodoId == todo.todoId ? 'todo chosen-todo' : 'todo';

            return <li
                className={className}
                id={todo.todoId}
                key={todo.todoId}
                onClick={() => this.handleExpand(todo)}
                style={{backgroundColor: backgroundColor}}
            >
                {todo.text}
                <button
                    onClick={() => this.handleDelete(e, todo)}
                    className="buttonstyle"
                >
                    {'✘'}
                </button>
                <button
                    onClick={(e) => this.handleCheck(e, todo)}
                    className="buttonstyle"
                >
                    {todo.finished ? '✔' : '-'}
                </button>
                <div className="panel">
                    <p className={this.props.chosenTodoId == todo.todoId ? 'view' : 'noview'}>
                        <form
                            className="form"
                        >
                            {this.props.toggle}
                            <input
                                autoFocus="autofocus"
                                className="input"
                                maxLength="50"
                                onChange={this.handleChange}
                                placeholder="date"
                                type="text"
                                value={this.state.input}
                            />
                            <input
                                autoFocus="autofocus"
                                className="input"
                                maxLength="50"
                                onChange={this.handleChange}
                                placeholder="categorie"
                                type="text"
                                value={this.state.input}
                            />
                        </form>
                    </p>
                </div>
            </li>;
        });
    }

    render = () => (
        <div className='list'>
            <form
                className="form"
                onSubmit={this.handleSubmit}
            >
                {this.props.toggle}
                <input
                    autoFocus="autofocus"
                    className="input"
                    maxLength="50"
                    onChange={this.handleChange}
                    placeholder="What are you going TODO ?"
                    type="text"
                    value={this.state.input}
                />
            </form>
            <ol className='todos'>
                {this.createTodos()}
            </ol>
        </div>
    );
}



function mapStateToProps(state){
    return {
        todos: state.todos,
        chosenTodoId: state.chosenTodoId,
    };
}

export default connect(mapStateToProps, { fetchTodos, chooseTodo })(List);