import { CATEGORY_CHOSEN } from './../constants/actionConstants';

export default function(state = null, action){
  switch (action.type){
    case CATEGORY_CHOSEN:
      return action.payload;
    default:
      return state;
  }
}
