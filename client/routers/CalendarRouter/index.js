import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'

import Categories from './../../components/Categories';
import Calendar from './Calendar';

export default class CalendarRouter extends Component {
    render() {
        return (
            <div className='calendar-router'>
                <Categories />
                <Calendar toggle={(
                    <Link className='toggle' data-tip="List view" to='/list' >
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </Link>)
                }/>
                <ReactTooltip />
            </div>
        );
    }
}
