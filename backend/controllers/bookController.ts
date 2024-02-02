import { Request, Response } from "express";

import { sendResponse } from "../helpers/responseHelpers";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";


interface BookController {
    fetchBooks: (req: Request, res: Response) => Promise<unknown>;
    updateBook: (req: Request, res: Response) => Promise<unknown>;
    deleteBook: (req: Request, res: Response) => Promise<unknown>;
    addBook: (req: Request, res: Response) => Promise<unknown>;

}

export const bookController: BookController = {

    fetchBooks: async (req: Request, res: Response) => {
        const {title, author, isbn} = req.params;

        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBooks(title, author, isbn);

        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured"); 
        
        return sendResponse(res, 200, result);
    },

    updateBook: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id)))
            return sendResponse(res, 400, "Id needs to be a number");
        
        const {title, author, isbn, available_quantity, shelf_location} = req.body;
        
        if (!title || !author || !isbn || !available_quantity || !shelf_location)
            return sendResponse(res, 400, "Missing Paramters");
        
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.updateBook(title, author, isbn, available_quantity, shelf_location, Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Book was updated");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    deleteBook: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id)))
            return sendResponse(res, 400, "Id needs to be a number");
        
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.deleteBook(Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Book was deleted");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    addBook: async (req: Request, res: Response) => {
        const {title, author, isbn, available_quantity, shelf_location} = req.body;
        
        if (!title || !author || !isbn || !available_quantity || !shelf_location)
            return sendResponse(res, 400, "Missing Paramters");
        
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.addBook(title, author, isbn, available_quantity, shelf_location);

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Book was added");
        else
            return sendResponse(res, 500, "A database error occured");
    }
}