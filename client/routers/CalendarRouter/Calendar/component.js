import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
const moment = require('moment');

export default class Calendar extends Component {
    state = {
        startTime: moment({h: 6, m: 0}),
        endTime: moment({h: 18, m: 1})
    };

    onChange = date => this.setState({ chosenDate: date });

    createWeekCalendar = () => <WeekCalendar 
        dayFormat={'ddd DD.MM'}
        startTime = {this.state.startTime}
        endTime = {this.state.endTime}
        scaleUnit = {30}
        scaleHeaderTitle = 'FasTodos'
        cellHeight = {25}
    />;

    render = () => {
        return (
            <div className='calendar'>
                <div className="calendar-switch">
                    {this.props.toggle}
                    <span class='switch'>
                        <i class="arrow left"></i>
                    </span>
                    <span class='switch'>                    
                        <i class="arrow right"></i>
                    </span>
                </div>
                <div className='week-calendar'>
                    {this.createWeekCalendar()}
                </div>
            </div>
        );
    }
}