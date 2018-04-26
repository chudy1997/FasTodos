import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Welcome from './Welcome';

export default class WelcomeRouter extends Component {
    render() {
        return (
            <div className='welcome-router'>
                <Welcome list={
                    <Link className='toggle list' data-tip='List view' to='/list' >
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </Link>
                } calendar={
                    <Link className='toggle calendar' data-tip='Calendar view' to='/calendar' >
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                    </Link>
                } />
                <ReactTooltip />
            </div>
        );
    }
}
