export default function(chosenTodoId) {
  return {
    type: 'TODO_CHOSEN',
    payload: chosenTodoId
  };
} 
