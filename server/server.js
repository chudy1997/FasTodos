const express = require('express');
const bodyParser = require('body-parser');
const authors = ['Krzysztof Balwierczak', 'Karol Bartyzel', 'Adam Dyszy', 'Weronika Gancarczyk', 'Maciej Mizera', 'Anna Zubel'];

var PORT = null;
if(process.env.PORT){//if port is set as environment variable
  PORT=process.env.PORT;
}
else{
  PORT=8000;//default value
}

console.log("port = "+PORT);

const db = require('./db').initDb('./dbConf.json');//if CLEARDB_HOST is set = if server on heroku then dbConf is ignored
const server = createServer();

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
        var text = req.query.text;
        var categoryId = req.query.categoryId;

        db.addTodo(text, categoryId).then((todoId) => {
            res.status(201).send(todoId);
        })
            .catch((err) => {
                res.status(500).send('Problem occured when adding new todo');
            });
    });

    server.put('/todos/finish', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const todoId = req.params.id;

        db.finishTodo(todoId);
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

