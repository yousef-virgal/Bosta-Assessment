import mysql, { Connection, ResultSetHeader } from "mysql2/promise";

import { BaseDataBaseHandler } from "../base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../base_database_handler/base_database_handler_types";
import { ADD_ADMIN_USER, ADD_BOOK, ADD_BORROWER, BORROW_BOOK, DELETE_BOOK, DELETE_BORROWER, READ_ADMIN_USER, READ_BOOKS, READ_BOOKS_BATCH, READ_BORROWED_BOOKS, READ_BORROWERS, READ_OVERDUE_BOOKS, RETURN_BOOK, UPDATE_BOOK, UPDATE_BORROWER, UPDATE_JWT } from "./mysql_query_strings";
import { Admin } from "../models/adminModel";
import { Book } from "../models/bookModel";
import { Borrower } from "../models/borrowerModel";
import { BookBorrower } from "../models/bookBorrower";

export class MysqlDataBaseHandler extends BaseDataBaseHandler{
    databaseInstance: Connection | undefined;

    constructor() {
        super();
        this.init_database_connection();
      }

    async init_database_connection(): Promise<void> {
        if (this.databaseInstance === undefined){
            this.databaseInstance = await mysql.createConnection({
                user: process.env.MYSQLDB_USER,
                host: "database",
                password: process.env.MYSQLDB_ROOT_PASSWORD,
                database: process.env.MYSQLDB_DATABASE
            });
        }
    }

    async readAdminUser(username: string) : Promise<[status: DATABASE_OPERATION_STATUS, result: Admin| null]> {
        try{
            const [result] = await (this.databaseInstance as Connection).query(READ_ADMIN_USER,[username]);
            if ((result as Admin[]).length == 0)
                return [DATABASE_OPERATION_STATUS.FAIL, null];
            else
                return [DATABASE_OPERATION_STATUS.SUCCESS,(result as Admin[])[0]];
        }
        catch (err){
            return [DATABASE_OPERATION_STATUS.FAIL, null];
        }
    }

    async updateAdminUserToken(jwt: string, adminId: number): Promise<DATABASE_OPERATION_STATUS> {
        try {
            const [result] = await (this.databaseInstance as Connection).execute(UPDATE_JWT,[jwt, adminId]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch{
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async addAdminUser(username: string, password: string): Promise<DATABASE_OPERATION_STATUS> {
        try{
            await (this.databaseInstance as Connection).execute(ADD_ADMIN_USER, [username, password]);

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch(err){
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async addBook(title: string, author: string, isbn: string, availableQuantity: number, shelfLocation: string): Promise<DATABASE_OPERATION_STATUS> {
        try{
            await (this.databaseInstance as Connection).execute(ADD_BOOK, [title, author, isbn, availableQuantity, shelfLocation]);
            
            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async updateBook(title: string, author: string, isbn: string, availableQuantity: number, shelfLocation: string, bookId: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(UPDATE_BOOK, [title, author, isbn, availableQuantity, shelfLocation, bookId]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async deleteBook(bookId: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(DELETE_BOOK, [bookId]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async readBooks(title?: string, author?: string, isbn?: string, id?: number): Promise<[DATABASE_OPERATION_STATUS, Book[]]> {
        try{
            const [result] = await (this.databaseInstance as Connection).query(READ_BOOKS, [title !== undefined ? title : null, author !== undefined ? author : null, isbn !== undefined ? isbn : null, id !== undefined ? id : null]);
            return [DATABASE_OPERATION_STATUS.SUCCESS, result as Book[]];
        }
        catch (err) {
            return [DATABASE_OPERATION_STATUS.FAIL, []];
        }
    }

    async addBorrower(name: string, email: string, registerDate: Date): Promise<DATABASE_OPERATION_STATUS> {
        try{
            await (this.databaseInstance as Connection).execute(ADD_BORROWER, [name, email, registerDate]);
            
            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch{
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async deleteBorrower(borrowerId: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(DELETE_BORROWER, [borrowerId]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async readBorrowers(): Promise<[DATABASE_OPERATION_STATUS, Borrower[]]> {
        try{
            const [result] = await (this.databaseInstance as Connection).query(READ_BORROWERS);
            return [DATABASE_OPERATION_STATUS.SUCCESS, result as Borrower[]];
        }
        catch (err) {
            return [DATABASE_OPERATION_STATUS.FAIL, []];
        }
    }

    async updateBorrower(name: string, email: string, registerDate: Date, borrowerId: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(UPDATE_BORROWER, [name, email, registerDate, borrowerId]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async borrowBook(borrowerId: number, bookId: number, dueDate: Date, registrationDate: Date): Promise<DATABASE_OPERATION_STATUS>{
        try{
            await (this.databaseInstance as Connection).execute(BORROW_BOOK, [borrowerId, bookId, registrationDate, dueDate]);
            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch(err) {
            return DATABASE_OPERATION_STATUS.FAIL;
        }    
    }

    async returnBook(borrowerId: number, book_id: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(RETURN_BOOK, [borrowerId, book_id]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async readBorrowedBooks(borrowerId: number): Promise<[DATABASE_OPERATION_STATUS, Book[]]> {
        try{
            const [result] = await (this.databaseInstance as Connection).query(READ_BORROWED_BOOKS, [borrowerId]);
            const idList = (result as {book_id: number}[]).map((book)=>book.book_id);
            const [bookResult] = await (this.databaseInstance as Connection).query(READ_BOOKS_BATCH((this.databaseInstance as Connection).escape(idList)));
            return [DATABASE_OPERATION_STATUS.SUCCESS, bookResult as Book[]];
        }
        catch (err) {
            return [DATABASE_OPERATION_STATUS.FAIL, []];
        }
    }

    async readOverDueBooks(date: Date): Promise<[DATABASE_OPERATION_STATUS, BookBorrower[]]> {
        try{
            const [result] = await (this.databaseInstance as Connection).query(READ_OVERDUE_BOOKS, [date]);
            const recordResult = result as {book_id: number, borrower_id: number, due_date: Date}[];
            const idList = recordResult.map((book)=>book.book_id);
            if (idList.length === 0)
                return [DATABASE_OPERATION_STATUS.SUCCESS, []];
            const [bookResult] = await (this.databaseInstance as Connection).query(READ_BOOKS_BATCH((this.databaseInstance as Connection).escape(idList)));
            const overDueBooks:BookBorrower[] = (recordResult).map((bookBorrower) => {
                return {
                    book_id: bookBorrower.book_id,
                    book_title: (bookResult as Book[]).find((book)=> book.book_id === bookBorrower.book_id)?.title,
                    borrower_id: bookBorrower.borrower_id,
                    late_period: Math.trunc((date.getTime() - bookBorrower.due_date.getTime()) / (1000 * 60 *60 *24))
                } as BookBorrower;
            })
            return [DATABASE_OPERATION_STATUS.SUCCESS, overDueBooks];
        }
        catch (err) {
            return [DATABASE_OPERATION_STATUS.FAIL, []];
        }
    }

}