import { Interest } from "../models/interest.js";
import { User } from "../models/user.js";
export const createInterest = async (req, res) => {
    const { userId, interests } = req.body;
    if (!userId ||
        !interests ||
        !Array.isArray(interests) ||
        interests.length === 0) {
        return res.status(400).json({
            success: false,
            message: "userId and an array of interests are required.",
        });
    }
    try {
        const newInterest = new Interest({ userId, interests });
        await newInterest.save();
        await User.findByIdAndUpdate(userId, { $push: { interests: newInterest._id } }, { new: true });
        return res.status(201).json({
            success: true,
            message: "Interest created successfully",
            data: newInterest,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteInterest = async (req, res) => {
    const { id } = req.params;
    try {
        const interest = await Interest.findById(id);
        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found",
            });
        }
        await User.findByIdAndUpdate(interest.userId, { $pull: { interests: id } }, { new: true });
        await Interest.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Interest deleted successfully",
            data: interest,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getInterest = async (req, res) => {
    const { id } = req.params;
    try {
        const interest = await Interest.findById(id).populate("userId", "name email");
        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: interest,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
