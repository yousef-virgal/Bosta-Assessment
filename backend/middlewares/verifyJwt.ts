import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../helpers/responseHelpers";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeadar = req.headers["authorization"];
    if (!authHeadar) 
        return sendResponse(res, 401, "Unauthorized to preform operation");
    const token = authHeadar.split(" ")[1];
    jwt.verify(token,(process.env.ACCESS_TOKEN_SECRET as string), (err, data)=> {
        if (err)
            return sendResponse(res, 403, "Invalid Token");
        next();
    });

}