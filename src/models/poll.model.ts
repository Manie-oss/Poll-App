import mongoose from "mongoose";
import { pollVisibility, pollStatus } from "../utils/enums";

const optionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  }
});

const PollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    // imageUrl: String,
    options: {
    type: [optionSchema],
    validate: {
      validator: function (v:[]) {
        return Array.isArray(v) && v.length >= 2;
      },
      message: 'A poll must have at least two options.'
    }
  },
    createdBy:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    visibility: {
        type: String,
        enum: [pollVisibility.PUBLIC, pollVisibility.PRIVATE],
        default: pollVisibility.PUBLIC 
    },
    status: {
        type: String,
        enum: [pollStatus.ACTIVE, pollStatus.CLOSED],
        default: pollStatus.ACTIVE
    },
    closesAt: {
        type: Date,
        required: true,
    },
    // accessLink: String
}, {
    timestamps: true,
  });

export const PollModel = mongoose.model('polls', PollSchema);