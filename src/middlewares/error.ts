import { ApiError } from "../utils";
import mongoose from 'mongoose';
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if(!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let {statusCode, message} = err;
    res.locals.ErrorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.ENV === 'development' && { stack: err.stack }),
    }

    if(process.env.ENV === 'development'){
        console.log(err);
    }
    res.status(statusCode).send(response);
}
