import mongoose from "mongoose";
import { nanoid } from "nanoid";
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: false },
    profilePictureUrl: { type: String },
    userBio: { type: String },
    // user slug
    slug: { type: String, unique: true, default: () => nanoid(10) },
    // auth related properties
    verificationCode: { type: String },
    verificationExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    provider: { type: String }, // Track authentication provider
    // References to other collections
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    skills: [
        {
            skillName: {
                type: String,
                required: [true, "Skill name is required"],
                minlength: [2, "Skill name must be at least 2 characters long"],
            },
            level: {
                type: String,
                enum: {
                    values: ["Beginner", "Intermediate", "Advanced", "Expert"],
                    message: "Level must be either Beginner, Intermediate, Advanced, or Expert",
                },
            },
            link: {
                type: String,
                validate: {
                    validator: function (v) {
                        // regex to validate email
                        return v === "" || /^https?:\/\/.+/i.test(v);
                    },
                    message: "Link must be a valid URL",
                },
            },
        },
    ],
    languages: [
        {
            languageName: {
                type: String,
                required: [true, "Language name is required"],
                minlength: [2, "Language name must be at least 2 characters long"],
            },
            level: {
                type: String,
                enum: {
                    values: ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"],
                    message: "Level must be either Beginner, Intermediate, Advanced, Fluent, or Native",
                },
            },
        },
    ],
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest" }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    awards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Award" }],
});
export const User = mongoose.model("User", userSchema);
