import { Document } from "mongoose";
export interface IUser {
    email: string,
    firstName: string,
    lastName?: string,
    password: string,
    isEmailVerified: boolean,
    verificationToken?: string,
    verificationTokenExpire?: Date
}

export interface IUserDoc extends Document, IUser {
    getVerificationToken(): string;
} 