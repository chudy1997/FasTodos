import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';

const moment = require('moment');

import ajax from './../../ajax';

import fetchTodos from './../../actions/fetchTodos';
import chooseTodo from './../../actions/chooseTodo';

import './index.css';

class Calendar extends Component {
    state = {
      firstDay: moment().startOf('week').add(1, 'days')
    };

    componentDidMount = () => {
      ajax('GET', 'todos', 5, 1000, todos => {
        this.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId));
      }, 
      () => {
        alert('Could not fetch todos from db with 5 tries at maximum 6 sec...');
      });
    }

    onRightArrowClick = e => {
      this.setState({ firstDay: moment(this.state.firstDay).add(1, "week") });
    };

    onLeftArrowClick  = e => {
      this.setState({ firstDay: moment(this.state.firstDay).subtract(1, "week") });
    };

    getCategoryId = () => {
      const category = this.props.categories[this.props.chosenCategoryId];
      return category ? category.categoryId : 0;
    }

    getSelectedIntervals = () => {
      const intervals = this.props.todos.map(todo => {
        return {
          start: moment(todo.deadline).subtract('30',"minute"),
          end: moment(todo.deadline),
          value: todo.text,
          id: todo.todoId,
          categoryId: todo.categoryId
        };
      });

      return intervals;
    }

    handleEventRemove = (e) => {
      const todos = this.props.todos;
      const todoId = e.id;
      const todo = todos.find(todo => todo.todoId === todoId);

      ajax('POST', `todos/delete?id=${todo.todoId}`, 5, 1000, () => {}, 
        () => {
          alert('Could not delete todo from db with 5 tries at maximum 6 sec...');
        });

      const index = todos.findIndex((interval) => interval.todoId === todoId);
      todos.splice(index,1);
      this.props.fetchTodos(todos);
    }

    handleSelect = (newIntervals) => {
      const text = newIntervals[0].value;
      if (text.length > 0){
        const todos = this.props.todos;
        let categoryId = this.getCategoryId();
        const deadline = newIntervals[0].end.unix();

        if (categoryId === 0)
        {categoryId = 1;}

        ajax('POST', `todos/new?text=${text}&categoryId=${categoryId}&deadline=${deadline}`, 5, 1000, res => {
          const newTodo = { todoId: res.insertId, text: text, categoryId: categoryId, deadline: deadline*1000 };
          todos.unshift(newTodo);
          this.props.fetchTodos(todos);
        }, 
        () => {
          alert('Could not add new todo to db with 5 tries at maximum 6 sec...');
        });
      }
    };

    customEvent = (props) => {
      const classes = `custom-event ${props.categoryId === this.getCategoryId() ? 'match-chosen-category' : 'not-match-chosen-category' }`;
      return (
        <div 
          className={classes}
          style={{ backgroundColor: this.props.colorMap[props.categoryId] }}
        >
          {props.value}
        </div>);
    };

    customDayCell = (props) =>{
      const classes = `custom-day-cell ${props.endTime.unix()*1000 < Date.now() ? 'beforeNow' : 'afterNow' }`;
      return (
        <div 
          className={classes}
          onMouseDown={props.startSelection} />);
    };

    createWeekCalendar = () => (
      <WeekCalendar
        cellHeight={25}
        dayCellComponent={this.customDayCell}
        dayFormat={'ddd DD.MM'}
        endTime={moment({h: 18, m: 1})}
        eventComponent={this.customEvent}
        firstDay={this.state.firstDay}
        onIntervalRemove={this.handleEventRemove}
        onIntervalSelect={this.handleSelect}
        scaleHeaderTitle='FasTodos'
        scaleUnit={30}
        selectedIntervals={this.getSelectedIntervals()}
        startTime={moment({h: 6, m: 0 })}
      />);

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
            {this.createWeekCalendar()}
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



export default connect(mapStateToProps, matchDispatchToProps)(Calendar);
