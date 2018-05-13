const mysql = require('mysql');

module.exports = {
  initDb: function initDb(configFile) {
    const dbConnectionInfo = require(configFile);
    const pool = mysql.createPool(dbConnectionInfo);
    createTables();

    function executeSql(query, callback) {
      pool.getConnection((err, con) => {
        if (err) {throw err;}
        con.query(query, callback);
      });
    }

    function createTables() {
      executeSql("CREATE TABLE IF NOT EXISTS `categories` (categoryId INT AUTO_INCREMENT PRIMARY KEY, categoryName VARCHAR(255))",
        (err, result) => {
          if (err) {throw err;}
        });
      executeSql("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255), finished BOOL, categoryId INT, FOREIGN KEY (categoryId) REFERENCES categories(categoryId))",
        (err, result) => {
          if (err) {throw err;}
        });
    }

    function clearDb() {
      executeSql("DELETE FROM `todos`",
        (err, result) => {
          if (err) {throw err;}
        });
      executeSql("DELETE FROM `categories`",
        (err, result) => {
          if (err) {throw err;}
        });
    }

    function getTodos() {
      return new Promise((resolve, reject) => {
        executeSql('SELECT * FROM todos',
          (err, result) => {
            if (err) {reject(err);}
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
            if (err) {reject(err);}
            resolve(result);
          });
      });
    }

    function finishTodo(todoId, value) {
      executeSql(`UPDATE todos SET finished=${value} WHERE todoId=${todoId}`,
        (err, result) => {
          if (err) {throw err;}
          //resolve(result);
        });
    }

    function deleteTodo(todoId) {
          return new Promise((resolve, reject) => {
              executeSql(`DELETE FROM todos WHERE todoId = '${todoId}'`,
                  (err, result) => {
                      if (err) reject(err);
                      resolve(result);
                  });
          });
    }

    function getCategories() {
      return new Promise((resolve, reject) => {
        executeSql('SELECT * FROM categories',
          (err, result) => {
            if (err) {reject(err);}
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
            if (err) {reject(err);}
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
      addCategory: addCategory,
      deleteTodo: deleteTodo
    };
  }
};
        function deleteCategory(categoryId) {
          updateTodosCategory(categoryId);
          return new Promise((resolve, reject) => {
                executeSql(`DELETE FROM categories WHERE categoryId = '${categoryId}'`,
                    (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
            });
        }

        function updateTodosCategory(categoryId) {
          executeSql(`UPDATE todos SET categoryId = 1 WHERE categoryId = '${categoryId}'`,
            (err, result) => {
              if (err) throw err;
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
            addCategory: addCategory,
            deleteCategory: deleteCategory,
            updateTodosCategory: updateTodosCategory
        };
    }
}
