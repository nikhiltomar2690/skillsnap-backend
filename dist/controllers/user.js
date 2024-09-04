import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { parse } from "cookie";
import { findUserByEmail, findUnverifiedUserByEmail, deleteUnverifiedUserByEmail, createUnverifiedUser, createNewUser, createUser, findUserBySlug, updateUserSlug, updatePassword, removeExistingUnverifiedUser, updateUserEmail, updateUserProfilePicture, } from "../queries/userQueries.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUtil.js";
import sendEmail from "../utils/sendMail.js";
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received registration request with email:", email);
    if (!email) {
        return res
            .status(400)
            .json({ success: false, message: "Email is required" });
    }
    if (!password) {
        return res
            .status(400)
            .json({ success: false, message: "Password is required" });
    }
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email is already registered" });
        }
        console.log("No existing user found, proceeding with registration");
        const existingUnverifiedUser = await findUnverifiedUserByEmail(email);
        if (existingUnverifiedUser) {
            console.log("Found existing unverified user, deleting it");
            await deleteUnverifiedUserByEmail(email);
        }
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Generated verification code:", verificationCode);
        // const newUnverifiedUser = new unverifiedUser({
        //   email,
        //   password: hashedPassword,
        //   verificationCode,
        //   verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        // });
        const newUnverifiedUser = await createUnverifiedUser(email, hashedPassword, verificationCode);
        console.log("Unverified user saved to database");
        await sendEmail(email, verificationCode);
        console.log("Verification email sent, setting cookie");
        return res
            .status(200)
            .cookie("unverifiedEmail", email, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // cookie expires in 15 minutes
            path: "/",
        })
            .json({
            success: true,
            message: "User created successfully, please check your email for verification",
        });
    }
    catch (e) {
        console.error("Error registering user:", e.message);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
export const verifyUser = async (req, res) => {
    const { code } = req.body;
    const cookies = parse(req.headers.cookie || "");
    const email = cookies.unverifiedEmail;
    if (!email) {
        return res
            .status(400)
            .json({ success: false, message: "Email not found in cookie" });
    }
    if (!code) {
        return res
            .status(400)
            .json({ success: false, message: "Verification code not found" });
    }
    try {
        const UnverifiedUser = await findUnverifiedUserByEmail(email);
        if (!UnverifiedUser) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        // Check if the code is valid and not expired
        if (UnverifiedUser.verificationCode !== code ||
            !(UnverifiedUser.verificationExpires instanceof Date) ||
            new Date() > UnverifiedUser.verificationExpires) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
            return;
        }
        // Create a new user document
        const newUser = await createNewUser({
            email: UnverifiedUser.email,
            password: UnverifiedUser.password || "",
            provider: UnverifiedUser.provider || "",
            isVerified: true,
        });
        // Remove the entry from the UnverifiedUser collection
        await deleteUnverifiedUserByEmail(email);
        // Clear the unverifiedEmail cookie saved in the browser
        res
            .status(200)
            .cookie("unverifiedEmail", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
        })
            .json({ success: true, message: "User verified successfully" });
    }
    catch (error) {
        console.error("Error verifying user:", error.message);
        return res
            .status(500)
            .json({ success: false, message: "An error occurred" });
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await findUserByEmail(email);
        if (user &&
            user.password &&
            (await bcrypt.compare(password, user.password))) {
            const { password: _, ...userWithoutPassword } = user.toObject();
            res.status(200).json({ user: userWithoutPassword });
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const loginViaGoogle = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const newUser = await createUser({
                email,
                isVerified: true,
                provider: "google",
            });
            return res.status(201).json({ message: "User created successfully" });
        }
        // If user exists, just return success
        return res.status(200).json({ message: "User logged in successfully" });
    }
    catch (err) {
        console.error("Error handling Google login:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updateSlug = async (req, res) => {
    const { userId, slug } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User Id is required" });
    }
    if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
    }
    try {
        const existingUser = await findUserBySlug(slug);
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const updatedUser = await updateUserSlug(userId, slug);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Slug updated successfully",
            data: updatedUser,
        });
    }
    catch (err) {
        console.log("Error Updating Slug", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const updateUserPassword = async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        return res.status(400).json({
            success: false,
            message: "User ID and password are required.",
        });
    }
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update the user's password
        await updatePassword(userId, hashedPassword);
        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const changeEmail = async (req, res) => {
    const { userId, newEmail } = req.body;
    if (!userId || !newEmail) {
        return res
            .status(400)
            .json({ success: false, message: "User ID and new email are required" });
    }
    try {
        const existingUser = await findUserByEmail(newEmail);
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email is already in use" });
        }
        await removeExistingUnverifiedUser(newEmail);
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        console.log("Generated verification code:", verificationCode);
        await createUnverifiedUser(newEmail, "", verificationCode);
        console.log("Unverified email change request saved to database");
        await sendEmail(newEmail, verificationCode);
        console.log("Verification email sent to new email:", newEmail);
        return res
            .status(200)
            .cookie("newEmail", newEmail, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // Cookie expires in 15 minutes
            path: "/",
        })
            .json({
            success: true,
            message: "Verification code sent to new email. Please verify.",
        });
    }
    catch (e) {
        console.error("Error changing email:", e.message);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
export const verifyEmailChange = async (req, res) => {
    const { email, code } = req.body;
    const newEmail = req.cookies.newEmail;
    if (!email || !code || !newEmail) {
        return res.status(400).json({
            success: false,
            message: "Original email, new email, and verification code are required",
        });
    }
    try {
        const unverifiedEntry = await findUnverifiedUserByEmail(newEmail);
        if (!unverifiedEntry) {
            return res.status(400).json({
                success: false,
                message: "Verification entry not found",
            });
        }
        if (unverifiedEntry.verificationCode !== code ||
            !(unverifiedEntry.verificationExpires instanceof Date) ||
            new Date() > unverifiedEntry.verificationExpires) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await updateUserEmail(user._id.toString(), newEmail);
        // Remove the unverified user entry
        await deleteUnverifiedUserByEmail(newEmail);
        // Clear the cookie
        res.clearCookie("newEmail");
        return res.status(200).json({
            success: true,
            message: "Email updated successfully",
        });
    }
    catch (error) {
        console.error("Error verifying email change:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const uploadImage = async (req, res) => {
    try {
        const userId = req.body.userId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        // Upload the image to Cloudinary
        const imageUrl = await uploadOnCloudinary(file.path);
        // Update the user profile image URL in the database
        const updatedUser = await updateUserProfilePicture(userId, imageUrl);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Image uploaded and profile updated successfully",
            imageUrl,
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
