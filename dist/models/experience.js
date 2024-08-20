import mongoose from "mongoose";
const experienceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    link: { type: String },
    title: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    typeofJob: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"],
    },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    skills: [{ type: String }],
});
export const Experience = mongoose.model("Experience", experienceSchema);
