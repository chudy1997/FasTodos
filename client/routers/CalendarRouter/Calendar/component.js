import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
const moment = require('moment');

var CONFIG = require('client/components/App/config.json');

export default class Calendar extends Component {
  state = {
    firstDay: moment().startOf('week').add(1, 'days')
  };

  componentDidMount = () => {
    $.get(CONFIG.serverUrl+'/todos').then(todos => this.props.fetchTodos(todos));
  }

  onRightArrowClick = e => {
    this.setState({firstDay: moment(this.state.firstDay).add(1, "week")});
  };

  onLeftArrowClick  = e => {
    this.setState({firstDay: moment(this.state.firstDay).subtract(1, "week")});
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
        categoryId: todo.categoryId,
      }
    });

    return intervals;
  }

  handleEventRemove = (e) => {
    //TODO delete from database
    const todos = this.props.todos;
    const index = todos.findIndex((interval) => interval.todoId === e.id);
    if (index > -1) {
      todos.splice(index, 1);
      this.props.fetchTodos(todos);
    }
  }

  handleSelect = (newIntervals) => {
    const text = newIntervals[0].value;
    if(text.length > 0){
      const todos = this.props.todos;
      var categoryId = this.getCategoryId();
      const deadline = newIntervals[0].end.unix();

      if(categoryId === 0)
        categoryId = 1; //if category not selected, first category in db -> newTask category

      $.post(`${CONFIG.serverUrl}/todos/new?text=${text}&categoryId=${categoryId}&deadline=${deadline}`);

      todos.unshift({ text: text, categoryId: categoryId, deadline: deadline*1000, todoId: todos[todos.length-1].todoId + 1 });
      this.props.fetchTodos(todos);
    }
  };

  customEvent = (props) => {
    let classes = "customEvent" + " ";
    if(props.categoryId === this.getCategoryId()) {
      classes+=("matchChosenCategory");
    }else{
      classes+=("notMatchChosenCategory");
    }
    return <div className={classes} style={{ backgroundColor: this.props.colorMap[props.categoryId] }}>{props.value}</div>;
  };

  createWeekCalendar = () => <WeekCalendar
    dayFormat = {'ddd DD.MM'}
    firstDay = {this.state.firstDay}
    startTime = {moment({h: 6, m: 0})}
    endTime = {moment({h: 18, m: 1})}
    scaleUnit = {30}
    scaleHeaderTitle = 'FasTodos'
    cellHeight = {25}
    selectedIntervals={this.getSelectedIntervals()}
    onIntervalRemove={this.handleEventRemove}
    onIntervalSelect={this.handleSelect}
    eventComponent={this.customEvent}
  />;

  render = () => {
    return (
      <div className='calendar'>
        <div className="calendar-switch">
          {this.props.toggle}
          <span className='switch switch-left' onClick={this.onLeftArrowClick}>
            <i className="arrow arrow-left"></i>
          </span>
          <label className='date start'>{this.state.firstDay.format('ddd DD.MM').toString()}</label>
          <label className='hyphen'>-</label>
          <label className='date end'>{moment(this.state.firstDay).add(6, 'days').format('ddd DD.MM').toString()}</label>
          <span className='switch switch-right' onClick={this.onRightArrowClick}>
            <i className="arrow arrow-right"></i>
          </span>
        </div>
        <div className='week-calendar'>
          {this.createWeekCalendar()}
        </div>
      </div>
    );
  }
}