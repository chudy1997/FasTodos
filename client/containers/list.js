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
            alert('Could not fetch todos from db with 5 tries at maximum 6 sec...');
        });
    };

    handleSubmit = (e) => {
        const text = this.state.input.trim();
        if (text.length > 0){
            const todos = this.props.todos;
            let categoryId = this.getCategoryId();
            if (categoryId===0) 
                categoryId=1;

            ajax('POST', `todos/new?text=${text}&categoryId=${categoryId}`, 5, 1000, res => {
                const newTodo = { todoId: res.insertId, text: text, categoryId: categoryId };
                todos.unshift(newTodo);
                this.props.fetchTodos(todos);
            }, 
            () => {
                alert('Could not add new todo to db with 5 tries at maximum 6 sec...');
            });

            this.setState({ input: '' });
        }
        e.preventDefault();
    }

    getCategoryId = () => {
        const category = this.props.categories[this.props.chosenCategoryId];
        return category ? category.categoryId : 0;
    }

    createTodos = () => {
        let id = -1;
        const categoryId = this.getCategoryId();
        const todos = this.props.todos.filter(todo => categoryId === 0 || todo.categoryId === categoryId);

    return todos.map(todo => {
      id += 1;
      const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
      const className = this.props.chosenTodoId == id ? 'todo chosen-todo' : 'todo';

        return <li
            className={className}
            id={id}
            key={id}
            onClick={this.chooseTodo}
            style={{backgroundColor: backgroundColor}}
        >
            {todo.text}
            <button
                onClick={(e) => this.handleDelete(e, todo.todoId)}
                className="buttonstyle"
            >
                {'✘'}
            </button>
            <button
                onClick={(e) => this.handleExpand(e, todo.todoId)}
                className="buttonstyle"
            >
                {'▼'}
            </button>
            <button
                onClick={(e) => this.handleCheck(e, todo.todoId)}
                className="buttonstyle"
            >
                {todo.finished ? '✔' : '-'}
            </button>
            <div className="panel">
                <p className={todo.clicked == 1 ? 'view' : 'noview'}>
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

    handleChange = (e) => this.setState({ input: e.target.value });
    chooseTodo = (e) => this.props.chooseTodo(e.target.id);

    handleExpand= (e, todoId) => {

        const todos = this.props.todos;
        const todo = todos.find(todo => todo.todoId === todoId);
        if (todo.clicked !== 1) {
            todo.clicked = 1;
        } else {
            todo.clicked = 0;
        }

        const index = todos.findIndex(t => t.todoId === todoId);
        let newTodo={};
        Object.assign(newTodo,todo);
        todos[index] = newTodo;
        this.props.fetchTodos(todos);

    };

    handleCheck = (e, todoId) => {
        const todos = this.props.todos;
        const todo = todos.find(todo => todo.todoId === todoId);
        const newFinishedValue = todo.finished ? 0 : 1;
        todo.finished = newFinishedValue;
        ajax('POST', `todos/finish?id=${todo.todoId}&value=${newFinishedValue}`, 5, 1000, () => {}, 
        () => {
            alert('Could not check todo in db with 5 tries at maximum 6 sec...');
        });

        const index = todos.findIndex(t => t.todoId === todoId);
        let newTodo={};
        Object.assign(newTodo,todo);
        todos[index] = newTodo;
        this.props.fetchTodos(todos);
    };

     handleDelete = (e,todoId) => {
          if (confirm("Are you sure that you want to delete this todo?")) {
              const todos = this.props.todos;
              const todo = todos.find(todo => todo.todoId === todoId);

              ajax('POST', `todos/delete?id=${todo.todoId}`, 5, 1000, () => {}, 
              () => {
                  alert('Could not delete todo from db with 5 tries at maximum 6 sec...');
              });

              const index = todos.findIndex(t => t.todoId === todoId);
              todos.splice(index,1);
              this.props.fetchTodos(todos);
          }
     };


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

function matchDispatchToProps(dispatch){
  return bindActionCreators(
    {
      fetchTodos: fetchTodos,
      chooseTodo: chooseTodo
    }, 
    dispatch
  );
}



export default connect(mapStateToProps, matchDispatchToProps)(List);