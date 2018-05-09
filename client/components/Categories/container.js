import React from 'react';
import { bindActionCreators } from 'redux';

import fetchCategories from './../../actions/fetchCategories';
import fetchTodos from './../../actions/fetchTodos';
import chooseCategory from './../../actions/chooseCategory';

function mapStateToProps(state){
    return {
        categories: state.categories,
        chosenCategoryId: state.chosenCategoryId,
        todos: state.todos,
        colorMap: state.colorMap
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({fetchCategories: fetchCategories, fetchTodos: fetchTodos, chooseCategory: chooseCategory}, dispatch);
}

export default {
    mapStateToProps, 
    matchDispatchToProps
};
