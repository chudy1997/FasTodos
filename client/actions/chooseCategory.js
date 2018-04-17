export default function(chosenCategoryId) {
    return {
        type: 'CATEGORY_CHOSEN',
        payload: chosenCategoryId
    };
} 