import { Request, Response } from "express";

import { sendResponse } from "../helpers/responseHelpers";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";


interface BrorowerController {
    fetchBorrowers: (req: Request, res: Response) => Promise<unknown>;
    updateBorrower: (req: Request, res: Response) => Promise<unknown>;
    deleteBorrower: (req: Request, res: Response) => Promise<unknown>;
    addBorrower: (req: Request, res: Response) => Promise<unknown>;

}

export const borrowerController: BrorowerController = {

    fetchBorrowers: async (req: Request, res: Response) => {
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const [status, result] = await databaseHandler.readBorrowers();

        if(status === DATABASE_OPERATION_STATUS.FAIL)
            return sendResponse(res, 500, "A database error occured"); 
        
        return sendResponse(res, 200, result);
    },

    updateBorrower: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id)))
            return sendResponse(res, 400, "Id needs to be a number");
        
        const {name, email, register_date} = req.body;
        
        if (!name || !email || !register_date)
            return sendResponse(res, 400, "Missing Paramters");
        
        let date: Date;

        try {
            date = new Date(register_date);
        }
        catch {
            return sendResponse(res, 400, "register_date needs to be a valid date");
        }

        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.updateBorrower(name, email, date, Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Borrower was updated");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    deleteBorrower: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (isNaN(Number(id)))
            return sendResponse(res, 400, "Id needs to be a number");
        
        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.deleteBorrower(Number(id));

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Borrower was deleted");
        else
            return sendResponse(res, 404, "No entry found with this id");
    },

    addBorrower: async (req: Request, res: Response) => {
        const {name, email, register_date} = req.body;
        
        if (!name || !email || !register_date)
            return sendResponse(res, 400, "Missing Paramters");
        
        let date: Date;
        try {
            date = new Date(register_date);
        }
        catch {
            return sendResponse(res, 400, "register_date needs to be a valid date");
        }

        const databaseHandler: BaseDataBaseHandler = DataBaseHandler;
        const status = await databaseHandler.addBorrower(name, email, date);

        if (status == DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, "Borrower was added");
        else
            return sendResponse(res, 500, "A database error occured");
    }
}