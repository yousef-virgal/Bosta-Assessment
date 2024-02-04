import {Request, Response} from "express";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendResponse } from "../helpers/responseHelpers";
import { BaseDataBaseHandler } from "../database_handlers/base_database_handler/base_database_handler";
import DataBaseHandler from "../database_handlers/mysql_database_handler/mysql_database_instance";
import { DATABASE_OPERATION_STATUS } from "../database_handlers/base_database_handler/base_database_handler_types";
import { Admin } from "../database_handlers/models/adminModel";

/**
 * This function is used as handler for when a login request is made 
 * @param req the request object that contains the needed body parameters
 * @param res the response object that is used to send a resposne
 * @returns 
 */
export const loginControler = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    // checks if the username nd password are present
    if(!username  || !password)
        return sendResponse(res, 401, "User name and password are required");

    // fetch the admins with the specied username 
    let dataBaseHandler: BaseDataBaseHandler = DataBaseHandler;
    let [status, result] =  await dataBaseHandler.readAdminUser(username);

    if(status === DATABASE_OPERATION_STATUS.SUCCESS){
        // compare the password with the hased password from the database, if the result is false then the provided input is wrong
        if(bycrypt.compareSync(password, result?.password || "") === false)
            return sendResponse(res, 401, "Username or password are incorrect");

        //Create a new JWT aceess and refresh tokens
        const acessToken = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:"1h"});
        const refreshToken = jwt.sign({username},process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:"1d"});
        // update the admin with the new refresh token
        const updateStatus = await dataBaseHandler.updateAdminUserToken(refreshToken, (result as Admin).admin_id);

        if (updateStatus === DATABASE_OPERATION_STATUS.SUCCESS)
            return sendResponse(res, 200, {acessToken, refreshToken});
        else
            return sendResponse(res, 500, "A database error occured");
    }
    else{
        return sendResponse(res, 401, "Username or password are incorrect");
    }
};