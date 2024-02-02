CREATE DATABASE IF NOT EXISTS Library;
GO

USE Library; 

CREATE TABLE IF NOT EXISTS Library.Admins (
    admin_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
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
