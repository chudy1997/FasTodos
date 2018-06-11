import React, { Component } from 'react';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

import fetchTodos from './../../actions/fetchTodos';
import chooseTodo from './../../actions/chooseTodo';

import ajax from './../../ajax';

import './index.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

    state = {
      description:'',
      input: '',
      date: "",
      time: ""
    };

    reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    getItemStyle = (isDragging, draggableStyle, backgroundColor) => ({
      userSelect: 'none',
      padding: '16px',
      margin: `0 0 8px 0`,
      background: isDragging ? 'lightgreen' : backgroundColor,
      ...draggableStyle,
    });

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
        `todos/update?todoId=${todoId}&text=${text}&finished=${finished}&deadline=${moment(deadline).unix()}&categoryId=${categoryId}&description=${description}`,
        5,
        1000,
        todoId => {},
        () => {
          alert(msg);
        });
    };

    onDragEnd = (result) => {
      if (!result.destination) {
        return;
      } else if (result.source.index===result.destination.index){
        return;
      }

      const todos = this.reorder(
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
        });

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
      const index = todos.findIndex(t => parseInt(t.todoId) === parseInt(todo.todoId));
      todos[parseInt(index)] = {
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
      if(todo.deadline === null || todo.deadline === ""){
        console.log("null deadline");
        this.setState({ date: "", time: "" });
      }
      else {
        this.setState({ date: moment(todo.deadline).format("YYYY-MM-DD"),
          time: moment(todo.deadline).format("HH:mm")
        });
      }
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
      todo.categoryId = parseInt(categoryId);
      this.fetchChangedTodos(todos, todo);

      ajax('POST', `todos/changeCategory?todoId=${todo.todoId}&categoryId=${categoryId}`, 5, 1000, () => {},
        () => {
          alert('Could not change todo\'s category...');
          todo.categoryId = oldCategoryId;
          this.fetchChangedTodos(todos, todo);
        });
    };

  handleChangeDate = (dateValue, todo) => {
    this.setState({
      date: dateValue
    });
    const datetime = moment(dateValue+this.state.time,"YYYY-MM-DDHH:mm")
    this.updateTodoDeadline(todo, datetime);
  };

  handleChangeTime = (timeValue, todo) => {
    this.setState({
      time: timeValue
    });
    const datetime = moment(this.state.date+timeValue,"YYYY-MM-DDHH:mm")
    this.updateTodoDeadline(todo, datetime);
  };

    updateTodoDeadline = (todo, datetime) => {
      const todos = this.props.todos;
      const oldDeadline = todo.deadline;
      if(!isNaN(datetime) && datetime !== null) {
        // todo.deadline = 1000 * datetime.unix()
        todo.deadline = datetime;
        this.fetchChangedTodos(todos, todo);
        // ajax('POST', `todos/changeDeadline?todoId=${todo.todoId}&deadline=${datetime.unix()}`, 5, 1000, () => {
        //     NotificationManager.success(`Successfully  set ${todo.text}'s deadline to: ${datetime.format("YYYY-MM-DD HH:mm")} from ${oldDeadline}`);
        //   },
        //   () => {
        //     alert('Could not change todo\'s deadline...');
        //     todo.deadline = oldDeadline;
        //     this.setState({
        //       date: moment(todo.deadline).format("YYYY-MM-DD"),
        //       time: moment(todo.deadline).format("HH:mm")
        //     });
        //     this.fetchChangedTodos(todos, todo);
        //   });
      }
    }

    createTodos = (finished) => {
      const categoryId = this.getCategoryId();
      const todos = this.props.todos.filter(todo => (categoryId === 0
      || todo.categoryId == categoryId) && todo.finished == finished);

      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
              >
                {
                  todos.map((todo, index) => {
                    const backgroundColor =  this.props.colorMap[todo.categoryId%Object.keys(this.props.colorMap).length];
                    const className = this.props.chosenTodoId == todo.todoId ? 'todo chosen-todo' : 'todo';

                    return (
                      <Draggable
                        draggableId={todo.todoId}
                        index={index}
                        key={todo.todoId}
                      >
                        {(provided, snapshot) => (
                          <li
                            className={className}
                            id={todo.todoId}
                            key={todo.todoId}
                            onClick={(e) => {
                              this.handleExpand(todo);
                              e.stopPropagation();
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              backgroundColor
                            )}
                          >
                            <div className="todo-header">
                              <input
                                checked={todo.finished ? 'checked' : ''}
                                className='check'
                                onClick={(e) => this.handleCheck(e, todo)}
                                type='checkbox'
                              />
                              {todo.text}
                              <button
                                className="delete-todo-button"
                                hidden={this.props.chosenTodoId === todo.todoId ? '' : 'hidden'}
                                onClick={(e) => this.handleDelete(e, todo)}
                              >
                                {'✘'}
                              </button>
                            </div>
                            <div className="panel">
                              <div className={this.props.chosenTodoId === todo.todoId ? 'view' : 'noview'}>
                                <form className="form"
                                      onClick={e => {
                                        e.stopPropagation();
                                      }}
                                >
                                  <input
                                    onChange={(e) => this.handleChangeDate(e.target.value, todo)}
                                    onClick={(e) => e.stopPropagation()}
                                    type="date"
                                    value={this.state.date}
                                  >
                                  </input>
                                  <input
                                    onChange={(e) => this.handleChangeTime(e.target.value, todo)}
                                    onClick={(e) => e.stopPropagation()}
                                    type="time"
                                    value={this.state.time}
                                  >
                                  </input>
                                <select
                                  className="Select"
                                  onChange={(e) => this.selectCategory( e.target.value, todo)}
                                  onClick={e => e.stopPropagation()}
                                  value={todo.categoryId}
                                >
                                  {this.props.categories.map(category => (
                                    <option
                                      key={category.categoryId}
                                      value={category.categoryId}
                                    >{ category.categoryName }</option>))}
                                </select>
                                </form>
                                {/*<button*/}
                                  {/*className="accept-calendar-button"*/}
                                  {/*hidden={this.props.chosenTodoId === todo.todoId ? '' : 'hidden'}*/}
                                  {/*onClick={(e) => this.changeTodoDeadline(todo,e)}*/}
                                {/*>*/}
                                  {/*{'Accept New Date'}*/}
                                {/*</button>*/}
                                <form
                                  className="form"
                                  onSubmit={(e) => this.handleDescriptionSubmit(e,todo)}
                                >
                                  {/*<input*/}
                                    {/*autoFocus="autofocus"*/}
                                    {/*maxLength="50"*/}
                                    {/*onChange={this.handleDescriptionChange}*/}
                                    {/*onClick={(e) => e.stopPropagation()}*/}
                                    {/*placeholder="Description"*/}
                                    {/*type=""*/}
                                    {/*value={this.state.description}*/}
                                  {/*/>*/}
                                  <textarea rows="4" cols="50"
                                    autoFocus="autofocus"
                                    maxLength="50"
                                    onChange={this.handleDescriptionChange}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Description"
                                     value={this.state.description}>
                                    {/*{this.state.description}*/}
                                </textarea>
                                </form>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    );
                  })
                }
                {provided.placeholder}

              </div>
            )}

          </Droppable>
        </DragDropContext>
      );
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
