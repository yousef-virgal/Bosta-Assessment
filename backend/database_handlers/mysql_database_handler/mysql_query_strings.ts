export const READ_ADMIN_USER = "SELECT admin_id, username, password FROM Admins WHERE username = ?";

export const UPDATE_JWT = "UPDATE Admins SET refresh_token = ? WHERE admin_id = ?";

export const ADD_ADMIN_USER = "INSERT INTO Admins (username, password) VALUES (?, ?)";

export const ADD_BOOK = "INSERT INTO  Books (title, author, isbn, available_quantity, shelf_location) VALUES (?, ?, ?, ?, ?)";

export const UPDATE_BOOK = "UPDATE Books SET title = ?, author = ?, isbn = ?, available_quantity = ?, shelf_location = ? WHERE book_id = ?"

export const DELETE_BOOK = "DELETE FROM Books WHERE book_id = ?"

export const READ_BOOKS = "SELECT title, author, isbn, available_quantity, shelf_location FROM Books WHERE title = COALESCE(?,title) AND author = COALESCE(?,author) AND isbn = COALESCE(?,isbn)"