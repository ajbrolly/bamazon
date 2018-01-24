var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

function displayItems() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.log(res);
    })
};


function goShopping() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.log(res);
        inquirer.prompt([{
            type: 'input',
            name: 'id',
            message: 'List the product ID for the item you would like to purchase:'
        }]).then(function (answers) {
            connection.query('SELECT * FROM products WHERE id = ?', [answers.id], function (err, res) {
                if (err) throw err;
                var productID = answers.id;
                var price = answers.price;
                var currentStock = res[0].stock_qty;
                console.log('Item No.', productID, 'currently has a total stock of:', currentStock);
                inquirer.prompt([{
                    type: 'input',
                    name: 'qty',
                    message: 'List the quantity you would like to purchase:'
                }]).then(function (answers) {
                    console.log('You would like to purchase ', answers.qty, ' of Item No. ', productID);
                    if (parseInt(answers.qty) <= currentStock) {
                        connection.query('UPDATE products SET ? WHERE ?', [{
                            stock_qty: answers.qty
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
                                goShopping();
                            });
                        })
                    }
                    else {
                            console.log('Insufficient inventory. Only ', currentStock, 'remaining.');
                            goShopping();
                            connection.end();
                        }
                })
            })
        })
    });
}

goShopping();
