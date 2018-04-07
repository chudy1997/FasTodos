import React, { Component } from 'react';
import Header from './Header/header';
import Main from './Main/main';
import Footer from './Footer/footer';
import './app.scss';

class App extends Component {
    render() {
        return(
        <div className="app">
            <Header />
            <Main />
            <Footer />
        </div>)
    }
}

export default App;
