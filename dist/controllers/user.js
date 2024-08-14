import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
const MONGO_URI = process.env.MONGO_URI || " ";
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res
            .status(400)
            .json({ success: false, message: "User already exists" });
    }
    //   password can also be hashed at the client side before sending it to the server
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);
    const newUser = new User({
        email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        return res.json({ success: true, message: "User created successfully" });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};
