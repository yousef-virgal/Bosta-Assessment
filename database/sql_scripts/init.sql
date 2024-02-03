CREATE DATABASE IF NOT EXISTS Library;
GO

USE Library; 

CREATE TABLE IF NOT EXISTS Library.Admins (
    admin_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    refresh_token VARCHAR(200)
);

GO

CREATE TABLE IF NOT EXISTS Library.Books (
    book_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    author VARCHAR(50) NOT NULL,
    isbn VARCHAR(50) NOT NULL,
    available_quantity INT NOT NULL,
    shelf_location VARCHAR(10)
);

GO

CREATE TABLE IF NOT EXISTS Library.Borrowers (
    borrower_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    register_date Date NOT NULL
);

GO

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '123456'; 
flush privileges;
