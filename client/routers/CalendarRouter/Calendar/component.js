import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
const moment = require('moment');

export default class Calendar extends Component {
  state = {
    firstDay: moment().startOf('week').add(1, 'days'),
    todos: []
  };

  componentDidMount = () => {
    $.get('http://localhost:8000/todos').then(todos => this.setState({todos: todos}));
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
    const categoryId = this.getCategoryId();
    const intervals = this.state.todos.slice().filter(todo => categoryId === 0 || todo.categoryId === categoryId).map(todo => {
      return {
        start:moment(todo.deadline).subtract('30',"minute"),
        end:moment(todo.deadline),
        value: todo.text,
        id: todo.todoId,
      }
    });

    return intervals;
  }

  handleEventRemove = (e) => {
    //TODO delete from database
    const { todos } = this.state;
    const index = todos.findIndex((interval) => interval.todoId === e.id);
    if (index > -1) {
      todos.splice(index, 1);
      this.setState({ todos });
    }
  }

  handleSelect = (newIntervals) => {
      let text = newIntervals[0].value;
      if(text.length > 0){
          let todos = this.props.todos;
          let deadline = newIntervals[0].end.unix();
          console.log(deadline);
          let categoryId = this.getCategoryId();
          if(categoryId===0) categoryId=1; //if category not selected, first category in db -> newTask category
          $.post(`http://localhost:8000/todos/new?text=${text}&categoryId=${categoryId}&deadline=${deadline}`);

          var newTodo = { text: text, categoryId: categoryId };
          todos.unshift(newTodo);
          this.props.fetchTodos(todos);
      }

      const {lastUid, todos} = this.state;
      const intervals = newIntervals.map( (interval, index) => {
          return {
            // ...interval,
            //   value:'ad',
              id: index +123
          }
      });
      console.log(this.state.todos);
      // this.setState({
      //     todos: this.state.todos.slice().concat({'asd'}),
      // })
    this.setState({todos: this.state.todos.slice().concat({intervals})});
      console.log(this.state.todos);
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