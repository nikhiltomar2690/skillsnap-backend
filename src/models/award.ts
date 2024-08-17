import mongoose from "mongoose";

const awardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  awardName: { type: String, required: true },
  link: { type: String },
  issuedBy: { type: String },
  awardDate: { type: Date },
  description: { type: String },
});

export const Award = mongoose.model("Award", awardSchema);
