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

select * from products;