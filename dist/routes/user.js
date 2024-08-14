import express from "express";
import { loginUser, registerUser, verifyUser } from "../controllers/user.js";
const app = express.Router();
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/verify", verifyUser);
export default app;
