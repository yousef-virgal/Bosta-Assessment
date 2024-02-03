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
    shelf_location VARCHAR(10) NOT NULL
);

GO

CREATE TABLE IF NOT EXISTS Library.Borrowers (
    borrower_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    register_date Date NOT NULL
);

GO

CREATE TABLE IF NOT EXISTS Library.BorrowerBooks (
    borrower_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date Date NOT NULL,
    due_date DATE NOT NULL,
    CONSTRAINT pk_borrower_book PRIMARY KEY (borrower_id, book_id),
    FOREIGN KEY (borrower_id) REFERENCES Library.Borrowers (borrower_id) ON DELETE CASCADE, 
    FOREIGN KEY (book_id) REFERENCES Library.Books (book_id) ON DELETE CASCADE
);


ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '123456'; 
flush privileges;
