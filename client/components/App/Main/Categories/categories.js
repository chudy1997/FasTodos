import React, { Component } from 'react';
import './categories.scss';

class Categories extends Component {
  state = {
    newCategory: '',
    categories: [],
    chosenCategoryId: '0',
    currId: 0
  };

  componentDidMount(){
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCategories();
    this.chooseCategory = (e) => {
      this.setState({ chosenCategoryId: e.target.id });
    };
  }

  getCategories(){
    $.get('http://localhost:8000/categories').then((res) => this.setState({ categories: res }));
    console.log(this.state.categories.map(function(e){return e.categoryId;}));
  }

  handleChange(e) {
    this.setState({ newCategory: e.target.value });
  }

  isInputValid(){
    if(this.state.newCategory==="") {
      alert('A new category must have a name');
      return false;
    } else if (this.state.categories.map(function(e){return e.categoryName;}).indexOf(this.state.newCategory)!==-1){
      alert('There is already a category named: '+this.state.newCategory+' in database');
      return false;
    }
    return true;
  }

  handleSubmit(e) {
    if(this.isInputValid()) {
      $.post('http://localhost:8000/categories/new?categoryName='.concat(this.state.newCategory)).then();
      let categories = this.state.categories;
      let currId = this.state.currId;
      currId++;
      var inputCategory = {categoryName: this.state.newCategory, categoryId: currId};
      categories.push(inputCategory);
    }
    this.setState({newCategory: ''});
    e.preventDefault();
  }

  render() {
    return (
      <div className='categories-span'>
        <form onSubmit={this.handleSubmit}>
          <input className="input" onChange={this.handleChange} type="text" value={this.state.newCategory}/>
          <input className="addButton" type="submit" value="Add"/>
        </form>
        <ol className='categories'>
          {
            this.state.categories.map((category) => <li id={category.categoryId} key={category.categoryId} onClick={this.chooseCategory}
                                                        className={this.state.chosenCategoryId == category.categoryId ? 'categories-element chosen-categories-element': 'categories-element'}>{category.categoryName}</li>)
          }
        </ol>
      </div>
    );
  }
}

export default Categories;
