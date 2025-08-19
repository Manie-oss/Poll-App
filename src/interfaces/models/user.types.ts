import { Document } from "mongoose";

export interface IUser {
    email: string,
    firstName: string,
    lastName?: string,
    password: string,
    status: string,
}

export interface IUserDoc extends Document, IUser {} 