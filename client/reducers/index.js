import { combineReducers } from 'redux'
import todosReducer from './todos';
import chosenTodoIdReducer from './chosenTodoId';
import categoriesReducer from './categories';
import chosenCategoryIdReducer from './chosenCategoryId';
import colorMap from "./colorMap";

const reducers = combineReducers({
    //Todos
    todos: todosReducer,
    chosenTodoId: chosenTodoIdReducer,
    
    //Categories
    categories: categoriesReducer,
    chosenCategoryId: chosenCategoryIdReducer,


    //map
    colorMap: colorMap
})

export default reducers;