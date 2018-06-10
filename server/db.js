const mysql = require('mysql');

module.exports = {
  initDb: function initDb(configFile) {
    const dbConnectionInfo = require(configFile);
    const pool = mysql.createPool(dbConnectionInfo);
    createTables();

    function executeSql(query, callback) {
      pool.getConnection((err, con) => {
        if (err) {
          throw err;
        }
        con.query(query, callback);
        con.release();
      });
    }

    function createTables() {
      executeSql("CREATE TABLE IF NOT EXISTS `categories` (categoryId INT AUTO_INCREMENT PRIMARY KEY, categoryName VARCHAR(255))",
        (err, result) => {
          if (err) {
            throw err;
          }
          executeSql("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255), finished BOOL, deadline DATETIME, priority INT, categoryId INT, description TEXT, FOREIGN KEY (categoryId) REFERENCES categories(categoryId))",
            (err, result) => {
              if (err) {
                throw err;
              }
              executeSql('SELECT * FROM categories WHERE categoryName = \'Default\'',
                (err, result) => {
                  if (err) {
                    throw err;
                  }
                  if (result.length < 1) {
                    addCategory("Default");
                  }
                });
            });
        }
      );
    }

    function clearDb() {
      executeSql("DELETE FROM `todos`",
        (err, result) => {
          if (err) {
            throw err;
          }
        }
      );

      executeSql("DELETE FROM `categories`",
        (err, result) => {
          if (err) {
            throw err;
          }
        }
      );
    }

    function closeDb() {
      pool.end();
    }



    function getTodos() {
      return new Promise((resolve, reject) => {
        executeSql('SELECT * FROM todos',
          (err, result) => {
            if (err) {
              reject(err);
            }
            const todos = result.map(rowDataPacket => {
              return {
                todoId: rowDataPacket.todoId,
                text: rowDataPacket.text,
                finished: rowDataPacket.finished,
                deadline: rowDataPacket.deadline,
                priority: rowDataPacket.priority,
                categoryId: rowDataPacket.categoryId,
                description: rowDataPacket.description,
              };
            });
            resolve(todos);
          });
      });
    }

    function addTodo(text, categoryId, deadline, priority) {
      const defaultCategoryId = 1;
      categoryId = categoryId ? categoryId : defaultCategoryId;
      return new Promise((resolve, reject) => {
        executeSql(`INSERT INTO todos (text, finished, categoryId, deadline, priority) VALUES ('${text}', 0, ${categoryId}, FROM_UNIXTIME(${deadline}), ${priority})`,
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    }

    function finishTodo(todoId, value) {
      return new Promise((resolve, reject) => {
        executeSql(`UPDATE todos SET finished=${value} WHERE todoId=${todoId}`,
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    }

    function updateTodosPriority(todoId, newPriority) {
      return new Promise((resolve, reject) => {
        executeSql(`UPDATE todos SET priority=${newPriority} WHERE todoId=${todoId}`,
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    }

    function deleteTodo(todoId) {
      return new Promise((resolve, reject) => {
        executeSql(`DELETE FROM todos WHERE todoId = '${todoId}'`,
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    }

    function updateTodo(todoId, text, finished, deadline, categoryId, description) {
      return new Promise((resolve, reject) => {
        function updateField(setQuery){
          executeSql(`UPDATE todos SET ${setQuery} WHERE todoId = '${todoId}'`, (err, result) => {
            if (err) {
              reject(err);
            }
          });
        }

        if (text !== null) {updateField(`text='${text}'`);}
        if (finished !== null) {updateField(`finished=${finished}`);}
        if (deadline !== null) {updateField(`deadline=FROM_UNIXTIME(${deadline})`);}
        if (categoryId !== null) {updateField(`categoryId=${categoryId}`);}
        if (description !== null) {updateField(`description='${description}'`);}
        resolve('Ok');
      });
    }



    function getCategories() {
      return new Promise((resolve, reject) => {
        executeSql('SELECT * FROM categories',
          (err, result) => {
            if (err) {
              reject(err);
            }
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
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    }

    function deleteCategory(categoryId) {
      updateTodosCategory(categoryId);
      return new Promise((resolve, reject) => {
        executeSql(`DELETE FROM categories WHERE categoryId = '${categoryId}'`,
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    }

    function updateTodosCategory(categoryId) {
      const defaultCategoryId = 1;
      executeSql(`UPDATE todos SET categoryId = '${defaultCategoryId}' WHERE categoryId = '${categoryId}'`,
        (err, result) => {
          if (err) {
            throw err;
          }
        });
    }

    function changeCategory(todoId, categoryId) {
      return new Promise((resolve, reject) => {
        executeSql(`UPDATE todos SET categoryId=${categoryId} WHERE todoId=${todoId}`,
          (err, result) => {
            if (err) {reject(err);}
            resolve(result);
          });
      });
    }

    function setDescription(todoId, description) {
      return new Promise((resolve, reject) => {
        executeSql(`UPDATE todos SET description=${description} WHERE todoId=${todoId}`,
          (err, result) => {
            if (err) {reject(err);}
            resolve(result);
          });
      });
    }

    return {
      executeSql: executeSql,
      clearDb: clearDb,
      closeDb: closeDb,
      getTodos: getTodos,
      addTodo: addTodo,
      deleteTodo: deleteTodo,
      finishTodo: finishTodo,
      updateTodosPriority: updateTodosPriority,
      updateTodo: updateTodo,
      getCategories: getCategories,
      addCategory: addCategory,
      deleteCategory: deleteCategory,
      updateTodosCategory: updateTodosCategory,
      changeCategory: changeCategory,
      setDescription: setDescription,
    };
  }
};
