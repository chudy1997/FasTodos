import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
const moment = require('moment');

export default class Calendar extends Component {
    state = {
        startTime: moment({h: 6, m: 0}),
        endTime: moment({h: 18, m: 1}),
        selectedIntervals: []
    };

    onChange = date => this.setState({ chosenDate: date });

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

    handleEventRemove = (event) => {
        const {selectedIntervals} = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.id === event.id);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({selectedIntervals});
        }
    }

    createWeekCalendar = () => <WeekCalendar
        dayFormat={'ddd DD.MM'}
        startTime = {this.state.startTime}
        endTime = {this.state.endTime}
        selectedIntervals={this.state.selectedIntervals}
        onIntervalRemove={this.handleEventRemove}
        scaleUnit = {30}
        scaleHeaderTitle = 'FasTodos'
        cellHeight = {25}
    />;

    render = () => {
        return (
            <div className='calendar'>
                <div className="calendar-switch">
                    {this.props.toggle}
                    <span className='switch'>
                        <i className="arrow left"></i>
                    </span>
                    <span className='switch'>
                        <i className="arrow right"></i>
                    </span>
                </div>
                <div className='week-calendar'>
                    {this.createWeekCalendar()}
                </div>
            </div>
        );
    }
}