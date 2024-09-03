import { Course } from "../models/course.js";
import { User } from "../models/user.js";
// Function to create a new course
export async function createNewCourse(userId, courseData) {
    const newCourse = new Course({
        userId,
        ...courseData,
    });
    return await newCourse.save();
}
// Function to update user with new course reference
export async function updateUserWithCourse(userId, courseId) {
    return await User.findByIdAndUpdate(userId, { $push: { courses: courseId } }, { new: true });
}
// Function to get a course by ID
export async function getCourseById(courseId) {
    return await Course.findById(courseId);
}
// Function to delete a course by ID
export async function deleteCourseById(courseId) {
    return await Course.findByIdAndDelete(courseId);
}
// Function to remove course reference from user
export async function removeCourseFromUser(userId, courseId) {
    return await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } }, { new: true });
}
