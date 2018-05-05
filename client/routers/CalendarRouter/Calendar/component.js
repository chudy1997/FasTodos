import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
const moment = require('moment');

export default class Calendar extends Component {
    state = {
        firstDay: moment().startOf('week').add(1, 'days'),
        selectedIntervals: []
    };

    onRightArrowClick = e => {
        this.setState({firstDay: moment(this.state.firstDay).add(1, "week")});
    };

    onLeftArrowClick  = e => {
        this.setState({firstDay: moment(this.state.firstDay).subtract(1, "week")});
    };

    componentDidMount = () => {
        $.get('http://localhost:8000/todos').then(todos => {
            const intervals = todos.map( (todo) => {
                const minute=moment(todo.deadline).format("mm");
                const hour=moment(todo.deadline).format("HH");
                console.log(hour);
                const day=moment(todo.deadline).format("DD");

                return {
                    start:moment({ d:day, h:hour-1, m:minute}),
                    end:moment({ d:day, h:hour, m:minute}),
                    value: todo.text,
                    id: todo.todoId,
                }
            });

            this.setState({selectedIntervals : this.state.selectedIntervals.concat(intervals)});
        });
    }

    handleSelect = (newIntervals) => {
        let text = newIntervals[0].value;
        if(text.length > 0){
              let todos = this.props.todos;
              let deadline = newIntervals[0].end.unix();
              let categoryId = this.getCategoryId();
              if(categoryId===0) categoryId=1; //if category not selected, first category in db -> newTask category

              $.post(`http://localhost:8000/todos/new?text=${text}&categoryId=${categoryId}&deadline=${deadline}`);

              var newTodo = { text: text, categoryId: categoryId };
              todos.unshift(newTodo);
              this.props.fetchTodos(todos);
        }

        const {lastUid, selectedIntervals} = this.state;
        const intervals = newIntervals.map( (interval, index) => {
              return {
                    ...interval,
                    id: lastUid + index
              }
        });

        this.setState({
              selectedIntervals: selectedIntervals.concat(intervals),
              lastUid: lastUid + newIntervals.length
        })
    };

    getCategoryId = () => {
        const category = this.props.categories[this.props.chosenCategoryId];
        return category ? category.categoryId : 0;
    };

    handleEventRemove = (e) => {
        //TODO remove from database
        const { selectedIntervals } = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.id === e.id);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({ selectedIntervals });
        }
    };

    createWeekCalendar = () => <WeekCalendar 
        dayFormat = {'ddd DD.MM'}
        firstDay = {this.state.firstDay} 
        startTime = {moment({h: 6, m: 0})}
        endTime = {moment({h: 18, m: 1})}
        scaleUnit = {30}
        scaleHeaderTitle = 'FasTodos'
        cellHeight = {25}
        selectedIntervals={this.state.selectedIntervals}
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