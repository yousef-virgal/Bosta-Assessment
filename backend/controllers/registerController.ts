import {Request, Response} from "express";
import bycrypt from "bcrypt";

import { sendResponse } from "../helpers/responseHelpers";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";

export const regisetrControler = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if(!username  || !password)
        return sendResponse(res, 400, "User name and password are required");

    let dataBaseHandler: BaseDataBaseHandler = DataBaseHandler;
    let [status, result] =  await dataBaseHandler.readAdminUser(username);

    if(status === DATABASE_OPERATION_STATUS.FAIL){
        const hashedPassowrd = await bycrypt.hash(password, 10);
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