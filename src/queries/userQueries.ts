import { User } from "../models/user.js";
import { unverifiedUser } from "../models/unverifiedUser.js";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email: string) {
  return await User.findOne({ email });
}

// Find an unverified user by email
export async function findUnverifiedUserByEmail(email: string) {
  return await unverifiedUser.findOne({ email });
}

// Delete an unverified user by email
export async function deleteUnverifiedUserByEmail(email: string) {
  return await unverifiedUser.deleteOne({ email });
}

// Create a new unverified user
export async function createUnverifiedUser(
  email: string,
  password: string,
  verificationCode: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUnverifiedUser = new unverifiedUser({
    email,
    password: hashedPassword,
    verificationCode,
    verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
  });

  return await newUnverifiedUser.save();
}

export async function createNewUser(userData: {
  email: string;
  password?: string;
  provider?: string;
  isVerified: boolean;
}) {
  const newUser = new User(userData);
  return await newUser.save();
}

// Function to create a new user via google login
export async function createUser(userData: {
  email: string;
  isVerified?: boolean;
  provider?: string;
}) {
  const newUser = new User(userData);
  return await newUser.save();
}

// Function to find a user by slug
export async function findUserBySlug(slug: string) {
  return await User.findOne({ slug });
}

// Function to update a user's slug
export async function updateUserSlug(userId: string, slug: string) {
  return await User.findByIdAndUpdate(
    userId,
    { slug },
    { new: true } // Return the updated document
  );
}

// Function to find a user by ID
export async function findUserById(userId: string) {
  return await User.findById(userId);
}

// Function to update the user's password
export async function updatePassword(userId: string, hashedPassword: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  user.password = hashedPassword;
  return await user.save();
}

// Function to check if an email is already in use
export async function checkEmailInUse(email: string) {
  return (
    (await findUserByEmail(email)) || (await findUnverifiedUserByEmail(email))
  );
}

// Function to remove existing unverified user
export async function removeExistingUnverifiedUser(email: string) {
  const existingUnverifiedUser = await findUnverifiedUserByEmail(email);
  if (existingUnverifiedUser) {
    await deleteUnverifiedUserByEmail(email);
  }
}

//Function to update a user's email
export async function updateUserEmail(userId: string, newEmail: string) {
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
export async function updateUserProfilePicture(
  userId: string,
  profilePictureUrl: string
) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePictureUrl },
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    throw new Error("User not found.");
  }

  return updatedUser;
}

export const getFullUserBySlug = async (slug: string) => {
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
  } catch (error: any) {
    throw new Error("Error fetching user by slug: " + error.message);
  }
};
