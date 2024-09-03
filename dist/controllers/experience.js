import { createNewExperience, updateUserWithExperience, getExperienceById, deleteExperienceById, removeExperienceFromUser, } from "../queries/experienceQueries.js";
export const createExperience = async (req, res) => {
    const { userId, companyName, link, title, city, country, typeofJob, startDate, endDate, isCurrent, skills, } = req.body;
    // Validate the input data
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
        });
    }
    if (!companyName) {
        return res.status(400).json({
            success: false,
            message: "Company name is required",
        });
    }
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Title is required",
        });
    }
    try {
        // Create a new experience entry
        const newExperience = await createNewExperience(userId, {
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
        // Add the experience ID to the user's experiences array
        const updatedUser = await updateUserWithExperience(userId, newExperience._id.toString());
        return res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: newExperience,
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
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Experience ID is required",
        });
    }
    try {
        const experience = await getExperienceById(id);
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
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Experience ID is required",
        });
    }
    try {
        // Find the experience to get the associated userId
        const experience = await deleteExperienceById(id);
        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }
        // Remove the experience reference from the User
        await removeExperienceFromUser(experience.userId.toString(), id);
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
