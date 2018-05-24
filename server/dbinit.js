const mysql = require('mysql');
const dbConnectionInfo = require('./dbConf.json');
const pool = mysql.createPool(dbConnectionInfo);


let p = new Promise((resolve, reject) => {
  executeSql("CREATE DATABASE IF NOT EXISTS fastodos;",
    (err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
});

p.then(new Promise((resolve) => {
  executeSql("USE fastodos;",
    (err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
}));

p.then(new Promise((resolve) => {
  executeSql("CREATE TABLE IF NOT EXISTS `categories` (categoryId INT AUTO_INCREMENT PRIMARY KEY, categoryName VARCHAR(255))",
    (err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
}));

p.then(new Promise((resolve) => {
  executeSql("CREATE TABLE IF NOT EXISTS `todos` (todoId INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255)," +
    " finished BOOL, categoryId INT, deadline DATETIME, FOREIGN KEY (categoryId) REFERENCES categories(categoryId))",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
}));


p.then(new Promise((resolve) => {
  executeSql("INSERT INTO categories(categoryId,categoryName) " +
    " SELECT '1','Other' WHERE NOT EXISTS(SELECT * FROM categories WHERE categoryName='Other');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
}));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO categories(categoryId,categoryName) " +
    " SELECT '2','Home' WHERE NOT EXISTS(SELECT * FROM categories WHERE categoryName='Home');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO categories(categoryId,categoryName) " +
    " SELECT '3','Work' WHERE NOT EXISTS(SELECT * FROM categories WHERE categoryName='Work');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId,deadline)\n" +
    " SELECT 'Fix car','0','1',NOW() WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Fix car' AND categoryId='1');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId,deadline)\n" +
    " SELECT 'Meet Michael','0','1',NOW()+INTERVAL 1 DAY WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Meet Michael' AND categoryId='1');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId)\n" +
    " SELECT 'Pack for holiday','0','1' WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Pack for holiday' AND categoryId='1');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId,deadline)\n" +
    " SELECT 'Clean kitchen','0','2',NOW()+INTERVAL 2 DAY WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Clean kitchen' AND categoryId='2');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId)\n" +
    " SELECT 'Pay bills','0','2' WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Pay bills' AND categoryId='2');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId)\n" +
    " SELECT 'Call boss about oay rise','0','3' WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Call boss about oay rise' AND categoryId='3');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(new Promise((resolve => {
  executeSql("INSERT INTO todos(text,finished,categoryId)\n" +
    " SELECT 'Take holidays','0','3' WHERE NOT EXISTS(SELECT * FROM todos WHERE text='Take holidays' AND categoryId='3');",
  (err, result) => {
    if (err) {
      throw err;
    }
    resolve();
  });
})));

p.then(process.exit);

function executeSql(query, callback) {
  pool.getConnection((err, con) => {
    if (err) {
      throw err;
    }
    con.query(query, callback);
    con.release();
  });
}
