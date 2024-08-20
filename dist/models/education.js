import mongoose from "mongoose";
const EducationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    degreeName: { type: String, required: true },
    link: { type: String },
    school: { type: String },
    city: { type: String },
    country: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
}, {
    timestamps: true,
});
export const Education = mongoose.model("Education", EducationSchema);
