import express from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import {
  loginUser,
  loginViaGoogle,
  verifyUser,
  registerUser,
  updateSlug,
  updateUserPassword,
  changeEmail,
  verifyEmailChange,
  uploadImage,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "../controllers/user.js";

const app = express.Router();

app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/google-signin", loginViaGoogle);
app.post("/verify", verifyUser);
app.post("/passwordreset", requestPasswordReset);
app.post("/verifyResetCode", verifyResetCode);
app.post("/resetPassword", resetPassword);
app.post("/updateslug", updateSlug);
app.post("/updatepassword", updateUserPassword);
app.post("/changeemail", changeEmail);
app.post("/verifynewemail", verifyEmailChange);
app.post("/imageupload", upload.single("image"), uploadImage);

export default app;
