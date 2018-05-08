export default function(state = null, action){
    switch(action.type){
        case 'CATEGORY_CHOSEN':
            return action.payload
    }
    return state;
}