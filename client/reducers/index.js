import { combineReducers } from 'redux';
import todosReducer from './todos';
import chosenTodoIdReducer from './chosenTodoId';
import categoriesReducer from './categories';
import chosenCategoryIdReducer from './chosenCategoryId';
import draggedTodoReducer from './draggedTodo';
import colorMap from "./colorMap";

const reducers = combineReducers({
  todos: todosReducer,
  chosenTodoId: chosenTodoIdReducer,
  categories: categoriesReducer,
  chosenCategoryId: chosenCategoryIdReducer,
  colorMap: colorMap,
  draggedTodo: draggedTodoReducer
});

export default reducers;
