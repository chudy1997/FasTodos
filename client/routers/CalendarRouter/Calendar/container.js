import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fetchTodos from './../../../actions/fetchTodos'
import chooseTodo from './../../../actions/chooseTodo';

function mapStateToProps(state){
  return {
    todos: state.todos,
    chosenTodoId: state.chosenTodoId,
    categories: state.categories,
    chosenCategoryId: state.chosenCategoryId,
    colorMap: state.colorMap
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({fetchTodos: fetchTodos, chooseTodo: chooseTodo}, dispatch);
}

export default {
  mapStateToProps,
  matchDispatchToProps
};