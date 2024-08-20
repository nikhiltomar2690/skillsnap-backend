import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: false },
    profilePictureUrl: { type: String },
    userBio: { type: String },
    // References to other collections
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest" }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    awards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Award" }],
});
export const User = mongoose.model("User", userSchema);
