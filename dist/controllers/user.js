import { User } from "../models/user.js";
import { unverifiedUser } from "../models/unverifiedUser.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { parse } from "cookie";
import sendEmail from "../utils/sendMail.js";
// Nodemailer for sending mails
// export const registerUser = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   console.log("Received registration request with email:", email);
//   // Validate email and password
//   if (!email) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Email is required" });
//   }
//   if (!password) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Password is required" });
//   }
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   const sendVerificationEmail = async (
//     email: string,
//     verificationCode: string
//   ) => {
//     console.log("Sending verification email to:", email);
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Verify your SkillSnap Account",
//       text: `Your verification code is: ${verificationCode}`,
//     };
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log("Email sent:", info.response);
//     } catch (error) {
//       console.error("Error sending email:", error);
//       throw new Error("Email could not be sent");
//     }
//   };
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email is already registered" });
//     }
//     console.log("No existing user found, proceeding with registration");
//     const existingUnverifiedUser = await unverifiedUser.findOne({ email });
//     if (existingUnverifiedUser) {
//       console.log("Found existing unverified user, deleting it");
//       await unverifiedUser.deleteOne({ email });
//     }
//     // Generate a verification code and hash the password
//     const verificationCode = crypto.randomInt(100000, 999999).toString();
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("Generated verification code:", verificationCode);
//     // Create a new unverified user entry
//     const newUnverifiedUser = new unverifiedUser({
//       email,
//       password: hashedPassword,
//       verificationCode,
//       verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
//     });
//     await newUnverifiedUser.save();
//     console.log("Unverified user saved to database");
//     // Send verification email
//     await sendVerificationEmail(email, verificationCode);
//     console.log("Verification email sent, setting cookie");
//     // Set a cookie with the unverified email
//     return res
//       .status(200)
//       .cookie("unverifiedEmail", email, {
//         httpOnly: true,
//         maxAge: 15 * 60 * 1000, // cookie expires in 15 minutes
//         path: "/",
//       })
//       .json({
//         success: true,
//         message:
//           "User created successfully, please check your email for verification",
//       });
//   } catch (e: any) {
//     console.error("Error registering user:", e.message);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// };
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email is already registered" });
        }
        console.log("No existing user found, proceeding with registration");
        const existingUnverifiedUser = await unverifiedUser.findOne({ email });
        if (existingUnverifiedUser) {
            console.log("Found existing unverified user, deleting it");
            await unverifiedUser.deleteOne({ email });
        }
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Generated verification code:", verificationCode);
        const newUnverifiedUser = new unverifiedUser({
            email,
            password: hashedPassword,
            verificationCode,
            verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        });
        await newUnverifiedUser.save();
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
        const UnverifiedUser = await unverifiedUser.findOne({ email });
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
        const newUser = new User({
            email: UnverifiedUser.email,
            password: UnverifiedUser.password,
            provider: UnverifiedUser.provider,
            isVerified: true,
        });
        // Save the new user to the User collection
        await newUser.save();
        // Remove the entry from the UnverifiedUser collection
        await UnverifiedUser.deleteOne({ email });
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
        const user = await User.findOne({ email });
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
            const newUser = new User({
                email,
                isVerified: true,
                provider: "google",
            });
            await newUser.save();
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
        const existingUser = await User.findOne({ slug });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { slug }, { new: true });
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
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update the user's password
        user.password = hashedPassword;
        await user.save();
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
