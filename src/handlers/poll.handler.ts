import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { PollModel } from "../models/poll.model";

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
    await PollModel.create({data});
    
  res.status(200).send('poll created');
}

export default { createPoll };
