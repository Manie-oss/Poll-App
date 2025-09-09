import { Request, Response } from "express";
import { PollModel } from "../models/poll.model";
import { ApiError, catchError } from "../utils";
import httpStatus from "http-status";

async function createPoll(req: Request, res: Response) {
    const {title, options, visibility, closesAt} = req.body;
    //@ts-ignore
    const userId = req.user._id;
    const data = {
        title,
        options,
        visibility,
        createdBy: userId,
        closesAt
    }
    const [error, pollDoc] = await catchError(PollModel.create(data));
    if(error){
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'error creating poll')
    }
    
  res.status(200).send({message: 'poll created', poll: pollDoc});
}

//fetches all public and active polls
async function getPolls(req: Request, res: Response){
   const [error, allPolls] = await catchError(PollModel.find({status: 'active', visibility: 'public'}).lean());
   if(error) throw new ApiError(httpStatus.UNAUTHORIZED, "error fetching polls");
   res.status(200).send({message: "success", polls: allPolls});
}

//Todo: fetch poll for user account
async function getUserPolls(req: Request, res: Response){
    //@ts-ignore
    const userId = req.user._id;
    const [error, userPolls] = await catchError(PollModel.find({createdBy: userId, status: 'active'}).lean());
    if(error) throw new ApiError(httpStatus.UNAUTHORIZED, "error fetching user polls");
    res.status(200).send({message: "success", polls: userPolls});
}

export default { createPoll, getPolls, getUserPolls };
