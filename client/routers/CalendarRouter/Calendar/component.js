import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
const moment = require('moment');

export default class Calendar extends Component {
    state = {
        chosenDate: new Date()
    };

    onChange = date => this.setState({ chosenDate: date });

    createWeekCalendar = () => <WeekCalendar 
        startTime={ moment({h: 6, m: 0}) }
        endTime={ moment({h: 18, m: 1}) }
        scaleUnit={30}
        scaleHeaderTitle='FasTodos'
        cellHeight={25}
    />;

    render = () => {
        return (
            <div className='calendar'>
                {this.props.toggle}
                <div className='week-calendar'>
                    {this.createWeekCalendar()}
                </div>
            </div>
        );
    }
}