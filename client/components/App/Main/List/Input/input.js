import React, { Component } from 'react';
import './input.scss';

class Input extends Component {
    state = {
        text : ' '
    };

    handleChange(event){
        this.setState({text: event.target.text});
    }

    handleSubmit() {
        $.post('http://localhost:8000/todos/new/?text=Maciek').then( (req) => {});

    }


    render(){
            return(
                <div className="input">
                    <form onSubmit={this.handleSubmit} >
                        <input type="text"  onChange={e => this.setState({ text : e.target.text })} value={this.state.text} className="input-area">
                        </input>
                    </form>
                </div>
            );
        }

}export default Input;