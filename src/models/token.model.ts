import mongoose, { isValidObjectId } from "mongoose";
import { tokenTypes } from "../utils/enums";

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tokenType: {
        type: String,
        enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD]
    },
    expires: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
  });

export const TokenModel = mongoose.model('tokens', TokenSchema);