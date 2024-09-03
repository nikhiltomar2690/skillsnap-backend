import { Experience } from "../models/experience.js";
import { User } from "../models/user.js";

// Function to create a new experience entry
export async function createNewExperience(userId: string, experienceData: any) {
  const newExperience = new Experience({
    userId,
    ...experienceData,
  });

  return await newExperience.save();
}

// Function to update user with new experience reference
export async function updateUserWithExperience(
  userId: string,
  experienceId: string
) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { experience: experienceId } },
    { new: true }
  );
}

// Function to get an experience entry by ID
export async function getExperienceById(experienceId: string) {
  return await Experience.findById(experienceId);
}

// Function to delete an experience entry by ID
export async function deleteExperienceById(experienceId: string) {
  return await Experience.findByIdAndDelete(experienceId);
}

// Function to remove experience reference from user
export async function removeExperienceFromUser(
  userId: string,
  experienceId: string
) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { experience: experienceId } },
    { new: true }
  );
}
