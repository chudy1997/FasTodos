import React, { Component } from 'react';
import 'client/styles/base.scss';

class App extends Component {
  state = {
    authors: [],
    showAuthors: false
  };

  componentDidMount() {
    $.getJSON('http://localhost:8000/authors')
      .then((res) => {
        this.setState({ authors: res })
      });
  }

  showAuthors = () => {
    this.setState({showAuthors: !this.state.showAuthors});
  }

  render() {
    return (
      <footer>
        <button onClick={this.showAuthors}>Autorzy</button>
        { this.state.showAuthors &&
        <ul>{
        this.state.authors.map((elem) => 
            <li>{elem}</li>
        )}
        </ul>}
      </footer>
    );
  }
}

export default App;
