//grab all npm packages that are needed
var Table = require('cli-table'),
    mysql = require("mysql"),
    inquirer = require("inquirer"),
    clear = require('clear'),
    //make DB connection
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "laurieowens",
        password: "password123",
        database: "bamazon"
    });

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
});


// function which prompts the user for what action they should take
var start = function() {
    inquirer.prompt({
        name: "displayOrPurchase",
        type: "rawlist",
        message: "Would you like to [Display] a list of Items, [Purchase] an Item or [Exit] ?",
        choices: ["Display", "Purchase", "Exit"]
    }).then(function(answer) {
        switch (answer.displayOrPurchase.toUpperCase()) {
            case "EXIT":
                clear();
                process.exit();
                break;
            case "DISPLAY":
                clear();
                displayItem();
                break;
            case "PURCHASE":
                buyItem();
                break;
            default:
                process.exit();
                break;
        }
    });
};
//display items 
var displayItem = function() {
    connection.query("select item_id, product_name, price from products", function(err, res) {
        if (err) throw (err);
        //create table to prettify output
        var table = new Table({
            head: ['Product ID', 'Product', 'Price'],
            colWidths: [10, 60, 60]
        });
        //populate table array 
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')]);
        }
        //show table with items
        console.log(table.toString());
        start();
    });
};

// function to handle purchase of items
var buyItem = function() {
    connection.query("select item_id, product_name, price, stock_quantity from products", function(err, res) {
        if (err) throw (err);
        var table = new Table({
            head: ['Product ID', 'Product', 'Price', 'Stock'],
            colWidths: [10, 60, 60, 10]
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), res[i].stock_quantity]);
        }
        clear();
        console.log(table.toString());

        // prompt for product id
        inquirer.prompt([{
            name: "productid",
            type: "input",
            message: "What is the ID of the product you would like to purchase?"

        }, {
            //prompt for qty
            name: "qty",
            type: "input",
            message: "How many units would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            var chosenItem;
            var chosenName;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.productid)) {
                    chosenItem = res[i].stock_quantity;
                    chosenName = res[i].product_name;
                    chosenPrice = res[i].price
                }
            }
            //if there is enough inventory on hand update db and show invoice
            if (chosenItem >= parseInt(answer.qty) && (chosenItem > 0) && (answer.qty > 0)) {
                connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: (chosenItem - answer.qty),
                    }, {
                        item_id: answer.productid
                    }],

                    function(err) {
                        if (err) throw err;
                        console.log("THANK YOU FOR YOUR PURCHASE OF " + answer.qty + " " + chosenName + "(s)");
                        console.log("                                  Total Cost  " + "$" + ((answer.qty * chosenPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')));
                        // re-prompt the user for purchase
                        start();
                    });
            } else {
                // not enough inventory on hand- start over
                console.log("Insufficient quantity!");
                start();
            }
        });
    });
};
//clear screen
clear();
start();
