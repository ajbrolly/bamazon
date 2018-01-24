var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// function displayItems() {
//     connection.query('SELECT * FROM products', function (err, res) {
//         if (err) throw err;
//         console.log(res);
//     });
// }

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_qty <= ?', 5, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
}

function mainMenu() {
    inquirer.prompt([{
        type: 'list',
        name: 'return',
        message: 'Would you like to go back to the main menu?',
        choices: [
            'YES - Go to Main Menu',
            'NO - Exit Application'
        ]
    }]).then(function (answers) {
        if (answers.return === 'YES - Go to Main Menu') {
            goShopping();
        } else {
            console.log('Come back again!');
            connection.end();
        }
    });
}


function goShopping() {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add New Product',
            'Add to Inventory'
        ]
    }]).then(function (answers) {
        if (answers.choice === 'View Products for Sale') {
            connection.query('SELECT * FROM products', function (err, res) {
                if (err) throw err;
                console.table(res);
                inquirer.prompt([{
                    type: 'input',
                    name: 'id',
                    message: 'List the product ID for the item you would like to purchase:'
                }]).then(function (answers) {
                    connection.query('SELECT * FROM products WHERE id = ?', [answers.id], function (err, res) {
                        if (err) throw err;
                        var productID = answers.id;
                        var currentStock = parseInt(res[0].stock_qty);
                        console.log('Item No.', productID, 'currently has a total stock of:', currentStock);
                        inquirer.prompt([{
                            type: 'input',
                            name: 'qty',
                            message: 'List the quantity you would like to purchase:'
                        }]).then(function (answers) {
                            console.log('You would like to purchase ', answers.qty, ' of Item No. ', productID);
                            if (parseInt(answers.qty) <= currentStock) {
                                newQty = parseInt();
                                connection.query('UPDATE products SET ? WHERE ?', [{
                                    stock_qty: currentStock - parseInt(answers.qty)
                                }, {
                                    id: productID
                                }], function (err, res) {
                                    if (err) throw err;
                                    connection.query('SELECT * FROM products', function (err, res) {
                                        if (err) throw err;
                                        var orderTotal = parseInt(answers.qty) * parseInt(res[0].price);
                                        console.log('Order Total: $' + orderTotal);
                                        console.log('Thank you for your order!');
                                        console.log('Item ', productID, 'inventory has been updated.');
                                        mainMenu();
                                    });
                                });
                            }
                            else {
                                console.log('Insufficient inventory. Only ', currentStock, 'remaining.');
                                mainMenu();
                                connection.end();
                            }
                        });
                    });
                });
            });
        } else if (answers.choice === 'View Low Inventory') {
            lowInventory();
            mainMenu();
        } else if (answers.choice === 'Add New Product') {
            inquirer.prompt([{
                type: 'input',
                name: 'product_name',
                message: 'What is the name of the product to add?',
            }, {
                type: 'input',
                name: 'dept_name',
                message: 'What department does it belong in?',
            },
            {
                type: 'input',
                name: 'price',
                message: 'What is the cost of this item?',
            }, {
                type: 'input',
                name: 'stock_qty',
                message: 'How much stock or inventory do you have?',
            },]).then(function (answers) {
                connection.query('INSERT INTO products SET ?', {
                    product_name: answers.product_name,
                    dept_name: answers.dept_name,
                    price: answers.price,
                    stock_qty: parseInt(answers.stock_qty)
                });
                console.log('Your product has been added!');
                mainMenu();
            });
        } else if (answers.choice === 'Add to Inventory') {
            connection.query('SELECT * FROM products', function (err, res) {
                if (err) throw err;
                console.table(res);
                inquirer.prompt([{
                    type: 'input',
                    name: 'id',
                    message: 'Which product would you like to update:'
                }]).then(function (answers) {
                    connection.query('SELECT * FROM products WHERE id = ?', [answers.id], function (err, res) {
                        var product = answers.id;
                        console.log('You are updating item ', product);
                        inquirer.prompt([{
                            type: 'input',
                            name: 'qty',
                            message: 'What is the new inventory total: '
                        }]).then(function (answers) {
                            connection.query('UPDATE products SET ? WHERE id = ?', [{
                                stock_qty: answers.qty
                            }, {
                                id: product
                            }], function (err, res) {
                                console.log('Your item has been updated!');
                                mainMenu();
                            });
                        if (err) {
                            console.log('Uh Oh! Something went wrong. Try again later.');
                            mainMenu();
                        }
                        });
                    });
                });
            });
        }
    });
}

goShopping();
