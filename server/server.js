const express = require('express');
const bodyParser = require('body-parser');
const authors = ['Krzysztof Balwierczak', 'Karol Bartyzel', 'Adam Dyszy', 'Weronika Gancarczyk', 'Maciej Mizera', 'Anna Zubel'];
const PORT = 8000;

const server = createServer();
const db = require('./db').initDb('./dbConf.json');

//Server
function createServer(){
    const server = express();
    server.use(bodyParser.urlencoded({ extended: false }));
    server.listen(PORT);

    server.get('/authors', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(authors);
    });

    server.get('/todos', (req,res) =>{
        res.setHeader('Access-Control-Allow-Origin', '*');
        db.getTodos().then((todos) => {
            res.send(todos);
        })
        .catch((err) =>{
            res.status(500).send('Problem occured when fetching todos');
        });
    });

    server.post('/todos/new', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const text = req.query.text;
        const categoryId = req.query.categoryId;
        const deadline = req.query.deadline != null ? req.query.deadline : null;
        db.addTodo(text, categoryId, deadline).then((todoId) => {
            res.status(201).send(todoId);
        })
            .catch((err) => {
                res.status(500).send('Problem occured when adding new todo');
            });
    });

    server.post('/todos/finish', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const todoId = req.query.id;
        const value = req.query.value;

        db.finishTodo(todoId, value);
        res.status(200).send('Ok');
    });

  server.get('/categories', (req,res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');

    db.getCategories().then((categories) => {
      res.send(categories);
    })
    .catch((err) =>{
        res.status(500).send('Problem occured when fetching categories');
  })
    });

  server.post('/categories/new', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var categoryName = req.query.categoryName;

    db.addCategory(categoryName).then((categoryId) => {
      res.status(201).send(categoryId);
    })
    .catch((err) => {
        res.status(500).send('Problem occured when adding new category');
    });
  });

    return server;
}

