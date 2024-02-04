import {Request, Response} from "express";
import bycrypt from "bcrypt";

import { sendResponse } from "../helpers/responseHelpers";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";

/**
 * This Function is used as handler for when a request is made to register a admin user 
 * @param req the request object that contains the needed body parameters
 * @param res the response object that is used to send a resposne
 */
export const regisetrControler = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    // checks if the username nd password are present
    if(!username  || !password)
        return sendResponse(res, 400, "User name and password are required");

    // fetch the admins with the specied username 
    let dataBaseHandler: BaseDataBaseHandler = DataBaseHandler;
    let [status, result] =  await dataBaseHandler.readAdminUser(username);

    // if no user exists then the user is new and doesn't exist in the database 
    if(status === DATABASE_OPERATION_STATUS.FAIL){
        // hash the password to save in the database
        const hashedPassowrd = await bycrypt.hash(password, 10);
        // add the user to the database 
        const addtionStatus = await dataBaseHandler.addAdminUser(username, hashedPassowrd); 
        if (addtionStatus === DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 201, "User successfuly registred");
        else
            return sendResponse(res, 500, "A database error occured");
    }
    else {
        return sendResponse(res, 409, "User already exists");
    }
};