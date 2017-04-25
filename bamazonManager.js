// Challenge #2: Manager View (Next Level)

// Create a new Node application called bamazonManager.js. Running this application will:
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
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
        name: "choices",
        type: "list",
        message: "Please Choose from Menu",
        choices: ["View Inventory Products", "List Low Inventory Quantities (<5)", "Update Inventory Quantities", "Add a New Product", "Exit"]
    }).then(function(answer) {
        switch (answer.choices.toUpperCase()) {
            case "EXIT":
                clear();
                process.exit();
                break;
            case "VIEW INVENTORY PRODUCTS":
                clear();
                displayItem();
                break;
            case "LIST LOW INVENTORY QUANTITIES (<5)":
                clear();
                displayLowItems();
                break;
            case "UPDATE INVENTORY QUANTITIES":
                clear();
                updateQty();
                break;
            case "ADD A NEW PRODUCT":
                clear();
                addItem();
                break;
            default:
                process.exit();
                break;
        }
    });
};
//display items 
var displayItem = function() {
    connection.query("select item_id, product_name, price, stock_quantity from products", function(err, res) {
        if (err) throw (err);
        //create table to prettify output
        var table = new Table({
            head: ['Product ID', 'Product', 'Price', 'Quantity On Hand'],
            colWidths: [10, 60, 60, 20]
        });
        //populate table array 
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), res[i].stock_quantity]);
        }
        //show table with items
        console.log(table.toString());
        start();
    });
};
//display low inventory items 
var displayLowItems = function() {
        connection.query("select * from products where (stock_quantity <5)", function(err, res) {
            if (err) throw (err);
            // showTable(res);
            var table = new Table({
                head: ['Product ID', 'Product', 'Price', 'Quantity On Hand'],
                colWidths: [10, 60, 60, 20]
            });
            //populate table array 
            for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), res[i].stock_quantity]);
            };
            //show table with items
            console.log(table.toString());
            start();
        });
    }
    // function to handle purchase of items
var updateQty = function() {
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
                message: "What is the ID of the product you would like to update?"

            },
            //       if ([res.length].includes(answer.productid)) 
            {
                //prompt for qty
                name: "qty",
                type: "input",
                message: "Please enter new quantity",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            var chosenItem;
            var chosenName;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.productid)) {
                    chosenItem = res[i].stock_quantity;
                    chosenName = res[i].product_name;
                    chosenPrice = res[i].price
                }else{
                	 console.log("NO ITEM FOUND! PLEASE TRY AGAIN.");
                start();

                }
            }
            //if there is enough inventory on hand update db and show invoice
           // if ([res[i].item_id].includes(parseInt(answer.productid))) {
                connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: answer.qty,
                    }, {
                        item_id: answer.productid
                    }],
                    function(err) {
                        if (err) throw err;
                        console.log("Product", chosenName + " ID#", answer.productid, "old Quantity of " + chosenItem + ", has been changed. New Quantity is " + answer.qty + " unit(s).");
                        start();
                    });
            // } else {
 //     console.log("NO ITEM FOUND! PLEASE TRY AGAIN.");
 //     start();
 // }

        });
    });
};
start();
