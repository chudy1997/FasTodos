import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';

import ajax from './../../ajax';

import fetchCategories from './../../actions/fetchCategories';
import fetchTodos from './../../actions/fetchTodos';
import chooseCategory from './../../actions/chooseCategory';

import './index.css';

class Categories extends Component {
    state = {
      input: ''
    };

    componentDidMount = () => {
      ajax('GET', 'categories', 5, 1000, categories => this.props.fetchCategories(categories.sort((a, b) => b.categoryId - a.categoryId), 
        () => {
          alert('Could not fetch todos from db with 5 tries at maximum 6 sec...');
        }));
    }

    createCategories = () => {
      let id = 0;
      return this.props.categories.map(category =>
        (
          <li 
            className={this.props.chosenCategoryId == id ? 'category chosen-category': 'category'} 
            id={id} 
            key={(id++)} 
            onClick={this.chooseCategory} 
            style={{ backgroundColor:this.props.colorMap[category.categoryId%Object.keys(this.props.colorMap).length] }} 
          >
            {category.categoryName}
          </li>)
      );
    };

    chooseCategory = (e) => {
      const id = e.target.id;
      this.props.chooseCategory(this.props.chosenCategoryId == id ? -1 : id);
    };

    handleChange = (e) => this.setState({ input: e.target.value });

    handleCategorySubmit = (e) => {
      const categoryName = this.state.input.trim();
      if (categoryName.length === 0) {NotificationManager.info('Category name has to have at least 1 character.');}
      else if (this.props.categories.some(category => category.categoryName === categoryName)) {NotificationManager.warning('Category already exists!');}
      else {
        const categories = this.props.categories;

        ajax('POST', `categories/new?categoryName=${categoryName}`, 5, 1000, res => {
          NotificationManager.success(`Successfully created category: ${categoryName}.`);
          const newCategory = { categoryId: res.insertId, categoryName: categoryName };
          categories.unshift(newCategory);
          this.props.fetchCategories(categories);
          this.setState({ input: '' });
        });
      }

      e.stopPropagation();
      e.preventDefault();
    };

    handleCategoryDelete = (e) => {
      if (this.props.chosenCategoryId<0){
        NotificationManager.warning('You need to choose the category to delete!');
      }
      else if (this.props.chosenCategoryId==this.props.categories.length-1){
        NotificationManager.warning('Category Default cannot be deleted');

      }
      else {
        const categories = this.props.categories;
        const todos = this.props.todos;
        const deletedCategoryId=categories[this.props.chosenCategoryId].categoryId;
        const defaultCategoryId=categories[this.props.categories.length-1].categoryId;

        ajax('POST', `categories/delete?categoryId=${deletedCategoryId}`, 5, 1000, res => {
          NotificationManager.success(`Successfully deleted category: ${categories[this.props.chosenCategoryId].categoryName}.`);
          categories.splice(this.props.chosenCategoryId,1);
          this.props.fetchCategories(categories);
          for (let t in todos){
            if (todos[t].categoryId===deletedCategoryId){
              todos[t].categoryId=defaultCategoryId;
            }
          }
          this.props.fetchTodos(todos);
          this.props.chooseCategory(-1);
        }, 
        () => {
          alert('Could not fetch categories from db with 5 tries at maximum 6 sec...');
        });
      }
      e.preventDefault();
    }

    isInputValid = (categoryName) => categoryName.length > 0
        && !this.props.categories.some(category => category.categoryName === categoryName);

    render = () => {
      return (
        <div className="categories">
          <form  
            className="input-form"
            onSubmit={this.handleCategorySubmit}
          >
            <input 
              className="input"
              maxLength="20"
              onChange={this.handleChange}
              placeholder="Add new category..."
              type="text"
              value={this.state.input}
            />
            <button
              className="delete-button"
              onClick={this.handleCategoryDelete}
            >
                  Delete
            </button>
          </form>
          <div className='categories-list-wrapper'>
            <ol className='categories-list'>
              {this.createCategories()}
            </ol>
          </div>
        </div>
      );
    }
}

function mapStateToProps(state){
  return {
    categories: state.categories,
    todos: state.todos,
    chosenCategoryId: state.chosenCategoryId,
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators(
    {
      fetchCategories: fetchCategories, 
      fetchTodos: fetchTodos,
      chooseCategory: chooseCategory
    }, 
    dispatch
  );
}



export default connect(mapStateToProps, matchDispatchToProps)(Categories);
