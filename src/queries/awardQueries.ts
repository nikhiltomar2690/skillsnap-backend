import { Award } from "../models/award.js";
import { User } from "../models/user.js";

// Function to create a new award
async function createNewAward(userId: string, awardData: any) {
  const newAward = new Award({
    userId,
    ...awardData,
  });

  return await newAward.save();
}

// Function to update user with new award reference
async function updateUserWithAward(userId: string, awardId: string) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { awards: awardId } },
    { new: true }
  );
}

// Function to delete an award by ID
async function deleteAwardById(awardId: string) {
  return await Award.findByIdAndDelete(awardId);
}

// Function to remove award reference from user
async function removeAwardFromUser(userId: string, awardId: string) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { awards: awardId } },
    { new: true }
  );
}
async function getAwardById(awardId: string) {
  return await Award.findById(awardId).populate("userId", "name email");
}

export {
  createNewAward,
  updateUserWithAward,
  deleteAwardById,
  removeAwardFromUser,
  getAwardById,
};
