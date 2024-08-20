import mongoose from "mongoose";
const LanguageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    languages: [
        {
            languageName: { type: String, required: true },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"],
            },
        },
    ],
});
export const Language = mongoose.model("Language", LanguageSchema);
