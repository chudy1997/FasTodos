import React from 'react';
import { BrowserRouter, browserHistory } from 'react-router-dom';

import AppRouter from './../../routers/AppRouter';

const App = () => (
    <div className="app max-size">
        <BrowserRouter history={browserHistory} >
            <AppRouter />
        </BrowserRouter>
    </div>);

export default App;