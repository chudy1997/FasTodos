import React, { Component } from 'react';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import fetchTodos from './../../actions/fetchTodos';
import chooseTodo from './../../actions/chooseTodo';

import ajax from './../../ajax';

import './index.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, backgroundColor) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : backgroundColor,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
  //padding: grid,
});

class List extends Component {
    constructor(props) {
      super(props);
      this.onDragEnd = this.onDragEnd.bind(this);
    }

    state = {
      description:'',
      input: '',
      date: moment()
    };

    saveAll = (msg) => {
      if (!this.props.chosenTodoId)
      {return;}

      const todo = this.props.todos.filter(todo => todo.todoId === this.props.chosenTodoId)[0];
      if (!todo)
      {return;}

      todo.description = this.state.description;
      this.fetchChangedTodos(this.props.todos, todo);
      const { todoId, text, finished, deadline, categoryId, description } = todo;

      ajax('POST',
        `todos/update?todoId=${todoId}&text=${text}&finished=${finished}&deadline=${deadline}&categoryId=${categoryId}&description=${description}`,
        5,
        1000,
        todoId => {},
        () => {
          alert(msg);
        });
    };

    onDragEnd(result) {
      // dropped outside the list
      if (!result.destination) {
        return;
      } else if (result.source.index===result.destination.index){
        return;
      }

      const todos = reorder(
        this.props.todos,
        result.source.index,
        result.destination.index
      );

      todos.filter((todo,index) => result.source.index-result.destination.index < 0 ? (index >= result.source.index && index <= result.destination.index) : (index <= result.source.index && index >= result.destination.index))
        .map(todo => {
          const index = todos.findIndex(t => t.todoId === todo.todoId);
          todo.priority=todos.length-index-1;
          ajax('POST', `todos/updatePriority?id=${todo.todoId}&value=${todo.priority}`, 5, 1000, () => {
          },
          () => {
            alert('Could not add new todo...');
          });
        })

      this.props.fetchTodos(todos);
    };

    componentDidMount = () => {
      window.onbeforeunload = (e) => {
        this.saveAll('Could not update todo on browser refresh / close...');
      };

      ajax('GET', 'todos', 5, 1000, todos => {
          this.props.fetchTodos(todos.sort((a, b) => b.priority - a.priority));
      },
      () => {
        alert('Could not fetch todos...');
      });
    };

    fetchChangedTodos(todos, todo){
      const index = todos.findIndex(t => t.todoId === todo.todoId);
      todos[index] = {
        ...todo
      };
      this.props.fetchTodos(todos);
    }

    getCategoryId = () => {
      const category = this.props.categories[this.props.chosenCategoryId];
      return category ? category.categoryId : 0;
    };

    handleSubmit = (e) => {
      e.preventDefault();
      const text = this.state.input.trim();
      if (text.length > 0){
        const todos = this.props.todos;
        const priority = this.props.todos.length;
        let categoryId = this.getCategoryId();
        if (categoryId === 0)
        {categoryId = 1;}

        ajax('POST', `todos/new?text=${text}&categoryId=${categoryId}&priority=${priority}`, 5, 1000, res => {
            NotificationManager.success(`Successfully created todo: ${text}.`);
            const newTodo = { todoId: res.insertId, text: text, categoryId: categoryId, finished: false, priority: priority };
          todos.unshift(newTodo);
          this.props.fetchTodos(todos);
        },
        () => {
          alert('Could not add new todo...');
        });

        this.setState({ input: '' });
      }
    };

    handleDescriptionSubmit = (e,todo) => {
      e.stopPropagation();
      e.preventDefault();
      const todos = this.props.todos;
      const oldDescription = todo.description;
      todo.description = this.state.description;
      this.fetchChangedTodos(todos,todo);

      ajax('POST', `todos/setDescription?todoId=${todo.todoId}&description="${todo.description}"`, 5, 1000, () => {},
        () => {
          alert('Could not change todo\'s description...');
          todo.description = oldDescription;
          this.fetchChangedTodos(todos, todo);
        });
    };


    handleChange = (e) => this.setState({ input: e.target.value });

    handleDescriptionChange = (e) => this.setState({ description: e.target.value });

    handleExpand = (todo) => {
      this.saveAll('Could not update todo...');

      this.props.chooseTodo(this.props.chosenTodoId !== todo.todoId ? todo.todoId : -1);
      const description = todo.description ? todo.description : "";
      this.setState({ description : description });
    };

    handleCheck = (e, todo) => {
      e.stopPropagation();
      const todos = this.props.todos;
      const oldValue = todo.finished;
      const newValue = oldValue ? 0 : 1;

      todo.finished = newValue;
      this.fetchChangedTodos(todos, todo);
      ajax('POST', `todos/finish?id=${todo.todoId}&value=${newValue}`, 5, 1000, () => {
        NotificationManager.success(`Successfully ${newValue ? '' : 'un'}checked todo: ${todo.text}.`);
      },
      () => {
        alert('Could not check todo...');
        todo.finished = oldValue;
        this.fetchChangedTodos(todos, todo);
      });
    };

