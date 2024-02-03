export const READ_ADMIN_USER = "SELECT admin_id, username, password FROM Admins WHERE username = ?";

export const UPDATE_JWT = "UPDATE Admins SET refresh_token = ? WHERE admin_id = ?";

export const ADD_ADMIN_USER = "INSERT INTO Admins (username, password) VALUES (?, ?)";

export const ADD_BOOK = "INSERT INTO  Books (title, author, isbn, available_quantity, shelf_location) VALUES (?, ?, ?, ?, ?)";

export const UPDATE_BOOK = "UPDATE Books SET title = ?, author = ?, isbn = ?, available_quantity = ?, shelf_location = ? WHERE book_id = ?"

export const DELETE_BOOK = "DELETE FROM Books WHERE book_id = ?"

export const READ_BOOKS = "SELECT book_id, title, author, isbn, available_quantity, shelf_location FROM Books WHERE title = COALESCE(?,title) AND author = COALESCE(?,author) AND isbn = COALESCE(?,isbn) AND book_id = COALESCE(?,book_id)"

export const ADD_BORROWER = "INSERT INTO Borrowers (name, email, register_date) VALUES (?, ?, ?)";

export const DELETE_BORROWER = "DELETE FROM Borrowers WHERE borrower_id = ?";

export const UPDATE_BORROWER = "UPDATE Borrowers SET name = ?, email = ?, register_date = ? WHERE borrower_id = ?";

export const READ_BORROWERS = "SELECT borrower_id, name, email, register_date FROM Borrowers";

export const BORROW_BOOK = "INSERT INTO BorrowerBooks (borrower_id, book_id, borrow_date, due_date) VALUES (?, ?, ?, ?)";

export const RETURN_BOOK = "DELETE FROM BorrowerBooks WHERE borrower_id = ? AND book_id = ?";

export const READ_BORROWED_BOOKS = "SELECT book_id FROM BorrowerBooks WHERE borrower_id = ? ";

export const READ_BOOKS_BATCH = (listString: string) => `SELECT book_id, title, author, isbn, available_quantity, shelf_location FROM Books WHERE book_id IN (${listString})`;

export const READ_OVERDUE_BOOKS = "SELECT book_id, borrower_id, due_date FROM BorrowerBooks WHERE due_date < ?";
