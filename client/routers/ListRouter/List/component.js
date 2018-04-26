import React, { Component } from 'react';

class List extends Component {
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

    createTodos = () => {
        let id = -1;

        const categoryId = this.getCategoryId();
        this.todos = this.props.todos.filter(todo => categoryId === 0 || todo.categoryId === categoryId);

        return this.todos.map(todo => {
            id += 1;
            const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
            const className = this.props.chosenTodoId == id ? 'todo chosen-todo': 'todo';
            return (
                <li key={id} id={id} onClick={this.chooseTodo} style={{backgroundColor: backgroundColor}} className={className}>
                    {todo.text}
                </li>
            )
        });
    }

    handleChange = (e) => this.setState({ input: e.target.value});
    chooseTodo = (e) => this.props.chooseTodo(e.target.id);

    render = () => (
        <div className='list'>
            <form className="form" onSubmit={this.handleSubmit}>
                {this.props.toggle}
                <input className="input" autoFocus="autofocus" type="text" maxLength="50" onChange={this.handleChange} value={this.state.input} placeholder="What are you going TODO ?"/>
            </form>
            <ol className='todos'>
                {this.createTodos()}
            </ol>
        </div>
    );
}

export default List;