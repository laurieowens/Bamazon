var
    Table = require('cli-table'),
    mysql = require("mysql"),
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "bamazon"
    });

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});


connection.query("select item_id, product_name, format(price,2) from products", function(err, res) {
    if (err) throw (err);
    var table = new Table({
        head: ['Product ID', 'Product', 'Price'],
        colWidths: [60, 60, 60]
    });
    // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    for (var i = 0; i < res.length; i++) {
        table.push([res[i]]);
    }
    console.log(table.toString());
});
