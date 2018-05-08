export default function(state = [], action){
    switch(action.type){
        case 'TODOS_FETCHED':
            return action.payload;
    }
    return state;
}