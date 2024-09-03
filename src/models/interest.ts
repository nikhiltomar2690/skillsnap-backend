import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    interests: [
      {
        interestName: { type: String, required: true },
        link: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Interest = mongoose.model("Interest", interestSchema);
