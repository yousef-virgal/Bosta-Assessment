import { NextFunction, Request, Response } from "express"
import Redis from "ioredis";
import { sendResponse } from "../helpers/responseHelpers";

const redisClient = new Redis({host: "redis"});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction ) => {
    const username: string = req.body.username

    const currentTime = new Date().getTime();
    const result = await redisClient.hgetall(username);
    if(Object.keys(result).length == 0){
        await redisClient.hset(username, {
            "createdAt": currentTime,
            "count": 1
        });
        return next();
    }

    if(result){
        let timeDiff = (currentTime - Number(result["createdAt"]));
        if(timeDiff > Number(process.env.RATE_LIMIT_DURATION)){
            await redisClient.hset(username,{
                "createdAt": currentTime,
                "count": 1
            })
            return next();
        }
    }
    if (Number(result["count"]) >= Number(process.env.NUMBER_OF_REQUESTS_ALLOWED)){
        return sendResponse(res, 429, "User request limit reached");
    }
    else {
        await redisClient.hset(username, {
            "count": parseInt(result["count"]) + 1 
        })
        return next();
    }
}