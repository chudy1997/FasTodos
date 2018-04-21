const mysql = require('mysql');
const dbConnectionInfo = require('./dbConf.json');
const pool = mysql.createPool(dbConnectionInfo);

createTables();

function executeSql(query, callback) {
  pool.getConnection((err, con) => {
    if (err) {
      throw err;
    }
    con.query(query, callback);
  });
}

function createTables() {
  executeSql("CREATE DATABASE IF NOT EXISTS fastodos;",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
  executeSql("USE fastodos;",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
  executeSql("CREATE TABLE IF NOT EXISTS `categories` (categoryId INT AUTO_INCREMENT PRIMARY KEY, categoryName VARCHAR(255))",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
  executeSql("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255), finished BOOL, categoryId INT, FOREIGN KEY (categoryId) REFERENCES categories(categoryId))",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
  executeSql("INSERT INTO categories(categoryId,categoryName) " +
    " SELECT '1','Other' WHERE NOT EXISTS(SELECT * FROM categories WHERE categoryName='Other');",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
  executeSql("INSERT INTO categories(categoryId,categoryName) " +
    " SELECT '2','Home' WHERE NOT EXISTS(SELECT * FROM categories WHERE categoryName='Home');",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
  executeSql("INSERT INTO categories(categoryId,categoryName) " +
    " SELECT '3','Work' WHERE NOT EXISTS(SELECT * FROM categories WHERE categoryName='Work');",
    (err, result) => {
      if (err) {
        throw err;
      }
    });
}
