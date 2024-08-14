import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
