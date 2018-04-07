var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var server = createServer();

//Change it to your own connection info
const dbConnectionInfo =  {
    host: "127.0.0.1",
    user: "karol",
    password: "password",
    database: "fastodos"
};
var con = createDb(dbConnectionInfo);
const authors = ['Krzysztof Balwierczak', 'Karol Bartyzel', 'Adam Dyszy', 'Weronika Gancarczyk', 'Maciej Mizera', 'Anna Zubel'];

function createServer(){
    var server = express();
    const PORT = 8000;
    
    server.use(bodyParser.urlencoded({ extended: false }));
    
    server.listen(PORT);
    server.get('/authors', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(authors);
    });

    server.get('/todos/:id', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var userId = req.params.id;

        getTodos(userId).then((userTodos) => {
            res.send(userTodos);
        })
        .catch((err) => {
            res.status(500).send('Problem occured when fetching todos');
        });
    });

    server.post('/users/new', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var name = req.body.name;

        addUser(name).then((userId) => {
            res.status(201).send(userId);
        })
        .catch((err) => {
            res.status(500).send('Problem occured when adding new user');
        });
    });

    server.post('/todos/new', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var userId = req.body.id;
        var text = req.body.text;

        addTodo(userId, text).then((todoId) => {
            res.status(201).send(todoId);
        })
        .catch((err) => {
            res.status(500).send('Problem occured when adding new todo');
        });
    });

    server.put('/todos/:id/finish', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var todoId = req.params.id;

        finishTodo(todoId);
        res.status(200).send('Ok');
    });

    return server;
}

function createDb(dbConnectionInfo){
    var con = mysql.createConnection(dbConnectionInfo);
    
    con.connect(function(err) {
        if (err) throw err;
        con.query("CREATE DATABASE IF NOT EXISTS `FasTodos`", (err, result) => {
            if (err) throw err;
        });

        con.query("CREATE TABLE IF NOT EXISTS `users` (userId INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))", (err, result) => {
            if (err) throw err;
        });

        con.query("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, userId INT, text VARCHAR(255), finished BOOL, FOREIGN KEY (userId) REFERENCES users(userId))", 
        (err, result) => {
            if (err) throw err;
        });
    });

    return con;
}

function getTodos(userId){
    return new Promise((resolve, reject) => {
        con.connect((err) => {
            con.query(`SELECT * FROM todos WHERE userId=${userId}`, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        })
    });
}

function addUser(name){
    return new Promise((resolve, reject) => {
        con.connect((err) => {
            con.query(`INSERT INTO users (name) VALUES ('${name}')`, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        })
    });
}

function addTodo(userId, text){
    return new Promise((resolve, reject) => {
        con.connect((err) => {
            con.query(`INSERT INTO todos (userId, text, finished) VALUES (${userId}, '${text}', 0)`, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        })
    });
}

function finishTodo(todoId){
    con.connect((err) => {
        con.query(`UPDATE todos SET finished = 1 WHERE todoId=${todoId}`);
    });
}