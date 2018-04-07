import React, { Component } from 'react';
import Categories from './Categories/categories';
import List from './List/list';
import Ads from './Ads/ads';
import './main.scss';

class Main extends Component {
    render() {
        return (
            <div className='main'>
                <Categories />
                <List />
                <Ads />
            </div>
        );
    }
}

export default Main;
