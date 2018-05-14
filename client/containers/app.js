import React from 'react';
import { BrowserRouter, browserHistory, Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';

import Header from './../components/header';
import Footer from './../components/footer';
import Welcome from './../components/welcome';

import Calendar from './calendar';
import List from './list';
import Categories from './categories';

import fetchTodos from './../actions/fetchTodos'
import chooseTodo from './../actions/chooseTodo';

function App(props){
    return (
        <div className="app max-size">
            <BrowserRouter history={browserHistory} >
                <div className="app-router max-size">
                    <Header />
                    <Route exact path='/' component={Welcome} />
                    <Route path={pathToRegexp('/:toggle')} render = {() => (
                        <Categories 
                            categories = {props.categories} 
                            chosenCategoryId = {props.chosenCategoryId} 
                            colorMap = {props.colorMap} 
                        />
                    )} />
                    <Route exact path='/list' render = {() => (
                        <div className='list-router'>
                            <List 
                                toggle={(
                                    <Link className='toggle' data-tip="Calendar view" to='calendar' >
                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                    </Link>
                                )}
                                categories = {props.categories} 
                                chosenCategoryId = {props.chosenCategoryId} 
                                colorMap = {props.colorMap}
                            />
                        </div>
                    )}/>
                    <Route exact path='/calendar' render = {() => (
                        <div className='calendar-router'>
                            <Calendar
                                toggle={(
                                    <Link className='toggle' data-tip="List view" to='/list' >
                                        <i className="fa fa-list" aria-hidden="true"></i>
                                    </Link>
                                )}
                                categories = {props.categories} 
                                chosenCategoryId = {props.chosenCategoryId} 
                                colorMap = {props.colorMap}
                            />
                        </div>
                    )}/>
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
}



function mapStateToProps(state){
  return {
    chosenCategoryId: state.chosenCategoryId,
    categories: state.categories,
    colorMap: state.colorMap
  };
}



export default connect(mapStateToProps)(App);