import mongoose from "mongoose";
const certificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    certificateName: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isLifetime: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});
export const Certificate = mongoose.model("Certificate", certificateSchema);
