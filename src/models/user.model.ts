import mongoose from "mongoose";
import {IUser, IUserDoc} from "../interfaces/models/user.types";


const UserSchema = new mongoose.Schema<IUserDoc>({
    // userId: String,
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    password:{
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toJSON: {
    transform: function (doc: IUserDoc, ret: any) {
      delete ret.password; // Remove password from the JSON output
      ret.id = ret._id;    // Rename _id to id
      delete ret._id;      // Remove original _id
      delete ret.__v;      // Remove Mongoose version key
      delete ret.createdAt;
      delete ret.updatedAt;      
    }}
});

export const UserModel = mongoose.model<IUserDoc>('users', UserSchema);