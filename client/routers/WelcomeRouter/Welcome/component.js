import React, { Component } from 'react';

export default class Welcome extends Component {
    render = () => {
        return (
            <div className='welcome'>
                <p className='intro'>Welcome to our app.</p>
                <p className='intro'>Please, choose list or calendar view.</p>
                
                <div className='links'>
                    {this.props.list}
                    {this.props.calendar}
                </div>
            </div>
        );
    }
}