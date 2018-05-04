const mysql = require('mysql');

module.exports = {
    initDb: function initDb(configFile) {
        const dbConnectionInfo = require(configFile);
        const pool = mysql.createPool(dbConnectionInfo);
        createTables();

        function executeSql(query, callback) {
            pool.getConnection((err, con) => {
                if (err) throw err;
                con.query(query, callback);
            });
        }

        function createTables() {
          executeSql("CREATE TABLE IF NOT EXISTS `categories` (categoryId INT AUTO_INCREMENT PRIMARY KEY, categoryName VARCHAR(255))",
            (err, result) => {
              if (err) throw err;
            });
            executeSql("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255), finished BOOL, deadline DATETIME, categoryId INT, FOREIGN KEY (categoryId) REFERENCES categories(categoryId))",
                (err, result) => {
                    if (err) throw err;
                });
        }

        function clearDb() {
            executeSql("DELETE FROM `todos`",
                (err, result) => {
                    if (err) throw err;
                });
            executeSql("DELETE FROM `categories`",
                (err, result) => {
                    if (err) throw err;
                });
        }

        function getTodos() {
            return new Promise((resolve, reject) => {
                executeSql('SELECT * FROM todos',
                    (err, result) => {
                        if (err) reject(err);
                        const todos = result.map(rowDataPacket => {
                            return {
                                todoId: rowDataPacket.todoId,
                                text: rowDataPacket.text,
                                finished: rowDataPacket.finished,
                                categoryId: rowDataPacket.categoryId
                            };
                        });
                        resolve(todos);
                    });
            });
        }

        function addTodo(text, categoryId) {
            const defaultCategoryId = 1;
            categoryId = categoryId ? categoryId : defaultCategoryId;
            return new Promise((resolve, reject) => {
                executeSql(`INSERT INTO todos (text, finished, categoryId) VALUES ('${text}', 0, ${categoryId})`,
                    (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
            });
        }

        function finishTodo(todoId) {
            executeSql(`UPDATE todos SET finished = 1 WHERE todoId=${todoId}`,
                (err, result) => {
                    if (err) throw err;
                });
        }

        function getCategories() {
            return new Promise((resolve, reject) => {
                executeSql('SELECT * FROM categories',
                    (err, result) => {
                        if (err) reject(err);
                        const categories = result.map(rowDataPacket => {
                            return {
                                categoryId: rowDataPacket.categoryId,
                                categoryName: rowDataPacket.categoryName
                            };
                        });
                        resolve(categories);
                    });
            });
        }

        function addCategory(categoryName) {
            return new Promise((resolve, reject) => {
                executeSql(`INSERT INTO categories (categoryName) VALUES ('${categoryName}')`,
                    (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
            });
        }

        function closeDb() {
            pool.end();
        }

        return {
            executeSql: executeSql,
            clearDb: clearDb,
            closeDb: closeDb,
            getTodos: getTodos,
            addTodo: addTodo,
            finishTodo: finishTodo,
            getCategories: getCategories,
            addCategory: addCategory
        };
    }
}