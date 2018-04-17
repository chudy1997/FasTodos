export default function(state = [], action){
    switch(action.type){
        case 'CATEGORIES_FETCHED':
            return action.payload;
    }
    return state;
}