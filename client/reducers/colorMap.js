export default function(state =[] , action){
  switch(action.type){
    case 'COLOR_MAP_FETCHED':
      return action.payload;
  }
  return state;
}