import React from 'react';
import { bindActionCreators } from 'redux';

import fetchCategories from './../../actions/fetchCategories';
import chooseCategory from './../../actions/chooseCategory';

function mapStateToProps(state){
    return {
        categories: state.categories,
        chosenCategoryId: state.chosenCategoryId,
        colorMap: state.colorMap
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({fetchCategories: fetchCategories, chooseCategory: chooseCategory}, dispatch);
}

export default {
    mapStateToProps, 
    matchDispatchToProps
}; 