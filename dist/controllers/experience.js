import { Experience } from "../models/experience.js";
export const createExperience = async (req, res) => {
    // no need to handle userId check because I will already check the user
    // on the frontend side from the useSession hook of next-auth
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
        await newExperience.save();
        return res
            .status(201)
            .json({ success: true, message: "Experience created successfully" });
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
    try {
        const deletedExperience = await Experience.findByIdAndDelete(id);
        if (!deletedExperience) {
            return res
                .status(404)
                .json({ success: false, message: "Experience not found" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Experience deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
