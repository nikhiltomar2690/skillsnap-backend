import mongoose from "mongoose";

const SkillsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skills: [
    {
      skillName: { type: String, required: true },
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      },
      link: { type: String },
    },
  ],
});

export const Skills = mongoose.model("Skills", SkillsSchema);
