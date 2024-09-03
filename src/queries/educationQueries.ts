import { Education } from "../models/education.js";
import { User } from "../models/user.js";

// Function to create a new education entry
export async function createNewEducation(userId: string, educationData: any) {
  const newEducation = new Education({
    userId,
    ...educationData,
  });

  return await newEducation.save();
}

// Function to update user with new education reference
export async function updateUserWithEducation(
  userId: string,
  educationId: string
) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { education: educationId } },
    { new: true }
  );
}

// Function to get an education entry by ID
export async function getEducationById(educationId: string) {
  return await Education.findById(educationId);
}

// Function to delete an education entry by ID
export async function deleteEducationById(educationId: string) {
  return await Education.findByIdAndDelete(educationId);
}

// Function to remove education reference from user
export async function removeEducationFromUser(
  userId: string,
  educationId: string
) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { education: educationId } },
    { new: true }
  );
}
