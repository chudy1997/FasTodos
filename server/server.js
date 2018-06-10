const express = require('express');
const bodyParser = require('body-parser');
const authors = ['Krzysztof Balwierczak', 'Karol Bartyzel', 'Adam Dyszy', 'Weronika Gancarczyk', 'Maciej Mizera', 'Anna Zubel'];
var PORT = 8000;
if (process.env.PORT){
  PORT=process.env.PORT;
}

const DEBUG = false;

createServer();
const db = require('./db').initDb('./dbConf.json');

//Server
function createServer() {
  const server = express();
  server.use(bodyParser.urlencoded({ extended: false }));
  server.listen(PORT);

  server.get('/authors', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(authors);
  });

  server.get('/todos', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    db.getTodos().then((todos) => {
      res.send(todos);
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when fetching todos');
      });
  });

  server.post('/todos/new', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const text = req.query.text;
    const categoryId = req.query.categoryId;
    const deadline = req.query.deadline != null ? req.query.deadline : null;
    const priority = req.query.priority;
    db.addTodo(text, categoryId, deadline, priority).then((todoId) => {
      res.status(200).send(todoId);
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when adding new todo');
      });
  });

  server.post('/todos/finish', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const todoId = req.query.id;
    const value = req.query.value;

    db.finishTodo(todoId, value).then(() => {
      res.status(200).send();
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when toggling finished todo');
      });
  });

  server.post('/todos/updatePriority', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const todoId = req.query.id;
    const newPriority = req.query.value;
    db.updateTodosPriority(todoId, newPriority).then(() => {
      res.status(200).send();
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when updating todo\'s priority');
      });
  });

  server.post('/todos/delete', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const todoId = req.query.id;

    db.deleteTodo(todoId).then(() => {
      res.status(200).send();
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when deleting todo');
      });
  });

  server.post('/todos/changeCategory', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { todoId, categoryId } = req.query;

    db.changeCategory(todoId, categoryId).then((todoId) => {
      res.status(200).send(todoId);
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occurred when changing category');
      });
  });

  server.post('/todos/changeDeadline', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {todoId, deadline} = req.query;

    db.changeDeadline(todoId, deadline).then((todoId) => {
      res.status(200).send(todoId);
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occurred when changing category');
      })
  });

  server.post('/todos/update', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { todoId, text, finished, deadline, categoryId, description } = req.query;
    db.updateTodo(todoId, text, finished, deadline, categoryId, description)
      .then((todoId) => {
        res.status(200).send(todoId);
      })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occurred when updating todo.');
      });
  });

  server.get('/categories', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    db.getCategories()
      .then((categories) => {
        res.send(categories);
      })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when fetching categories');
      });
  });

  server.post('/categories/new', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const categoryName = req.query.categoryName;

    db.addCategory(categoryName).then((categoryId) => {
      res.status(201).send(categoryId);
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when adding new category');
      });
  });

  server.post('/todos/changeCategory', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { todoId, categoryId } = req.query;

    db.changeCategory(todoId, categoryId)
      .then(() => res.status(200).send('Category deleted successfully'))
      .catch(err => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occured when deleting category');
      });
  });

  server.post('/categories/delete', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const categoryId = req.query.categoryId;

    db.deleteCategory(categoryId).then(res.status(200).send('Category deleted successfully'))
      .catch((err) => {
        if (DEBUG){console.log(err);}

        res.status(500).send('Problem occured when deleting category');
      });
  });

  server.post('/todos/setDescription', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const todoId =req.query.todoId;
    const description =req.query.description;
    db.setDescription(todoId, description).then((todoId) => {
      res.status(201).send(todoId);
    })
      .catch((err) => {
        if (DEBUG){console.log(err);}
        res.status(500).send('Problem occurred when setting description');
      });
  });

  return server;
}
