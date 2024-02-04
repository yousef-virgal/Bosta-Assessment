import { Request, Response } from "express";

import { sendResponse } from "../helpers/responseHelpers";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";
import { isPostiveNumber } from "../helpers/typeHelpers";


interface BookController {
    fetchBooks: (req: Request, res: Response) => Promise<unknown>;
    updateBook: (req: Request, res: Response) => Promise<unknown>;
    deleteBook: (req: Request, res: Response) => Promise<unknown>;
    addBook: (req: Request, res: Response) => Promise<unknown>;

}

export const bookController: BookController = {
    /**
     * This Function is used as the handler for fetching books and returns a list of responses to the client 
     * @param req the request object that contains the query parameters
     * @param res the response object that is used to send a resposne 
     */
    fetchBooks: async (req: Request, res: Response) => {
        const {title, author, isbn} = req.query;

        // make the request to fetch all books 
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBooks(title as string, author as string, isbn as string);

        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured"); 
        
        return sendResponse(res, 200, result);
    },

    /**
     * This Function is used as the handler for updating a book by it's id
     * @param req the request object that contains the needed parameters
     * @param res the response object that is used to send a resposne
     */
    updateBook: async (req: Request, res: Response) => {
        const { id } = req.params;

        // check if id that is sent is valid
        if (isNaN(Number(id)) && Number(id) >= 0)
            return sendResponse(res, 400, "Id needs to be a number");
        
        const {title, author, isbn, available_quantity, shelf_location} = req.body;

        // check if all book attrbuites are passed
        if (!title || !author || !isbn || !available_quantity || !shelf_location)
            return sendResponse(res, 400, "Missing Paramters");
        
        // check if the quantity that is sent is valid
        if(!isPostiveNumber(available_quantity))
            return sendResponse(res, 400, "quantity must be a postive number");

        // make the database request to update the book
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.updateBook(title, author, isbn, available_quantity as number, shelf_location, Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Book was updated");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    /**
     * This Function is used as handler for deleting books
     * @param req the request object that contains the needed parameters
     * @param res the response object that is used to send a resposne
     */
    deleteBook: async (req: Request, res: Response) => {
        const { id } = req.params;

        // check if id that is sent is valid
        if (isNaN(Number(id)) && Number(id) >= 0)
            return sendResponse(res, 400, "Id needs to be a number");
        
        // make the database request to delete the book
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.deleteBook(Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Book was deleted");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    /**
     * This Function is used to as handler create a new book
     * @param req the request object that contains the body parameters
     * @param res the response object that is used to send a resposne
     */
    addBook: async (req: Request, res: Response) => {
        const {title, author, isbn, available_quantity, shelf_location} = req.body;
        
        // Check that all the book parameters are present
        if (!title || !author || !isbn || !available_quantity || !shelf_location)
            return sendResponse(res, 400, "Missing Paramters");

        // check if the quantity that is sent is valid
        if(!isPostiveNumber(available_quantity))
            return sendResponse(res, 400, "quantity must be a postive number");

        // make the database request to add the book
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.addBook(title, author, isbn, available_quantity as number, shelf_location);

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Book was added");
        else
            return sendResponse(res, 500, "A database error occured");
    }
}