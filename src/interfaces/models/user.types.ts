import { Document } from "mongoose";
export interface IUser {
    email: string,
    firstName: string,
    lastName?: string,
    password: string,
    isEmailVerified: boolean,
}

export interface IUserDoc extends Document, IUser {} 