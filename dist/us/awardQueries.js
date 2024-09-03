import { Award } from "../models/award.js";
import { User } from "../models/user.js";
// Function to create a new award
async function createNewAward(userId, awardData) {
    const newAward = new Award({
        userId,
        ...awardData,
    });
    return await newAward.save();
}
// Function to update user with new award reference
async function updateUserWithAward(userId, awardId) {
    return await User.findByIdAndUpdate(userId, { $push: { awards: awardId } }, { new: true });
}
// Function to delete an award by ID
async function deleteAwardById(awardId) {
    return await Award.findByIdAndDelete(awardId);
}
// Function to remove award reference from user
async function removeAwardFromUser(userId, awardId) {
    return await User.findByIdAndUpdate(userId, { $pull: { awards: awardId } }, { new: true });
}
async function getAwardById(awardId) {
    return await Award.findById(awardId).populate("userId", "name email");
}
export { createNewAward, updateUserWithAward, deleteAwardById, removeAwardFromUser, getAwardById, };
