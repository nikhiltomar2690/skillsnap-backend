import { Experience } from "../models/experience.js";
import { User } from "../models/user.js";
// Function to create a new experience entry
export async function createNewExperience(userId, experienceData) {
    const newExperience = new Experience({
        userId,
        ...experienceData,
    });
    return await newExperience.save();
}
// Function to update user with new experience reference
export async function updateUserWithExperience(userId, experienceId) {
    return await User.findByIdAndUpdate(userId, { $push: { experience: experienceId } }, { new: true });
}
// Function to get an experience entry by ID
export async function getExperienceById(experienceId) {
    return await Experience.findById(experienceId);
}
// Function to delete an experience entry by ID
export async function deleteExperienceById(experienceId) {
    return await Experience.findByIdAndDelete(experienceId);
}
// Function to remove experience reference from user
export async function removeExperienceFromUser(userId, experienceId) {
    return await User.findByIdAndUpdate(userId, { $pull: { experience: experienceId } }, { new: true });
}
