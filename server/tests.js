const setTimeout = require('timers').setTimeout;
const assert = require('assert');
var passed = 0, failed = 0;
const db = require('./db').initDb('./testdbConf.json');

function runTest(test){
    return new Promise((resolve, reject) => {
        test()
        .then((res) => {
            console.log(`${test.name}: ${res}`);
            passed++;
            resolve();
        })
        .catch(err => {
            console.log(`${test.name}: ${err}`);
            failed++;
            resolve();
        });
    });
}

function tearUp(){
    console.log(`Passed: ${passed}\nFailed: ${failed}`);
    db.closeDb();
    process.exit();
}

function runTests(tests){
    Promise.all(tests.map(test => runTest(test))).then(() => tearUp());
}

function getTodosTest(){
    return new Promise((resolve, reject) => {
        //setup
        db.clearDb();

        const testTodos = [
            {text: 'todo1', finished: 0},
            {text: 'todo2', finished: 1},
            {text: 'todo3', finished: 0},
            {text: 'todo4', finished: 1},
            {text: 'todo5', finished: 0},
        ];
            
        Promise.all(
            testTodos.map(todo => {
                return new Promise((resolve, reject) => {
                    db.executeSql(`INSERT INTO todos (text, finished) VALUES ('${todo.text}', ${todo.finished})`, (err, result) => {
                        if(err) reject(err);
                        resolve({
                            todoId: result.insertId,
                            text: todo.text,
                            finished: todo.finished
                        });
                    });
                });
            })
        )

        //assert
        .then(expectedTodos => {
            db.getTodos()
            .then((todosRowDataPackets) => {
                const todos = todosRowDataPackets.map(rowDataPacket => { 
                    return {
                        todoId: rowDataPacket.todoId,
                        text: rowDataPacket.text,
                        finished: rowDataPacket.finished
                    }
                });
                assert.deepStrictEqual(todos, expectedTodos);
                resolve('passed');
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
}

function getCategoriesTest(){
  return new Promise((resolve, reject) => {
    //setup
    db.clearDb();

    const testCategories = [
      {categoryName: 'category1'},
      {categoryName: 'category2'},
      {categoryName: 'category3'},
      {categoryName: 'category4'},
      {categoryName: 'category5'},
    ];

    Promise.all(
      testCategories.map(category => {
        return new Promise((resolve, reject) => {
          db.executeSql(`INSERT INTO categories (categoryName) VALUES ('${category.categoryName}')`, (err, result) => {
            if(err) reject(err);
            resolve({
              categoryId: result.insertId,
              categoryName: category.categoryName,
            });
          });
        });
      })
    )

    //assert
      .then(expectedCategories => {
        db.getCategories()
          .then((categoriesRowDataPackets) => {
            const categories = categoriesRowDataPackets.map(rowDataPacket => {
              return {
                categoryId: rowDataPacket.categoryId,
                categoryName: rowDataPacket.categoryName,
              }
            });
            assert.deepStrictEqual(categories, expectedCategories);
            resolve('passed');
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}

const tests = [getTodosTest,getCategoriesTest];
runTests(tests);
