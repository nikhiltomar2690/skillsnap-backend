import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseName: { type: String, required: true },
    link: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    institution: { type: String },
    city: { type: String },
    country: { type: String },
}, {
    timestamps: true,
});
export const Course = mongoose.model("Course", courseSchema);