     handleDelete = (e, todo) => {
       e.stopPropagation();

       confirmAlert({
         title: 'Confirm to delete',
         message: 'Are you sure to remove this todo?',
         buttons: [
           {
             label: 'Yes',
             onClick: () => {
               const todos = this.props.todos;

               ajax('POST', `todos/delete?id=${todo.todoId}`, 5, 1000, () => {
                 NotificationManager.success(`Successfully deleted todo ${todo.text}`);
                 todos.splice(todos.findIndex(t => t.todoId === todo.todoId), 1);
                 this.props.fetchTodos(todos);
               },
               () => {
                 alert('Could not delete todo...');
               });
             }
           },
           {
             label: 'No'
           }
         ]
       });
     };

    selectCategory = (categoryId, todo) => {
      const todos = this.props.todos;
      const oldCategoryId = todo.categoryId;
      todo.categoryId = categoryId;
      this.fetchChangedTodos(todos, todo);

      ajax('POST', `todos/changeCategory?todoId=${todo.todoId}&categoryId=${categoryId}`, 5, 1000, () => {},
        () => {
          alert('Could not change todo\'s category...');
          todo.categoryId = oldCategoryId;
          this.fetchChangedTodos(todos, todo);
        });
    };

    handleChangeDate = (e) => {
      // $.post(`${CONFIG.serverUrl}/todos/changeDate?id=${todo.todoId}&date=${text}`);
    };

    createTodos = (finished) => {
      const categoryId = this.getCategoryId();
      const todos = this.props.todos.filter(todo => categoryId === 0 || todo.categoryId == categoryId);
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
              {
                todos.filter(todo => todo.finished == finished).map((todo, index) => {
                const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
                const className = this.props.chosenTodoId == todo.todoId ? 'todo chosen-todo' : 'todo';

                return (
                  <Draggable key={todo.todoId} draggableId={todo.todoId} index={index} >
                    {(provided, snapshot) => (
                        <li
                          className={className}
                          id={todo.todoId}
                          key={todo.todoId}
                          onClick={() => this.handleExpand(todo)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            backgroundColor
                          )}
                        >
                          <input
                            checked={todo.finished ? 'checked' : ''}
                            className='check'
                            onClick={(e) => this.handleCheck(e, todo)}
                            type='checkbox'
                          />
                          {todo.text}
                          <button
                            className="buttonstyle"
                            hidden={this.props.chosenTodoId === todo.todoId ? '' : 'hidden'}
                            onClick={(e) => this.handleDelete(e, todo)}
                          >
                            {'✘'}
                          </button>
                          <div className="panel">
                            <p className={this.props.chosenTodoId === todo.todoId ? 'view' : 'noview'}>
                              <form >
                                <DatePicker
                                  className="Select"
                                  dateFormat="LLL"
                                  onChange={this.handleChangeDate}
                                  onClick={e => e.stopPropagation()}
                                  selected={this.state.date}
                                  showTimeSelect
                                  timeCaption="time"
                                  timeFormat="HH:mm"
                                  timeIntervals={15}
                                />
                              </form>
                              <select
                                className="Select"
                                onChange={(e) => this.selectCategory( e.target.value,todo)}
                                onClick={e => e.stopPropagation()}
                                value={todo.categoryId}
                              >
                                {this.props.categories.map(category => (
                                  <option
                                    key={category.categoryId}
                                    value={category.categoryId}
                                  >{ category.categoryName }</option>))}
                              </select>

                              <form
                                className="form"
                                onSubmit={(e) => this.handleDescriptionSubmit(e,todo)}
                              >
                                <input
                                  autoFocus="autofocus"
                                  maxLength="50"
                                  onChange={this.handleDescriptionChange}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Description"
                                  type="text"
                                  value={this.state.description}
                                />
                              </form>

                            </p>
                          </div>
                        </li>

                      )}
                  </Draggable>
                )})}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>)
    };

    render = () => {
      return (
        <div className='list'>
          <form
            className="form"
            onSubmit={this.handleSubmit}
          >
            {this.props.toggle}
            <input
              autoFocus="autofocus"
              className="input"
              maxLength="50"
              onChange={this.handleChange}
              placeholder="What are you going TODO ?"
              type="text"
              value={this.state.input}
            />
          </form>
          <div className='todos-wrapper'>
            <ul className='todos'>
              {this.createTodos(false)}
            </ul>
            <hr className="todos-split" />
            <ul className='todos'>
              {this.createTodos(true)}
            </ul>
          </div>
        </div>
      );
    }
}



function mapStateToProps(state){
  return {
    todos: state.todos,
    chosenTodoId: state.chosenTodoId,
  };
}

export default connect(mapStateToProps, { fetchTodos, chooseTodo })(List);
