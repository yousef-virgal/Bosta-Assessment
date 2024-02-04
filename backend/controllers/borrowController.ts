import { Request, Response } from "express";

import { sendResponse } from "../helpers/responseHelpers";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";
import { isPostiveNumber } from "../helpers/typeHelpers";
import { getDateFromString } from "../helpers/timeHelpers";


interface BrorowController {
    borrowBook: (req: Request, res: Response) => Promise<unknown>;
    returnBook: (req: Request, res: Response) => Promise<unknown>;
    getBorrowedBooks: (req: Request, res: Response) => Promise<unknown>;
    getOverDueBooks: (req: Request, res: Response) => Promise<unknown>;
}

export const borrowController: BrorowController = {

    /**
     * This Function is used as handler for when borrow request is made
     * @param req the request object that contains the needed body parameters
     * @param res the response object that is used to send a resposne
     */
    borrowBook: async (req: Request, res: Response) => {
        let {book_id, borrower_id, due_date} = req.body;
        
        //Check if all parameters are present
        if (!book_id || !borrower_id || !due_date)
            return sendResponse(res, 400, "Missing Paramters");

        // check if both the book id and the borrower id are valid inputs
        if (!isPostiveNumber(book_id) || !isPostiveNumber(borrower_id))
            return sendResponse(res, 400, "Ids needs to be a number");
        
        // convert the due date as a date object and check if it is a valid date
        const [opertionStatus, date] = getDateFromString(due_date);

        // check if the due date is a valid date
        if(opertionStatus === false)
            return sendResponse(res, 400, "Due date needs to be a valid date");

        book_id = Number(book_id);
        borrower_id = Number(borrower_id);

        // fetch the books with the given id
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBooks(undefined, undefined, undefined, book_id);

        if (status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        // if there is no result then there was no book with the given id
        if(result.length == 0)
            return sendResponse(res, 400, "No book found with this id");
        
        // check if the user can borrow this book or not
        if(result[0].available_quantity == 0)
            return sendResponse(res, 404, "No books available");

        // get the current date
        const currentDate = new Date(new Date().toISOString().slice(0,10));

        // add the user to the borrow table
        const addtionStatus = await databaseHandler.borrowBook(borrower_id, book_id, date as Date, currentDate);
        if (addtionStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 400, "No user exists with id provided or the user already has the book");
        
        // update the book table with the new quantity
        const removalStatus = await databaseHandler.updateBook(result[0].title, result[0].author, result[0].isbn, result[0].available_quantity - 1, result[0].shelf_location, result[0].book_id);
        if (removalStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        return sendResponse(res, 200, "Book was succsfuly borrowed");
    },

    /**
     * This function is used as handler for returning books requestes
     * @param req the request object that contains the needed body parameters
     * @param res the response object that is used to send a resposne
     */
    returnBook: async (req: Request, res: Response) => {
        let {book_id, borrower_id} = req.body;
        
        //Check if all parameters are present
        if (!book_id || !borrower_id )
            return sendResponse(res, 400, "Missing Paramters");

        // check if both the book id and the borrower id are valid inputs
        if (!isPostiveNumber(book_id) || !isPostiveNumber(borrower_id))
            return sendResponse(res, 400, "Ids needs to be a number");

        book_id = Number(book_id);
        borrower_id = Number(borrower_id);

        // fetch the books with the given id
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBooks(undefined, undefined, undefined, book_id);

        if (status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        // if there is no result then there was no book with the given id
        if(result.length == 0)
            return sendResponse(res, 400, "No book found with this id");
        
        // update the borrow table by removing the entry
        const removalStatus = await databaseHandler.returnBook(borrower_id, book_id);
        if (removalStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 400, "No user borrowed a book with the specified ids");

        // update the avaliable quantity in the book table
        const updateStatus = await databaseHandler.updateBook(result[0].title, result[0].author, result[0].isbn, result[0].available_quantity + 1, result[0].shelf_location, result[0].book_id);
        if (updateStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        return sendResponse(res, 200, "Book was succsfuly returned");
    },

    /**
     * This function is used as handler for listing borrowed books requests
     * @param req the request object that contains the needed parameters
     * @param res the response object that is used to send a resposne
     */
    getBorrowedBooks: async (req: Request, res: Response) => {
        const { id } = req.params;

        //Check if all parameters are present and valid
        if (isNaN(Number(id)) && Number(id) >= 0)
            return sendResponse(res, 400, "Id needs to be a number");

        // fetch borrowed books from the database 
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, bookResult]= await databaseHandler.readBorrowedBooks(Number(id));
        
        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 400, "No books where borrowed for this user");

        return sendResponse(res, 200, bookResult);
    },

    /**
     * This Function is used as handler for when a request is made to get overdue books
     * @param req the request object
     * @param res the response object that is used to send a resposne
     */
    getOverDueBooks: async (req: Request, res: Response) => {
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        // fetch all over due books where there due date will be before the currnt date
        const [status, result] = await databaseHandler.readOverDueBooks(new Date());

        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured"); 
        
        return sendResponse(res, 200, result);
    }
}