import { Response } from "express";

import { DATA_FIELD, STATUS_FIELD, STATUS_FIELD_RESPONSE } from "../constants"; 

export const sendResponse = (res: Response, statusCode: number, message: unknown) =>{
    return res.status(statusCode).json({
        [STATUS_FIELD]: statusCode >= 200 && statusCode <= 299 ? STATUS_FIELD_RESPONSE.STATUS_FIELD_SUCCESS_RESPONSE : STATUS_FIELD_RESPONSE.STATUS_FIELD_FAILD_RESPONSE,
        [DATA_FIELD]: message
    });
};