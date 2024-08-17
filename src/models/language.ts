import mongoose from "mongoose";

const languageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Fluent"],
    },
  },
  {
    timestamps: true,
  }
);

export const Language = mongoose.model("Language", languageSchema);
