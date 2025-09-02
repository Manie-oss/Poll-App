import mongoose from "mongoose";
import crypto from "crypto";
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
    verificationToken: String,
    verificationTokenExpire: Date,
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
      delete ret.verificationToken;
      delete ret.verificationTokenExpire;
    }}
});

UserSchema.methods.getVerificationToken = function () {
  const token = crypto.randomBytes(20).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.verificationTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return token;
};

export const UserModel = mongoose.model<IUserDoc>('users', UserSchema);