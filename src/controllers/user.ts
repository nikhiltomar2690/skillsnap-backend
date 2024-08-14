import { NextFunction, Request, Response } from "express";
import { connectDB } from "../utils/connectDB.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  //   password will also be hashed at the client side before sending it to the server
  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return res.json({ success: true, message: "User created successfully" });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Send user data (you might want to include additional info here)
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
      await user.save();
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
