import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../helpers/responseHelpers";

/**
 * This Function is used as a middleware to verify that the input token is valid one
 * @param req the request object that contains the needed header fields
 * @param res the response object that is used to send a resposne
 * @param next a function that is used to call the next middlewre in the chain
 */
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    // read the authorization header
    const authHeadar = req.headers["authorization"];
    
    //if no header is present then return that the user is un authorized
    if (!authHeadar) 
        return sendResponse(res, 401, "Unauthorized to preform operation");

    // remove the "Bearer" part from the string
    const token = authHeadar.split(" ")[1];

    // verify that the token is valid
    jwt.verify(token,(process.env.ACCESS_TOKEN_SECRET as string), (err, data)=> {
        if (err)
            return sendResponse(res, 403, "Invalid Token");

        // Add the username to the request body if the token is valid
        req.body.username = (data as JwtPayload).username; 
        // Call the next middleware
        next();
    });

}