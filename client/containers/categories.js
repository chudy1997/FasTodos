import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Todos from './../components/Categories';
import fetchCategories from './../actions/fetchCategories';
import chooseCategory from './../actions/chooseCategory';

function mapStateToProps(state){
    return {
        categories: state.categories,
        chosenCategoryId: state.chosenCategoryId
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({fetchCategories: fetchCategories, chooseCategory: chooseCategory}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Todos); 