import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

import WelcomeRouter from './../WelcomeRouter';
import ListRouter from './../ListRouter';
import CalendarRouter from './../CalendarRouter';

const AppRouter = () => (
    <div className="app-router max-size">
        <Header />
        <Route path='/' exact component={WelcomeRouter} />
        <Route path='/list' exact component={ListRouter} />
        <Route path='/calendar' exact component={CalendarRouter} />
        <Footer />
    </div>);

export default AppRouter;