import { TODO_DRAGGED } from './../constants/actionConstants';

export default function(state = null, action){
  switch (action.type){
    case TODO_DRAGGED:
      return action.payload;
    default:
      return state;
  }
}
