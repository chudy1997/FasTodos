import React, { Component } from 'react';
import $ from 'jquery';

class List extends Component {
  state = {
    input: ''
  };

  ajaxGetTodos = (triesLeft,timeout,errCallback) => {
    // alert("start ajax try"+triesLeft+'with timeout'+timeout);
    let thisOut = this;
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8000/todos',
      timeout: timeout,
      success: todos => {
        thisOut.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId));
        thisOut.todos = todos;
      },
      error: function(xhr, textStatus, errorThrown){
        // alert('request failed:'+xhr+','+textStatus+','+errorThrown);
        if (triesLeft > 0){
          thisOut.ajaxGetTodos(triesLeft-1,timeout+1000);
        }
        else{
          errCallback();
        }
      }
    });

  };

  componentDidMount = () => {
    // previous version:
    // $.get('http://localhost:8000/todos').then(todos => {
    //   this.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId));
    //   this.todos = todos;
    // });

    //try 5 times starting at 1000ms timeout
    this.ajaxGetTodos(5,1000,() => {
      alert('could not fetch todos from db with 5 tries at maximum 6 sec');
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
        const newTodo = todo.assign();
        todos[index] = newTodo;
        this.props.fetchTodos(todos);

    };

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
