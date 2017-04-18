-- Create a MySQL Database called Bamazon.
-- Then create a Table inside of that database called products.
-- The products table should have each of the following columns:
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)
-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

create database Bamazon;
use Bamazon;
create table products (
  item_id int auto_increment not null,
  product_name varchar(100) not null,
  department_name varchar(100) not null,
  price dec(10,2) not null,
  stock_quantity int(10),
  primary key(item_id)
);

insert into products(product_name,department_name,price,stock_quantity)
values 	("gizmo","TBD",12.50,340),
		    ("gadget","TBD",24.99,1200),
		    ("widget","TBD",1001.00,45),
		    ("tool","UITA",59.99,87),
		    ("instrument","JISO",1.99,3400),
        ("apparatus","NYK",20983,3),
        ("doodad","YTBD",.02,5600),
        ("thing","NYK",999.98,40),
        ("doohickey","JISO",8754.48, 546),
        ("thingamagig","UITA",7353.23, 4398),
        ("whatchamacallit","JISO",5343.97, 7);
select * from products;
