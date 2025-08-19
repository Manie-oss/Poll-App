import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    // userId: String,
    email: String,
    fullName: String,
    hashedPassword: String,
    status: String,
}, {
    timestamps: true,
});

export const UserModel = mongoose.model('users', UserSchema);