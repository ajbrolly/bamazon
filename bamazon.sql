CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE  products (
	id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    dept_name VARCHAR(50) NOT NULL,
	price DECIMAL (10,2) NOT NULL,
    stock_qty INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, dept_name, price, stock_qty)
VALUES ('iPhone X', 'Electronics', 999.99, 150),
('Blender', 'Kitchen', 99.99, 63),
('Thor', 'Movies', 34.49, 86),
('iPod Shuffle', 'Electronics', 69.99, 132),
('iPad Pro', 'Electronics', 849.99, 5),
('Toaster', 'Kitchen', 39.99, 12),
('Throw Pillows', 'Home Goods', 29.99, 134),
('Scented Candles', 'Home Goods', 19.99, 44),
('Iron Man 3', 'Movies', 34.49, 15),
('Sharpie Markers', 'Office Supplies', 14.99, 35)

SELECT * FROM products;