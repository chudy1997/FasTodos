import { CATEGORIES_FETCHED } from './../constants/actionConstants';

export default function(state = [], action){
  switch (action.type){
    case CATEGORIES_FETCHED:
      return action.payload;
    default:
      return state;
  }
}