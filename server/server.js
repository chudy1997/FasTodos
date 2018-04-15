const express = require('express');
const bodyParser = require('body-parser');
const authors = ['Krzysztof Balwierczak', 'Karol Bartyzel', 'Adam Dyszy', 'Weronika Gancarczyk', 'Maciej Mizera', 'Anna Zubel'];
const PORT = 8000;

const server = createServer();
const db = require('./db').default;

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
        const userId = req.body.id;
        const text = req.body.text;

        db.addTodo(userId, text).then((todoId) => {
            res.status(201).send(todoId);
        })
        .catch((err) => {
            res.status(500).send('Problem occured when adding new todo');
        });
    });

    server.put('/todos/:id/finish', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const todoId = req.params.id;

        db.finishTodo(todoId);
        res.status(200).send('Ok');
    });

    return server;
}