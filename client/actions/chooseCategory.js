import { CATEGORY_CHOSEN } from './../constants/actionConstants';

export default function(chosenCategoryId) {
  return {
    type: CATEGORY_CHOSEN,
    payload: chosenCategoryId
  };
} 
