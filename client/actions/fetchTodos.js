import { TODOS_FETCHED } from './../constants/actionConstants';

export default function(todos) {
  return {
    type: TODOS_FETCHED,
    payload: todos
  };
} 
