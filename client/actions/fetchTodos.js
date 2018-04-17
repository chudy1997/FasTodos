export default function(todos) {
    return {
        type: 'TODOS_FETCHED',
        payload: todos
    };
} 