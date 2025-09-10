import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import {jwtPayload} from "./../services/token.service";
import { UserModel } from "../models/user.model";

export async function auth(req: Request, res: Response, next: NextFunction){
    const auth_token = req.headers.authorization;
    if(!auth_token){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'please authenticate');
    }
    const secretKey = process.env.SECRET_KEY || "default_key"
    try {
       const payload = jwt.verify(auth_token, secretKey) as jwtPayload;
       if(payload.tokenType !== 'access'){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'please provide valid access token'); 
       }
       const user = await UserModel.findById(payload.userId);
       //@ts-ignore
       req.user = user;
       next();
    } catch (error: any) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `${error.message}, please authenticate`);
    }
}