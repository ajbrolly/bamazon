var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'greatBay'
});

function bidPost() {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'What do you want to do?',
        choices: [
            'Bid',
            'Post'
        ]
    }]).then(function (answers) {
        if (answers.choice === 'Bid') {
            var items = [];
            connection.query('SELECT * FROM items', function (err, res) {
                if (err) throw err;
                for (var i in res) {
                    items.push(res[i].product);
                }
                inquirer.prompt([{
                    type: 'list',
                    name: 'choice',
                    message: 'What do you want to bid on?',
                    choices: items
                }]).then(function (answers) {
                    connection.query('SELECT * FROM items WHERE product = ?', [answers.choice], function (err, res) {
                        if (err) throw err;
                        var product = answers.choice;
                        var currentBid = res[0].bid;
                        console.log('Current Bid: $', currentBid);
                        inquirer.prompt([{
                            type: 'input',
                            name: 'bid',
                            message: 'Your bid: $'
                        }]).then(function (answers) {
                            if (parseInt(answers.bid) > currentBid) {
                                connection.query('UPDATE items SET ? WHERE ?', [{
                                    bid: answers.bid
                                }, {
                                    product: product
                                }], function (err, res) {
                                    if (err) throw err;
                                    console.log('New High Bidder!');
                                    bidPost();
                                });
                            }
                            else {
                                console.log('Not enough');
                                bidPost();
                            }
                        });
                    });
                });
            });
        }
        else if (answers.choice === 'Post') {
            inquirer.prompt([{
                type: 'input',
                name: 'product',
                message: 'What are you selling?',
            }, {
                type: 'input',
                name: 'category',
                message: 'What category does it fit in?',
            },
            {
                type: 'input',
                name: 'bid',
                message: 'What is the starting bid?$',
            }]).then(function (answers) {
                connection.query('INSERT INTO items SET ?', {
                    product: answers.product,
                    category: answers.category,
                    bid: parseInt(answers.bid)
                });
                bidPost();
            });
        }
    });
}
bidPost();




// --------
// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);

//     createSongs();
// });

// function createSongs() {
//     console.log('Add new entry...\n');
//     var query = connection.query(
//         'INSERT INTO songs SET ?',
//         {
//             title: 'Toxic',
//             artist: 'Britney Spears',
//             genre: 'pop'
//         },
//         function (err, res) {
//             console.log(res.affectedRows + ' song inserted!\n')
//             updateSongs();
//         }
//     );
//     console.log(query.sql);
// };

// function updateSongs() {
//     console.log('Updating songs...\n');
//     var query = connection.query('UPDATE songs SET ? WHERE ?',
//         [
//             {
//                 genre: 'pop'
//             },
//             {
//                 genre: 'Pop'
//             }
//         ],
//         function (err, res) {
//             console.log(res.affectedRows, ' songs updated!\n');
//             deleteSongs();
//         }
//     );
//     console.log(query.sql);
// };

// function deleteSongs() {
//     console.log('Deleting songs...\n');
//     connection.query('DELETE FROM songs WHERE ?',
//         {
//             id: 6
//         },
//         function (err, res) {
//             console.log(res.affectedRows + ' songs deleted!\n');
//             readProducts();
//         }
//     );
// }

// function readProducts() {
//     console.log('Selecting all songs...\n');
//     connection.query('SELECT * FROM songs', function (err, res) {
//         if (err) throw err;
//         console.log(res);
//         connection.end();
//     })
// }