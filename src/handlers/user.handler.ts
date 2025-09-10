import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ApiError, catchError } from "../utils";
import httpStatus from "http-status";

async function updateUser(req: Request, res: Response){
    const userId = req.params;
    const updateUserData = req.body;
    const [error, user] = await catchError(UserModel.findByIdAndUpdate({_id: userId}, {$set: updateUserData}, {new: true}).lean());
    if(error) throw new ApiError(httpStatus.UNAUTHORIZED, "error updating user");
    res.status(200).send({message: "user updated successfully", userInfo: user});
}

async function deleteUser(req: Request, res: Response){
    const userId = req.params;
    const [error, user] = await catchError(UserModel.findByIdAndDelete({_id: userId}));
    if(error) throw new ApiError(httpStatus.UNAUTHORIZED, "error deleting user");
    res.status(200).send({message: "user deleted successfully", userInfo: user});
}

export default {updateUser, deleteUser};