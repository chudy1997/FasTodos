import { TODO_DRAGGED } from './../constants/actionConstants';

export default function(draggedTodo) {
  return {
    type: TODO_DRAGGED,
    payload: draggedTodo
  };
}
