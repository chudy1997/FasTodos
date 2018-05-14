import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

export default function Welcome() {
    return (
        <div className='welcome'>
            <p className='intro'>Welcome to our app.</p>
            <p className='intro'>Please, choose list or calendar view.</p>
            
            <div className='links'>
                {
                    <Link className='toggle list' data-tip='List view' to='/list' >
                        <i className="fa fa-list" aria-hidden="true"></i>
                    </Link>
                }
                {
                    <Link className='toggle calendar' data-tip='Calendar view' to='/calendar' >
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    </Link>
                }
            </div>
            <ReactTooltip />
        </div>
    );
}