import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import dragTodo from './../../actions/dragTodo';
import { colorMap } from './../../constants/colorMap';

export const ItemTypes = {
  TODO: 'todo'
};

class CalendarTodo extends Component {
  render(){
    const { connectDragSource, isDragging, todo } = this.props;
      const backgroundColor =  colorMap[todo.categoryId%Object.keys(colorMap).length];

      return connectDragSource(
      <li
        className="todo-without-deadline"
        style={{
          "background-color": backgroundColor,
          "opacity": isDragging ? 0.5 : 1,
        }}
      >
        {todo.text}
      </li>
    );
  }
}

const todoSource = {
  beginDrag(props) {
    props.dragTodo(props.todo);
    return { draggedTodoId: props.todo.todoId };
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


function mapStateToProps(state){
  return {

  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators(
    {
      dragTodo: dragTodo
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(DragSource(ItemTypes.TODO, todoSource, collect)(CalendarTodo));
