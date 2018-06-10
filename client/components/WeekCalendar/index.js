import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { NotificationManager } from 'react-notifications';

const moment = require('moment');

import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';

import { ItemTypes } from './../CalendarTodo';
import fetchTodos from './../../actions/fetchTodos';
import { colorMap } from './../../constants/colorMap';
import ajax from './../../ajax';

import CustomModal from './../Calendar/CustomModal';

const CustomDayCell = (props) => {
  const { connectDropTarget, endTime } = props;

  const classes = `custom-day-cell ${endTime.unix()*1000 < Date.now() ? 'beforeNow' : 'afterNow' }`;
  return connectDropTarget(
    <div
      className={classes}
      onMouseDown={props.startSelection}
    />);
};

const calendarTarget = {
  drop(props) {
    function fetchChangedTodos(todos, todo){
      const index = todos.findIndex(t => t.todoId === todo.todoId);
      todos[index] = {
        ...todo
      };
      props.fetchTodos(todos);
    }

    const todo = props.draggedTodo;
    const todos = props.todos;
    const oldDeadline = todo.deadline;
    todo.deadline = props.endTime;
    fetchChangedTodos(todos,todo);

    const { todoId, text, finished, deadline, categoryId, description } = todo;

    ajax('POST',
      `todos/update?todoId=${todoId}&text=${text}&finished=${finished}&deadline=${deadline.unix()}&categoryId=${categoryId}&description=${description}`,
      5,
      1000,
      () => {
        NotificationManager.success(`Successfully assigned deadline to todo ${text}`);
      },
      () => {
        todo.deadline = oldDeadline;
        this.fetchChangedTodos(todos, todo);
      });
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

function mapStateToProps(state){
  return {
    todos: state.todos,
    draggedTodo: state.draggedTodo
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators(
    {
      fetchTodos: fetchTodos
    },
    dispatch
  );
}

const CustomDayCellDrop = connect(mapStateToProps, matchDispatchToProps)( DropTarget(ItemTypes.TODO, calendarTarget, collect)(CustomDayCell));

class WeekCalendarWrapper extends Component {
    getCategoryId = () => {
      const category = this.props.categories[this.props.chosenCategoryId];
      return category ? category.categoryId : 0;
    };

    customEvent = (props) => {
      const classes = `custom-event ${props.categoryId === this.getCategoryId() ? 'match-chosen-category' : 'not-match-chosen-category' }`;
      return (
        <div
          className={classes}
          style={{ backgroundColor: colorMap[props.categoryId%Object.keys(colorMap).length] }}
        >
          {props.value}
        </div>);
    };

    handleEventRemove = (e) => {
      const todos = this.props.todos;
      const todoId = e.id;
      const todo = todos.find(todo => todo.todoId === todoId);

      ajax('POST', `todos/delete?id=${todo.todoId}`, 5, 1000, () => {
        NotificationManager.success(`Successfully deleted todo: ${todo.text}.`);
      },
      () => {
        alert('Could not delete todo from db with 5 tries at maximum 6 sec...');
      });

      const index = todos.findIndex((interval) => interval.todoId === todoId);
      todos.splice(index,1);
      this.props.fetchTodos(todos);
    };

    fetchChangedTodos = (todos, todo) => {
      const index = todos.findIndex(t => t.todoId === todo.todoId);
      todos[index] = {
        ...todo
      };
      this.props.fetchTodos(todos);
    };

    handleEventUpdate = (e) => {
      const todos = this.props.todos;
      const todoId = e.id;
      const todo = todos.find(todo => todo.todoId === todoId);

      if (todo.text === e.value)
      {return;}

      todo.text = e.value;
      this.fetchChangedTodos(this.props.todos, todo);
      const { text, finished, deadline, categoryId, description } = todo;

      ajax('POST',
        `todos/update?todoId=${todoId}&text=${text}&finished=${finished}&deadline=${deadline}&categoryId=${categoryId}&description=${description}`,
        5,
        1000,
        todoId => {
          NotificationManager.success(`Successfully updated todo: ${todo.text}`);
        },
        () => {
          alert(msg);
        });
    };

    handleSelect = (newIntervals) => {
      const text = newIntervals[0].value;
      if (text.length > 0){
        const todos = this.props.todos;
        let categoryId = this.getCategoryId();
        const deadline = newIntervals[0].end.unix();
        const priority = todos.length;


        if (categoryId === 0)
        {categoryId = 1;}

        ajax('POST', `todos/new?text=${text}&categoryId=${categoryId}&deadline=${deadline}&priority=${priority}`, 5, 1000, res => {
          NotificationManager.success(`Successfully created todo: ${text}.`);

          const newTodo = { todoId: res.insertId, text: text, categoryId: categoryId, deadline: deadline*1000 };
          todos.unshift(newTodo);
          this.props.fetchTodos(todos);
        },
        () => {
          alert('Could not add new todo to db with 5 tries at maximum 6 sec...');
        });
      }
    };

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
    };

    render(){
      return (
        <WeekCalendar
          cellHeight={25}
          dayCellComponent={(props) => (
            <CustomDayCellDrop
              {...props}
              draggedTodo={this.props.draggedTodo}
            />)}

          dayFormat={'ddd DD.MM'}
          endTime={moment({ h: 18, m: 1 })}
          eventComponent={this.customEvent}
          firstDay={this.props.firstDay}
          onIntervalRemove={this.handleEventRemove}
          onIntervalSelect={this.handleSelect}
          onIntervalUpdate={this.handleEventUpdate}
          modalComponent={CustomModal}
          useModal={CustomModal}
          scaleHeaderTitle='FasTodos'
          scaleUnit={30}
          selectedIntervals={this.getSelectedIntervals()}
          startTime={moment({ h: 6, m: 0 })}
        >
          <div>{this.props.draggedTodo.todoId}</div>
        </WeekCalendar>);
    }
}

export default WeekCalendarWrapper;
