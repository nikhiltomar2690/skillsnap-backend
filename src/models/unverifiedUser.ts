import mongoose from "mongoose";

const unverifieduserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },

  // auth related properties
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  provider: { type: String }, // Track authentication provider
});

export const unverifiedUser = mongoose.model(
  "unverifiedUser",
  unverifieduserSchema
);
