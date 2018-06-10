import { TODO_CHOSEN } from './../constants/actionConstants';

export default function(state = null, action){
  switch (action.type){
    case TODO_CHOSEN:
      return action.payload;
    default: 
      return state;
  }
}
