import { Admin } from "../models/adminModel";
import { BookBorrower } from "../models/bookBorrower";
import { Book } from "../models/bookModel";
import { Borrower } from "../models/borrowerModel";
import { DATABASE_OPERATION_STATUS } from "./base_database_handler_types";

/**
 * This class is an abstract class that represnts the handler for when you want to make a database operation
 * each database handler will extend his class and provide an implmentation for the methods  
 */
export abstract class BaseDataBaseHandler {

    /**
     * This Function is used to initlize all the needed config options for the backend to connect to a database
     */
    abstract init_database_connection(): void;

    /**
     * This Function is used as handler for when you want to read an admin user by thier username  
     * @param username the username to fetch the admin data that is associated with
     */
    abstract readAdminUser(username: string): Promise<[DATABASE_OPERATION_STATUS, Admin | null]>;

    /**
     * This Function is used to update the refresh token associated with the admin
     * @param jwt the jwt to update the admin entity with
     * @param adminId the admin id to update the token with
     */
    abstract updateAdminUserToken(jwt: string, adminId: number): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to add an admin entity to the database
     * @param username the username of the admin
     * @param password the password of the admin
     */
    abstract addAdminUser(username: string, password: string): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to add a book entity in the database 
     * @param title the title of the book
     * @param author the author of the book
     * @param isbn the isbn of the book
     * @param availableQuantity the number of available quantities
     * @param shelfLocation the location of the book
     */
    abstract addBook(title: string, author: string, isbn: string, availableQuantity: number, shelfLocation: string): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * this function is used to update a book entity in the databse
     * @param title the title of the book
     * @param author the author of the book
     * @param isbn the isbn of the book
     * @param availableQuantity the number of available quantities
     * @param shelfLocation the location of the book
     * @param book_id the book id for the book to update
     */
    abstract updateBook(title: string, author: string, isbn: string, availableQuantity: number, shelfLocation: string, book_id: number): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to delete a book entity
     * @param bookId the id of the book to delete
     */
    abstract deleteBook(bookId: number): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to fetch book entities 
     * @param title the title of the book
     * @param author the author of the book
     * @param isbn the isbn of the book
     * @param id the id of the book
     */
    abstract readBooks(title?: string, author?: string, isbn?: string, id?: number): Promise<[DATABASE_OPERATION_STATUS, Book[]]>;

    /**
     * This Function is ues to add a borrower entity to the database
     * @param name the name of the borrower
     * @param email the email of the borrower
     * @param registerDate the registeration date for the borrower
     */
    abstract addBorrower(name: string, email: string, registerDate: Date): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to update a borrower entity in the databse
     * @param name the name of the borrower 
     * @param email the email of the borrower
     * @param registerDate the registeration date for the borrower
     * @param borrowerId the id for the borrower to update
     */
    abstract updateBorrower(name: string, email: string, registerDate: Date, borrowerId: number): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to delete a borrower entity 
     * @param borrowerId the id for the borrower to delete
     */
    abstract deleteBorrower(borrowerId: number): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to fetch all borrower entities from the database
     */
    abstract readBorrowers(): Promise<[DATABASE_OPERATION_STATUS, Borrower[]]>;

    /**
     * This Function is used to record a borrow tranaction in the database 
     * @param borrowerId the id of the borrower
     * @param bookId the id of the book that will be borrowed
     * @param dueDate the due date for the book
     * @param registrationDate the date that the book was borrowed at 
     */
    abstract borrowBook(borrowerId: number, bookId: number, dueDate: Date, registrationDate: Date): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to update a borrow tranaction in the database
     * @param borrowerId the borrower id
     * @param bookId the book id for the book that was borrowed 
     */
    abstract returnBook(borrowerId: number, bookId: number): Promise<DATABASE_OPERATION_STATUS>;

    /**
     * This Function is used to read book enities that were borrowed by a borrower
     * @param borrowerId the borrower id 
     */
    abstract readBorrowedBooks(borrowerId: number): Promise<[DATABASE_OPERATION_STATUS, Book[]]>;

    /**
     * The Function is used to read all overdue books from the database 
     * @param date 
     */
    abstract readOverDueBooks(date: Date): Promise<[DATABASE_OPERATION_STATUS, BookBorrower[]]>;
}