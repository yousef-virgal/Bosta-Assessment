import mysql, { Connection, ResultSetHeader } from "mysql2/promise";

import { BaseDataBaseHandler } from "../base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../base_database_handler/base_database_handler_types";
import { ADD_ADMIN_USER, ADD_BOOK, DELETE_BOOK, READ_ADMIN_USER, READ_BOOKS, UPDATE_BOOK, UPDATE_JWT } from "./mysql_query_strings";
import { Admin } from "../models/adminModel";
import { Book } from "../models/bookModel";

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

    async addBook(title: string, author: string, isbn: string, availableQuantity: number, shelf_location: string): Promise<DATABASE_OPERATION_STATUS> {
        try{
            await (this.databaseInstance as Connection).execute(ADD_BOOK, [title, author, isbn, availableQuantity, shelf_location]);
            
            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async updateBook(title: string, author: string, isbn: string, availableQuantity: number, shelf_location: string, book_id: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(UPDATE_BOOK, [title, author, isbn, availableQuantity, shelf_location, book_id]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async deleteBook(book_id: number): Promise<DATABASE_OPERATION_STATUS> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(DELETE_BOOK, [book_id]);
            
            if((result as ResultSetHeader).affectedRows == 0)
                return DATABASE_OPERATION_STATUS.FAIL;

            return DATABASE_OPERATION_STATUS.SUCCESS;
        }
        catch {
            return DATABASE_OPERATION_STATUS.FAIL;
        }
    }

    async readBooks(title?: string, author?: string, isbn?: string): Promise<[DATABASE_OPERATION_STATUS, Book[]]> {
        try{
            const [result] = await (this.databaseInstance as Connection).execute(READ_BOOKS, [title !== undefined ? title : null, author !== undefined ? author : null, isbn !== undefined ? isbn : null]);
            return [DATABASE_OPERATION_STATUS.SUCCESS, result as Book[]];
        }
        catch (err) {
            return [DATABASE_OPERATION_STATUS.FAIL, []];
        }
    }
}