import mongoose from "mongoose";
const blockSchema = new mongoose.Schema({
    blockHeading: {
        type: String,
        required: true,
    },
    blockImg: {
        type: String,
    },
    blockText: {
        type: String,
    },
}, { _id: false });
const projectSchema = new mongoose.Schema({
    coverImage: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    role: {
        type: String,
    },
    date: {
        type: Date,
    },
    blocks: [blockSchema],
    urls: [
        {
            urlTitle: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
        },
    ],
}, { timestamps: true });
const Project = mongoose.model("Project", projectSchema);
export default Project;
