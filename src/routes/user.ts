import express from "express";
import {
  loginUser,
  loginViaGoogle,
  verifyUser,
  registerUser,
  updateSlug,
  updateUserPassword,
  changeEmail,
  verifyEmailChange,
} from "../controllers/user.js";

const app = express.Router();

app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/google-signin", loginViaGoogle);
app.post("/verify", verifyUser);
app.post("/updateslug", updateSlug);
app.post("/updatepassword", updateUserPassword);
app.post("/changeemail", changeEmail);
app.post("/verifynewemail", verifyEmailChange);
// app.put("/update", verifyUser);

export default app;
