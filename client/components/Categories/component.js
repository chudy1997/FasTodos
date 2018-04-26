import React, { Component } from 'react';
import $ from 'jquery';

export default class CategoriesComponent extends Component {
  state = {
    input: ''
  };

  componentDidMount = () => {
    $.get('http://localhost:8000/categories').then(categories => this.props.fetchCategories(categories.sort((a, b) => b.categoryId - a.categoryId)));
  }

  createCategories = () => {
    let id = -1;
    return this.props.categories.map(category =>
        <li style={{backgroundColor:this.props.colorMap[category.categoryId%Object.keys(this.props.colorMap).length]}} key={(id++)} id={id} className={this.props.chosenCategoryId == id ? 'category chosen-category': 'category'} onClick={this.chooseCategory} >
            {category.categoryName}
        </li>
    );
  }

  chooseCategory = (e) => {
    if(this.props.chosenCategoryId===e.target.id){
      this.props.chooseCategory(-1);
    } else {
      this.props.chooseCategory(e.target.id);
    }


  }
  handleChange = (e) => this.setState({ input: e.target.value});

  handleSubmit = (e) => {
    let categoryName = this.state.input.trim();
    if(this.isInputValid(categoryName)){
        let categories = this.props.categories;
    
        $.post(`http://localhost:8000/categories/new?categoryName=${categoryName}`).then(res => {
          var newCategory = { categoryId: res.insertId, categoryName: categoryName };
          categories.unshift(newCategory);
          this.props.fetchCategories(categories);
        });

        this.setState({input: ''});
    }

    e.preventDefault();
}

  isInputValid = (categoryName) => categoryName.length > 0 
      && !this.props.categories.some(category => category.categoryName === categoryName);

  render = () => {
    return (
      <div className="categories">
        <form className="form" onSubmit={this.handleSubmit}>
          <input className="input" onChange={this.handleChange} type="text" maxLength="20" value={this.state.input} placeholder="Add new category..."/>
        </form>
        <ol className='categories-list'>
          {this.createCategories()}
        </ol>
      </div>
    );
  }
}