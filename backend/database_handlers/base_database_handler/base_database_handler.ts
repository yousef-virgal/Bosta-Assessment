import { Admin } from "../models/adminModel";
import { Book } from "../models/bookModel";
import { DATABASE_OPERATION_STATUS } from "./base_database_handler_types";

export abstract class BaseDataBaseHandler {

    abstract init_database_connection(): void;

    abstract readAdminUser(username: string): Promise<[DATABASE_OPERATION_STATUS, Admin | null]>;

    abstract updateAdminUserToken(jwt: string, adminId: number): Promise<DATABASE_OPERATION_STATUS>;

    abstract addAdminUser(username: string, password: string): Promise<DATABASE_OPERATION_STATUS>;

    abstract addBook(title: string, author: string, isbn: string, availableQuantity: number, shelf_location: string): Promise<DATABASE_OPERATION_STATUS>;

    abstract updateBook(title: string, author: string, isbn: string, availableQuantity: number, shelf_location: string, book_id: number): Promise<DATABASE_OPERATION_STATUS>;

    abstract deleteBook(book_id: number): Promise<DATABASE_OPERATION_STATUS>;

    abstract readBooks(title?: string, author?: string, isbn?: string): Promise<[DATABASE_OPERATION_STATUS, Book[]]>;
}