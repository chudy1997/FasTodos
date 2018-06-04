import React from 'react';
import { BrowserRouter, browserHistory, Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';

import Header from './../Header';
import Welcome from './../Welcome';
import Calendar from './../Calendar';
import List from './../List';
import Categories from './../Categories';

import fetchTodos from './../../actions/fetchTodos';
import chooseTodo from './../../actions/chooseTodo';

import './index.css';

function App(props){
  return (
    <div className="app max-size">
      <BrowserRouter history={browserHistory} >
        <div className="app-router max-size">
          <Header />
          <Route 
            component={Welcome} 
            exact 
            path='/' 
          />
          <div className='main'>
            <Route 
              path={pathToRegexp('/:toggle')} 
              render={() => (
                <Categories 
                  categories={props.categories} 
                  chosenCategoryId={props.chosenCategoryId} 
                  colorMap={props.colorMap}
                />
              )} 
            />
            <Route exact 
              path='/list' 
              render={() => (
                <div className='list-router'>
                  <List 
                    categories={props.categories} 
                    chosenCategoryId={props.chosenCategoryId} 
                    colorMap={props.colorMap}
                    toggle={(
                      <Link 
                        className='toggle' 
                        data-tip="Calendar view" 
                        to='calendar' 
                      >
                        <i 
                          aria-hidden="true"
                          className="fa fa-calendar"
                        />
                      </Link>
                    )}
                  />
                </div>
              )}
            />
            <Route 
              exact 
              path='/calendar' 
              render={() => (
                <div className='calendar-router'>
                  <Calendar
                    categories={props.categories} 
                    chosenCategoryId={props.chosenCategoryId} 
                    colorMap={props.colorMap}
                    toggle={(
                      <Link 
                        className='toggle' 
                        data-tip="List view" 
                        to='/list' 
                      >
                        <i 
                          aria-hidden="true"
                          className="fa fa-list" 
                        />
                      </Link>
                    )}
                  />
                </div>
              )}
            />
          </div>
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