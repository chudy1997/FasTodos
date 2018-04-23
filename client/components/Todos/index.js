import React, { Component } from 'react';

class Todos extends Component {
    state = {
        input: ''
    }

    componentDidMount = () => {
        $.get('http://localhost:8000/todos').then(todos => {
            this.props.fetchTodos(todos.sort((a, b) => b.todoId - a.todoId))
            this.todos = todos;
        });
    }

    handleSubmit = (e) => {
        let text = this.state.input.trim();
        if(text.length > 0){
            let todos = this.props.todos;
            let categoryId = this.getCategoryId();
            if(categoryId===0) categoryId=1; //if category not selected, first category in db -> newTask category
            $.post(`http://localhost:8000/todos/new?text=${text}&categoryId=${categoryId}`);
    
            var newTodo = { text: text, categoryId: categoryId };
            todos.unshift(newTodo);
            this.props.fetchTodos(todos);
    
            this.setState({input: ''});
        }
        e.preventDefault();
    }

    getCategoryId = () => {
        const category = this.props.categories[this.props.chosenCategoryId];
        return category ? category.categoryId : 0;
    } 

    handleUncheck = (e) => {
        if(this.todos[this.props.chosenTodoId])
            $.post(`http://localhost:8000/todos/finish?id=${this.todos[this.props.chosenTodoId].todoId}`);

        e.preventDefault();
    }

    createTodos = () => {
        let id = -1;
        this.todos = this.props.todos.filter(todo => todo.categoryId === this.getCategoryId());

        if(this.getCategoryId()===0){
            return this.todos.map(todo =>
                <li key={(id++)} id={id} style={{backgroundColor:this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length]}} className={this.props.chosenTodoId == id ? 'todo chosen-todo': 'todo'} onClick={this.chooseTodo}>
                    {todo.text}
                </li>
            );
        } else {
            return this.todos.filter(todo => todo.categoryId === this.getCategoryId()).map(todo =>
                <li style={{backgroundColor:this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length]}} key={(id++)} id={id} className={this.props.chosenTodoId == id ? 'todo chosen-todo': 'todo'} onClick={this.chooseTodo}>
                    {todo.text}
                    {todo.finished && <i className="uncheck fa fa-check-circle"/>}
                </li>
          );
        }
    }

    handleChange = (e) => this.setState({ input: e.target.value});
    chooseTodo = (e) => this.props.chooseTodo(e.target.id);

    render = () => (
        <span className='todos'>
            <form className="form" onSubmit={this.handleSubmit}>
            <input className="input" autoFocus="autofocus" type="text" maxLength="50" onChange={this.handleChange} value={this.state.input} placeholder="What are you going TODO ?"/>
            </form>
            <button onClick={this.handleUncheck}>Uncheck chosen todo</button>
            <ol className='todos-list'>
                {this.createTodos()}
            </ol>
        </span>
    );
}

export default Todos;