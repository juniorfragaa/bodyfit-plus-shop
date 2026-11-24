CREATE DATABASE IF NOT EXISTS bodyfit_shop;
USE bodyfit_shop;

-- CREATE THE USERS TABLE (STORES REGISTERED CUSTOMERS)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- CREATE THE PRODUCTS TABLE (ITEMS SOLD IN THE SHOP)
CREATE TABLE IF NOT EXISTS products(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL
);

-- EMPTY THE PRODUCTS TABLE FIRST, SO RUNNING THIS FILE AGAIN DOES NOT DUPLICATE PRODUCTS
TRUNCATE TABLE products;

-- INSERT THE 6 PRODUCTS SOLD IN THE SHOP
INSERT INTO products (name, description, price, image, category) VALUES
('Premium', 'Business-hours gym access, app workouts and a monthly workout plan.', 45.00, 'images/premium.png', 'plan'),
('Gold', '24/7 access, weekly personal trainer, sauna, jacuzzi and group classes.', 60.00, 'images/gold.png', 'plan'),
('Platinum', '24/7 access, 3x weekly personal trainer, Pilates and extra support.', 80.00, 'images/platinum.png', 'plan'),
('Day Pass', 'One full day of gym access. Perfect to try BodyFit Plus.', 10.00, 'images/daypass.png', 'product'),
('Whey Protein', 'Chocolate whey protein, 1kg tub with 24 g of protein per serving.', 35.00, 'images/whey.png', 'product'),
('BodyFit Bottle', 'Keeps your drinks cold for hours. With handle and straw.', 12.00, 'images/bottle.png', 'product');

SELECT * FROM products;

-- CREATE THE BASKET TABLE (ONE ROW PER PRODUCT IN THE BASKET, WITH ITS QUANTITY)
-- FOR PLANS THE QUANTITY MEANS MONTHS
CREATE TABLE IF NOT EXISTS basket(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL
);

-- CREATE THE ORDERS TABLE (STORES ORDERS PLACED AT CHECKOUT)
CREATE TABLE IF NOT EXISTS orders(
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    items VARCHAR(500) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM products;
