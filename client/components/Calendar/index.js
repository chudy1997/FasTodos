import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import 'react-week-calendar/dist/style.css';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const moment = require('moment');

import ajax from './../../ajax';
import colorMap from './../../constants/colorMap';

import fetchTodos from './../../actions/fetchTodos';
import chooseTodo from './../../actions/chooseTodo';

import CalendarTodo from './../CalendarTodo';
import WeekCalendar from './../WeekCalendar';

import './index.css';

class Calendar extends Component {
    state = {
      firstDay: moment().startOf('week').add(1, 'days'),
      draggedTodo: { },
    };

    componentDidMount = () => {
      ajax('GET', 'todos', 5, 1000, todos => {
        this.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId));
      },
      () => {
        alert('Could not fetch todos from db with 5 tries at maximum 6 sec...');
      });
    };

    onRightArrowClick = e => {
      this.setState({ firstDay: moment(this.state.firstDay).add(1, "week") });
    };

    onLeftArrowClick  = e => {
      this.setState({ firstDay: moment(this.state.firstDay).subtract(1, "week") });
    };

    render = () => {
      return (
        <div className='calendar'>
          <div className="calendar-switch">
            {this.props.toggle}
            <span
              className='switch switch-left'
              onClick={this.onLeftArrowClick}
            >
              <i className="arrow arrow-left" />
            </span>
            <label className='date start'>{this.state.firstDay.format('ddd DD.MM').toString()}</label>
            <label className='hyphen'>-</label>
            <label className='date end'>{moment(this.state.firstDay).add(6, 'days').format('ddd DD.MM').toString()}</label>
            <span
              className='switch switch-right'
              onClick={this.onRightArrowClick}
            >
              <i className="arrow arrow-right" />
            </span>
          </div>
          <div className='week-calendar'>
            {<WeekCalendar
              categories={this.props.categories}
              chosenCategoryId={this.props.chosenCategoryId}
              colorMap={colorMap}
              draggedTodo={this.state.draggedTodo}
              fetchTodos={this.props.fetchTodos}
              firstDay={this.state.firstDay}
              todos={this.props.todos}
            />}
          </div>
          <div className="todos-without-deadline-wrapper">
            <ul className="todos-without-deadline">
              { this.props.todos.filter(todo => !todo.deadline).map(todo => (
                <CalendarTodo
                  draggedTodo={this.state.draggedTodo}
                  setDraggedTodo={(draggedTodo) => { this.setState({ draggedTodo: draggedTodo });}}
                  todo={todo}
                />
              ))}
            </ul>
          </div>
        </div>
      );
    }
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



export default connect(mapStateToProps, matchDispatchToProps)(DragDropContext(HTML5Backend)(Calendar));
