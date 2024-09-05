import { User } from "../models/user.js";
import { unverifiedUser } from "../models/unverifiedUser.js";
import bcrypt from "bcryptjs";
export async function findUserByEmail(email) {
    return await User.findOne({ email });
}
// Find an unverified user by email
export async function findUnverifiedUserByEmail(email) {
    return await unverifiedUser.findOne({ email });
}
// Delete an unverified user by email
export async function deleteUnverifiedUserByEmail(email) {
    return await unverifiedUser.deleteOne({ email });
}
// Create a new unverified user
export async function createUnverifiedUser(email, password, verificationCode) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUnverifiedUser = new unverifiedUser({
        email,
        password: hashedPassword,
        verificationCode,
        verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
    });
    return await newUnverifiedUser.save();
}
export async function createNewUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
}
// Function to create a new user via google login
export async function createUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
}
// Function to find a user by slug
export async function findUserBySlug(slug) {
    return await User.findOne({ slug });
}
// Function to update a user's slug
export async function updateUserSlug(userId, slug) {
    return await User.findByIdAndUpdate(userId, { slug }, { new: true } // Return the updated document
    );
}
// Function to find a user by ID
export async function findUserById(userId) {
    return await User.findById(userId);
}
// Function to update the user's password
export async function updatePassword(userId, hashedPassword) {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    user.password = hashedPassword;
    return await user.save();
}
// Function to check if an email is already in use
export async function checkEmailInUse(email) {
    return ((await findUserByEmail(email)) || (await findUnverifiedUserByEmail(email)));
}
// Function to remove existing unverified user
export async function removeExistingUnverifiedUser(email) {
    const existingUnverifiedUser = await findUnverifiedUserByEmail(email);
    if (existingUnverifiedUser) {
        await deleteUnverifiedUserByEmail(email);
    }
}
//Function to update a user's email
export async function updateUserEmail(userId, newEmail) {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    // Update the user's email
    user.email = newEmail;
    // Save the updated user
    return await user.save();
}
// Function to update a user's profile picture URL.
export async function updateUserProfilePicture(userId, profilePictureUrl) {
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePictureUrl }, { new: true } // Return the updated document
    );
    if (!updatedUser) {
        throw new Error("User not found.");
    }
    return updatedUser;
}
export const getFullUserBySlug = async (slug) => {
    try {
        const user = await User.findOne({ slug })
            .populate("education")
            .populate("experience")
            .populate("certificates")
            .populate("interests")
            .populate("courses")
            .populate("awards")
            .populate("projects");
        return user;
    }
    catch (error) {
        throw new Error("Error fetching user by slug: " + error.message);
    }
};
export const updateUserWithVerificationCode = async (email, verificationCode, verificationExpires) => {
    try {
        const user = await User.findOneAndUpdate({ email }, {
            verificationCode,
            verificationExpires,
        }, { new: true });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        console.error("Error updating user with verification code:", error.message);
        throw new Error("Failed to update user with verification code");
    }
};
export const deleteVerificationCode = async (email) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ email }, // Find the user by email
        {
            $unset: {
                // Unset the verificationCode and verificationExpires fields
                verificationCode: 1,
                verificationExpires: 1,
            },
        }, { new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    }
    catch (error) {
        console.error("Error deleting verification code:", error.message);
        throw new Error("Failed to delete verification code");
    }
};
export async function updatePasswordByEmail(email, hashedPassword) {
    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found.");
    }
    // Update the user's password
    user.password = hashedPassword;
    // Save the user with the updated password
    return await user.save();
}
