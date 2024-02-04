import { NextFunction, Request, Response } from "express"
import Redis from "ioredis";
import { sendResponse } from "../helpers/responseHelpers";

const redisClient = new Redis({host: "redis"});

/**
 * This Function is used as middleware to handle rate limiting an endpoint 
 * @param req the request object that contains the needed body parameters
 * @param res the response object that is used to send a resposne
 * @param next a function that is used to call the next middlewre in the chain
 */
export const rateLimiter = async (req: Request, res: Response, next: NextFunction ) => {
    // get the username from the body
    const username: string = req.body.username

    // get the current time
    const currentTime = new Date().getTime();
    // fetch the record associated with the username provided
    const result = await redisClient.hgetall(username);
    
    // check if a record exists, if not then create a new record in redis with the username as key
    if(Object.keys(result).length == 0){
        await redisClient.hset(username, {
            "createdAt": currentTime,
            "count": 1
        });
        // call the next middleware
        return next();
    }

    if(result){
        // get the differnence between the current time and the time of last request
        let timeDiff = (currentTime - Number(result["createdAt"]));

        // if time gerater then limit then reset the count
        if(timeDiff > Number(process.env.RATE_LIMIT_DURATION)){
            await redisClient.hset(username,{
                "createdAt": currentTime,
                "count": 1
            })
            // call the next middleware
            return next();
        }
    }
    // if the count of requests is greater the the number of alowed requests then the limit was exceeded
    if (Number(result["count"]) >= Number(process.env.NUMBER_OF_REQUESTS_ALLOWED)){
        return sendResponse(res, 429, "User request limit reached");
    }
    else {
        // update the count as the prevoius count + 1
        await redisClient.hset(username, {
            "count": parseInt(result["count"]) + 1 
        })
        return next();
    }
}