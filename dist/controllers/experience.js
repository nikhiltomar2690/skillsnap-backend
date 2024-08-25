import { Experience } from "../models/experience.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";
export const createExperience = async (req, res) => {
    const { userId, companyName, link, title, city, country, typeofJob, startDate, endDate, isCurrent, skills, } = req.body;
    // Validate the input data
    if (!userId ||
        !companyName ||
        !title ||
        !city ||
        !country ||
        !typeofJob ||
        !startDate ||
        !skills) {
        return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
    }
    try {
        // Create a new experience entry
        const newExperience = new Experience({
            userId, // Linking experience to the user
            companyName,
            link,
            title,
            city,
            country,
            typeofJob,
            startDate,
            endDate,
            isCurrent,
            skills,
        });
        // Save the new experience entry
        const savedExperience = await newExperience.save();
        // Add the experience ID to the user's experiences array
        await User.findByIdAndUpdate(userId, {
            $push: { experience: savedExperience._id },
        }, { new: true });
        return res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: savedExperience,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getExperience = async (req, res) => {
    // route: /experience/get/:id
    // example : /experience/get/60f3b3b3b3b3b3b3b3b3b3b
    const { id } = req.params;
    try {
        const experience = await Experience.findById(id);
        if (!experience) {
            return res
                .status(404)
                .json({ success: false, message: "Experience not found" });
        }
        return res.status(200).json({ success: true, data: experience });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteExperience = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid experience ID",
        });
    }
    try {
        // Find the experience to get the associated userId
        const experience = await Experience.findById(id);
        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }
        // Remove the experience reference from the User
        await User.findByIdAndUpdate(experience.userId, { $pull: { experience: id } }, // Ensure 'experience' is the correct field name
        { new: true } // Return the updated document
        );
        // Delete the experience
        await Experience.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Experience and reference from user deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting experience:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
