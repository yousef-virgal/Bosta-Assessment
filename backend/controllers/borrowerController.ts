import { Request, Response } from "express";

import { sendResponse } from "../helpers/responseHelpers";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";
import { getDateFromString } from "../helpers/timeHelpers";


interface BrorowerController {
    fetchBorrowers: (req: Request, res: Response) => Promise<unknown>;
    updateBorrower: (req: Request, res: Response) => Promise<unknown>;
    deleteBorrower: (req: Request, res: Response) => Promise<unknown>;
    addBorrower: (req: Request, res: Response) => Promise<unknown>;

}

export const borrowerController: BrorowerController = {

    /**
     * This function is used as handler for when a request is made to fetch all the borrowers
     * @param req the request object
     * @param res the response object that is used to send a resposne
     */
    fetchBorrowers: async (req: Request, res: Response) => {
        // Read the borrowers and thier details from the database
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBorrowers();

        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured"); 
        
        return sendResponse(res, 200, result);
    },

    /**
     * This function is used as handler for when a requst is made to update thethe borrowers
     * @param req the request object that contains the needed body parameters
     * @param res the response object that is used to send a resposne
     */
    updateBorrower: async (req: Request, res: Response) => {
        const { id } = req.params;

        //Check if the borrower id is a valid input 
        if (isNaN(Number(id)) && Number(id) >= 0)
            return sendResponse(res, 400, "Id needs to be a number");
        
        const {name, email, register_date} = req.body;

        //Check if all parameters are present
        if (!name || !email || !register_date)
            return sendResponse(res, 400, "Missing Paramters");
        
        // check if the registration date is a valid date and convert it to a date object 
        const [operationStatus, date] = getDateFromString(register_date);
        
        if (operationStatus === false)
            return sendResponse(res, 400, "register_date needs to be a valid date");

        // Updates the borrower with the details needed
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.updateBorrower(name, email, date as Date, Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Borrower was updated");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    /**
     * This Function is used as handler for when a rquest is made to delete a borrower 
     * @param req the request object that contains the needed body parameters
     * @param res the response object that is used to send a resposne
     */
    deleteBorrower: async (req: Request, res: Response) => {
        const { id } = req.params;

        // checks if the borrower id is a valid input
        if (isNaN(Number(id)) && Number(id) >= 0)
            return sendResponse(res, 400, "Id needs to be a number");
        
        // make the database request to delete the borrower
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.deleteBorrower(Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Borrower was deleted");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    /**
     * This Function is used as handler for when a rquest is made to add a borrower
     * @param req the request object that contains the needed body parameters
     * @param res the response object that is used to send a resposne
     */
    addBorrower: async (req: Request, res: Response) => {
        const {name, email, register_date} = req.body;
        
        //Check if all parameters are present
        if (!name || !email || !register_date)
            return sendResponse(res, 400, "Missing Paramters");
        
        // check if the registration date is valid and convert it to a string 
        const [operationStatus, date] = getDateFromString(register_date);
        if(operationStatus === false)
            return sendResponse(res, 400, "register_date needs to be a valid date");

        // Add the borrower to the borrower table
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.addBorrower(name, email, date as Date);

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Borrower was added");
        else
            return sendResponse(res, 500, "A database error occured");
    }
}