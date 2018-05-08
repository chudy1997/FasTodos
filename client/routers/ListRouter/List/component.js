import React, { Component } from 'react';
import $ from 'jquery';

class List extends Component {
    state = {
      input: ''
    }


  componentDidMount = () => {
    $.get('http://localhost:8000/todos').then(todos => {
      this.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId));
      this.todos = todos;
    });
  };


    handleSubmit = (e) => {
      let text = this.state.input.trim();
      if (text.length > 0){
        let todos = this.props.todos;
        let categoryId = this.getCategoryId();
        if (categoryId===0) {categoryId=1;} //if category not selected, first category in db -> newTask category
        $.post(`http://localhost:8000/todos/new?text=${text}&categoryId=${categoryId}`);
        let newTodo = { text: text, categoryId: categoryId };
        todos.unshift(newTodo);
        this.props.fetchTodos(todos);
    
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
    this.todos = this.props.todos.filter(todo => categoryId === 0 || todo.categoryId === categoryId);

    return this.todos.map(todo => {

      id += 1;
      const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
      const className = this.props.chosenTodoId == id ? 'todo chosen-todo' : 'todo';
      const buttonStyle = {
        margin: '10px 10px 10px 10px',
        fontSize: 'inherit',
        fontWeight: 'bold',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        //border: 0,
        color: '#232323',
        backgroundColor: '#B2B2B2',
      };
      return (
        <li
          className={className}
          id={id}
          key={id}
          onClick={this.chooseTodo}
          style={{ backgroundColor: backgroundColor }}
        >
          {todo.text}
          <button
            onClick={(e) => this.handleCheck(e, todo.todoId)}
            style={buttonStyle}
          >
            {todo.finished ? '✔' : '_'}
          </button>
          <button
            onClick={(e) => this.handleDelete(e, todo.todoId)}
            style={buttonStyle}
          >
            {'✘'}
          </button>
        </li>
      );
    });
  }

    handleChange = (e) => this.setState({ input: e.target.value });
    chooseTodo = (e) => this.props.chooseTodo(e.target.id);

    handleCheck = (e, todoId) => {
        const todos = this.props.todos;
        const todo = todos.find(todo => todo.todoId === todoId);
        if (todo.finished !== 1) {
            $.post(`http://localhost:8000/todos/finish?id=${todo.todoId}&value=1`);
            todo.finished = 1;
        } else {
            $.post(`http://localhost:8000/todos/finish?id=${todo.todoId}&value=0`);
            todo.finished = 0;
        }

        const index = todos.findIndex(t => t.todoId === todoId);
        const newTodo = todo.assign();
        todos[index] = newTodo;
        this.props.fetchTodos(todos);
    };

     handleDelete = (e,todoId) => {
          if (confirm("Are you going to delete this todo")) {
              const todos = this.props.todos;
              const todo = todos.find(todo => todo.todoId === todoId);
              $.post(`http://localhost:8000/todos/delete?id=${todo.todoId}`);

              const index = todos.findIndex(t => t.todoId === todoId);
              todos.splice(index,1);
              const newTodo = todo.assign();
              todos[index] = newTodo;
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

export default List;
