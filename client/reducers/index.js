import { combineReducers } from 'redux';
import todosReducer from './todos';
import chosenTodoIdReducer from './chosenTodoId';
import categoriesReducer from './categories';
import chosenCategoryIdReducer from './chosenCategoryId';
import draggedTodoReducer from './draggedTodo';

const reducers = combineReducers({
  todos: todosReducer,
  chosenTodoId: chosenTodoIdReducer,
  categories: categoriesReducer,
  chosenCategoryId: chosenCategoryIdReducer,
  draggedTodo: draggedTodoReducer
});

export default reducers;
