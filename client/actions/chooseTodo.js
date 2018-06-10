import { TODO_CHOSEN } from './../constants/actionConstants';

export default function(chosenTodoId) {
  return {
    type: TODO_CHOSEN,
    payload: chosenTodoId
  };
} 
