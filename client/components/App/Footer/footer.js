import React, { Component } from 'react';
import './footer.scss';

var CONFIG = require('client/components/App/config.json');

class Footer extends Component {
  state = {
    authors: []
  };

  componentDidMount() {
    $.getJSON(CONFIG.serverUrl+'/authors').then((res) => this.setState({ authors: res }));
  }

  render() {
    return (
      <footer className='footer'>
        Authors: [ {this.state.authors.join(', ')} ]
      </footer>
    );
  }
}

export default Footer;
