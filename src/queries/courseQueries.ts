import { Course } from "../models/course.js";
import { User } from "../models/user.js";

// Function to create a new course
export async function createNewCourse(userId: string, courseData: any) {
  const newCourse = new Course({
    userId,
    ...courseData,
  });

  return await newCourse.save();
}

// Function to update user with new course reference
export async function updateUserWithCourse(userId: string, courseId: string) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { courses: courseId } },
    { new: true }
  );
}

// Function to get a course by ID
export async function getCourseById(courseId: string) {
  return await Course.findById(courseId);
}

// Function to delete a course by ID
export async function deleteCourseById(courseId: string) {
  return await Course.findByIdAndDelete(courseId);
}

// Function to remove course reference from user
export async function removeCourseFromUser(userId: string, courseId: string) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { courses: courseId } },
    { new: true }
  );
}
