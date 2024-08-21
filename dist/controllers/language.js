import { Language } from "../models/language.js";
export const createLanguage = async (req, res) => {
    const { userId, languages } = req.body;
    if (!userId ||
        !languages ||
        !Array.isArray(languages) ||
        languages.length === 0) {
        return res.status(400).json({
            success: false,
            message: "userId and an array of languages are required.",
        });
    }
    try {
        const newLanguage = new Language({
            userId,
            languages,
        });
        await newLanguage.save();
        return res.status(201).json({
            success: true,
            message: "Languages added successfully",
            data: newLanguage,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteLanguage = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLanguage = await Language.findByIdAndDelete(id);
        if (!deletedLanguage) {
            return res.status(404).json({
                success: false,
                message: "Language entry not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Language entry deleted successfully",
            data: deletedLanguage,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getLanguage = async (req, res) => {
    const { id } = req.params;
    try {
        const language = await Language.findById(id).populate("userId", "name email");
        if (!language) {
            return res.status(404).json({
                success: false,
                message: "Language entry not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: language,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
