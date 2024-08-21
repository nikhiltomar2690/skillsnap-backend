import { Course } from "../models/course.js";
export const createCourse = async (req, res) => {
    const { userId, courseName, link, startDate, endDate, isCurrent, description, institution, city, country, } = req.body;
    if (!userId || !courseName) {
        return res.status(400).json({
            success: false,
            message: "userId and courseName are required.",
        });
    }
    try {
        const newCourse = new Course({
            userId,
            courseName,
            link,
            startDate,
            endDate,
            isCurrent,
            description,
            institution,
            city,
            country,
        });
        await newCourse.save();
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            data: deletedCourse,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
