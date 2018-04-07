import React, { Component } from 'react';
import './list.scss';

class List extends Component {
    state = {
      todos: []
    };

    componentDidMount(){
        $.get('http://localhost:8000/todos').then((res) => this.setState({todos: res}));
    }

    render() {
        return (
            <list className='list'>
            {/*List : [ {this.state.todos.join(', ')}]*/}
             List : {JSON.stringify(this.state.todos,null,5)}
            </list>
        );
    }
}

export default List;
