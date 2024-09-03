import { createNewCourse, updateUserWithCourse, getCourseById, deleteCourseById, removeCourseFromUser, } from "../queries/courseQueries.js";
export const createCourse = async (req, res) => {
    const { userId, courseName, link, startDate, endDate, isCurrent, description, institution, city, country, } = req.body;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId is required.",
        });
    }
    if (!courseName) {
        return res.status(400).json({
            success: false,
            message: "courseName is required.",
        });
    }
    try {
        const newCourse = await createNewCourse(userId, {
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
        await updateUserWithCourse(userId, newCourse._id.toString());
        // send response using functions
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    }
    catch (error) {
        // change to 400 for request errors
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCourse = await deleteCourseById(id);
        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        await removeCourseFromUser(deletedCourse.userId.toString(), id);
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
        const course = await getCourseById(id);
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
