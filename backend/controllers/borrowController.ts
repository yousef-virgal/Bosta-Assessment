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
}

export const borrowController: BrorowController = {
    borrowBook: async (req: Request, res: Response) => {
        let {book_id, borrower_id, due_date} = req.body;
        
        if (!book_id || !borrower_id || !due_date)
            return sendResponse(res, 400, "Missing Paramters");

        if (!isPostiveNumber(book_id) || !isPostiveNumber(borrower_id))
            return sendResponse(res, 400, "Ids needs to be a number");
        
        const [opertionStatus, date] = getDateFromString(due_date);

        if(opertionStatus === false)
            return sendResponse(res, 400, "Due date needs to be a valid date");

        book_id = Number(book_id);
        borrower_id = Number(borrower_id);

        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBooks(undefined, undefined, undefined, book_id);

        if (status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        if(result.length == 0)
            return sendResponse(res, 400, "No book found with this id");
        
        if(result[0].available_quantity == 0)
            return sendResponse(res, 404, "No books available");

        const currentDate = new Date(new Date().toISOString().slice(0,10));

        const addtionStatus = await databaseHandler.borrowBook(borrower_id, book_id, date as Date, currentDate);
        if (addtionStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 400, "No user exists with id provided or the user already has the book");
        
        const removalStatus = await databaseHandler.updateBook(result[0].title, result[0].author, result[0].isbn, result[0].available_quantity - 1, result[0].shelf_location, result[0].book_id);
        if (removalStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        return sendResponse(res, 200, "Book was succsfuly borrowed");
    },

    returnBook: async (req: Request, res: Response) => {
        let {book_id, borrower_id} = req.body;
        
        if (!book_id || !borrower_id )
            return sendResponse(res, 400, "Missing Paramters");

        if (!isPostiveNumber(book_id) || !isPostiveNumber(borrower_id))
            return sendResponse(res, 400, "Ids needs to be a number");

        book_id = Number(book_id);
        borrower_id = Number(borrower_id);

        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBooks(undefined, undefined, undefined, book_id);

        if (status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        if(result.length == 0)
            return sendResponse(res, 400, "No book found with this id");
        
        const removalStatus = await databaseHandler.returnBook(borrower_id, book_id);
        if (removalStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 400, "No user borrowed a book with the specified ids");

        const updateStatus = await databaseHandler.updateBook(result[0].title, result[0].author, result[0].isbn, result[0].available_quantity + 1, result[0].shelf_location, result[0].book_id);
        if (updateStatus === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured");

        return sendResponse(res, 200, "Book was succsfuly returned");
    },

    getBorrowedBooks: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id)) && Number(id) >= 0)
            return sendResponse(res, 400, "Id needs to be a number");

        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, bookResult]= await databaseHandler.readBorrowedBooks(Number(id));

        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 400, "No books where borrowed for this user");

        return sendResponse(res, 200, bookResult);
    },
}