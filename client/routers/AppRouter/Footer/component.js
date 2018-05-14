import React, { Component } from 'react';
import $ from 'jquery';

var CONFIG = require('client/components/App/config.json');

export default class Footer extends Component {
  state = {
    authors: []
  };

  componentDidMount() {
    $.getJSON(CONFIG.serverUrl+'/authors').then((res) => this.setState({ authors: res }),
      function () {alert("could not get authors from database");});
  }

  render() {
    return (
      <footer className='footer'>
        Authors: [ {this.state.authors.join(', ')} ]
      </footer>
    );
  }
}
