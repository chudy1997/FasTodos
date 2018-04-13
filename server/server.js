var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

const dbConnectionInfo = require('./configuration.json');
const authors = ['Krzysztof Balwierczak', 'Karol Bartyzel', 'Adam Dyszy', 'Weronika Gancarczyk', 'Maciej Mizera', 'Anna Zubel'];
const PORT = 8000;

const server = createServer();
const pool = mysql.createPool(dbConnectionInfo);
createTables();

//Server
function createServer(){
    var server = express();
    server.use(bodyParser.urlencoded({ extended: false}));
    server.listen(PORT);

    server.get('/authors', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(authors);
    });

    server.get('/todos', (req,res) =>{
        res.setHeader('Access-Control-Allow-Origin', '*');

        getTodos().then((todos) => {
            res.send(todos);
        })
            .catch((err) =>{
                console.log('Error');
                res.status(500).send('Problem occured when fetching todos');
            });

    });

    server.post('/todos/new', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var text = req.query.text;

        addTodo(text).then((todoId) => {
            res.status(201).send(todoId);
        })
            .catch((err) => {
                res.status(500).send('Problem occured when adding new todo');
            });
    });

    server.put('/todos/finish', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var todoId = req.query.id;
        console.log(req);

        finishTodo(todoId);
        res.status(200).send('Ok');
    });

    return server;
}

//DB
function executeSql(query, callback){
    pool.getConnection((err, con) => {
        if (err) throw err;
        con.query(query, callback);
    });
}

function createTables(){
    executeSql("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255), finished BOOL)",
        (err, result) => {
            if (err) throw err;
        });
}

function getTodos(){
    return new Promise((resolve,reject) => {
        executeSql('SELECT * FROM todos',
            (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
    });
}

function addTodo(text){
    return new Promise((resolve, reject) => {
        executeSql(`INSERT INTO todos (text, finished) VALUES ('${text}', 0)`,
            (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
    });
}

function finishTodo(todoId){
    executeSql(`UPDATE todos SET finished = 1 WHERE todoId=${todoId}`,
        (err, result) => {
            if (err) throw err;
        });
}