import { CATEGORIES_FETCHED } from './../constants/actionConstants';

export default function(categories) {
  return {
    type: CATEGORIES_FETCHED,
    payload: categories
  };
} 
