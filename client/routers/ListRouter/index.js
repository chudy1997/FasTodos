import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Categories from './../../components/Categories';
import List from './List';

export default class ListRouter extends Component {
    render() {
        return (
            <div className='list-router'>
                <Categories />
                <List toggle={(
                    <Link className='toggle' data-tip="Calendar view" to='/calendar' >
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                    </Link>)
                }/>
                <ReactTooltip />
            </div>
        );
    }
}
