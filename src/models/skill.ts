import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user
    skill: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model("Skill", skillSchema);
