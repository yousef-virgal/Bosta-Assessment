import { Response } from "express";

import { DATA_FIELD, STATUS_FIELD, STATUS_FIELD_RESPONSE } from "../constants"; 
/**
 * This Function is used to format and send a response object
 * @param res an instance from the response object
 * @param statusCode the status code to send back
 * @param message the messgae to send with the response
 * @returns the response object to send over http
 */
export const sendResponse = (res: Response, statusCode: number, message: unknown) =>{
    return res.status(statusCode).json({
        [STATUS_FIELD]: statusCode >= 200 && statusCode <= 299 ? STATUS_FIELD_RESPONSE.STATUS_FIELD_SUCCESS_RESPONSE : STATUS_FIELD_RESPONSE.STATUS_FIELD_FAILD_RESPONSE,
        [DATA_FIELD]: message
    });
};