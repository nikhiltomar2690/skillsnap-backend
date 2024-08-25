import express from "express";
import {
  loginUser,
  loginViaGoogle,
  verifyUser,
  registerUser,
} from "../controllers/user.js";

const app = express.Router();

app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/google-signin", loginViaGoogle);
app.post("/verify", verifyUser);
// app.put("/update", verifyUser);

export default app;
