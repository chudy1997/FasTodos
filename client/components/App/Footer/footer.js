import React, { Component } from 'react';
import './footer.scss';

class Footer extends Component {
    state = {
    authors: []
    };

    componentDidMount() {
        $.getJSON('http://localhost:8000/authors').then((res) => this.setState({ authors: res }));
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
