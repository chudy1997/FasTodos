import React, { Component } from 'react';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

import fetchTodos from './../../actions/fetchTodos';
import chooseTodo from './../../actions/chooseTodo';

import ajax from './../../ajax';

import './index.css';

class List extends Component {
    state = {
      input: '',
      date: moment(),
      // blockedDate: false
    };

    componentDidMount = () => {
      ajax('GET', 'todos', 5, 1000, todos => {
        this.props.fetchTodos(todos.sort((a, b) => a.deadline - b.deadline));
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
    };

    handleSubmit = (e) => {
      e.preventDefault();
      const text = this.state.input.trim();
      if (text.length > 0){
        const todos = this.props.todos;
        let categoryId = this.getCategoryId();
        if (categoryId === 0) 
        {categoryId = 1;}

        ajax('POST', `todos/new?text=${text}&categoryId=${categoryId}`, 5, 1000, res => {
          const newTodo = { todoId: res.insertId, text: text, categoryId: categoryId, finished: false };
          todos.unshift(newTodo);
          this.props.fetchTodos(todos);
        }, 
        () => {
          alert('Could not add new todo...');
        });

        this.setState({ input: '' });
      }
    };

    handleChange = (e) => this.setState({ input: e.target.value });

    handleExpand = (todo) => {
      this.props.chooseTodo(this.props.chosenTodoId !== todo.todoId ? todo.todoId : -1);
      if(todo.deadline === null){
        this.setState({ date: moment() });
        //maybe make state bool that will make button instead moment()
        //and if you click button calendar will appear
      }
      else {
        this.setState({ date: moment(todo.deadline) });
      }
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

       confirmAlert({
         title: 'Confirm to submit',
         message: 'Are you sure to remove this todo?',
         buttons: [
           {
             label: 'Yes',
             onClick: () => {
               const todos = this.props.todos;

               ajax('POST', `todos/delete?id=${todo.todoId}`, 5, 1000, () => {
                 todos.splice(todos.findIndex(t => t.todoId === todo.todoId), 1);
                 this.props.fetchTodos(todos);
               }, 
               () => {
                 alert('Could not delete todo...');
               });
             }
           },
           {
             label: 'No'
           }
         ]
       });
     };

    selectCategory = (categoryId, todo) => {
      categoryId = parseInt(categoryId)

      const todos = this.props.todos;
      const oldCategoryId = todo.categoryId;
      todo.categoryId = categoryId;

      this.fetchChangedTodos(todos, todo);

      ajax('POST', `todos/changeCategory?todoId=${todo.todoId}&categoryId=${categoryId}`, 5, 1000, () => {},
        () => {
          alert('Could not change todo\'s category...');
          todo.categoryId = oldCategoryId;
          this.fetchChangedTodos(todos, todo);
        });
    };

    handleChangeDate = (dateFromInput) => {
      this.setState({
        date: dateFromInput
      });
    };

    changeTodoDeadline = (todo,e) => {
      const oldDeadline = todo.deadline
      // toddddo.deadline = dateFromInput.format("YYYY-MM-DD HH:mm:ss")
      todo.deadline = this.state.date.unix()
      this.fetchChangedTodos(this.props.todos, todo);
      ajax('POST', `todos/changeDeadline?todoId=${todo.todoId}&deadline=${todo.deadline}`, 5, 1000, () => {},
        () => {
          alert('Could not change todo\'s deadline...');
          todo.deadline = oldDeadline;
          this.fetchChangedTodos(this.props.todos, todo);
        });
    }

    createTodos = (finished) => {
      const categoryId = this.getCategoryId();
      const todos = this.props.todos.filter(todo => categoryId === 0 || todo.categoryId === categoryId);
      return todos.filter(todo => todo.finished == finished).map(todo => {
        const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
        const className = this.props.chosenTodoId == todo.todoId ? 'todo chosen-todo' : 'todo';

        return (
          <li
            className={className}
            id={todo.todoId}
            key={todo.todoId}
            onClick={() => {
                this.handleExpand(todo);
                e.stopPropagation();
            }}
            onSelect={()=> {
              this.focus();
            }}
            style={{ backgroundColor: backgroundColor }}
          >
            <input
              checked={todo.finished ? 'checked' : ''}
              className='check'
              onClick={(e) => this.handleCheck(e, todo)}
              type='checkbox'
            />
            {todo.text}
            <button
              className="buttonstyle"
              hidden={this.props.chosenTodoId === todo.todoId ? '' : 'hidden'}
              onClick={(e) => this.handleDelete(e, todo)}
            >
              {'✘'}
            </button>
            <div className="panel">
              <p className={this.props.chosenTodoId === todo.todoId ? 'view' : 'noview'}>
                <form className="Select"
                      onClick={e => {
                        // alert("test inner");
                        //add block for other click action
                        this.state.blockedDate=true;
                        e.stopPropagation();
                      }}
                >
                  <DatePicker
                    inline
                    selected={this.state.date}
                    onChange={this.handleChangeDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={3}
                    dateFormat="LLL"
                    timeCaption="time"
                    dateFormatCalendar={" "}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </form>
                <select
                  className="Select"
                  onChange={(e) => this.selectCategory( e.target.value,todo)}
                  onClick={e => e.stopPropagation()}
                  value={todo.categoryId}
                >
                  {this.props.categories.map(category => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >{ category.categoryName }</option>))}
                </select>             <button
                className="buttonstyle"
                hidden={this.props.chosenTodoId === todo.todoId ? '' : 'hidden'}
                onClick={(e) => this.changeTodoDeadline(todo,e)}
              >
                {'Accept'}
              </button>
              </p>
            </div>
          </li>);
      });
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
        <div className='todos-wrapper'>
          <ul className='todos'>
            {this.createTodos(false)}
          </ul>
          <hr className="todos-split" />
          <ul className='todos'>
            {this.createTodos(true)}
          </ul>
        </div>
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
