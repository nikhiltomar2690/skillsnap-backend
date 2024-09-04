import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/connectDB.js";
import userRoutes from "./routes/user.js";
import experienceRoutes from "./routes/experience.js";
import educationRoutes from "./routes/education.js";
import awardRoutes from "./routes/award.js";
import certificateRoutes from "./routes/certificate.js";
import courseRoutes from "./routes/course.js";
import interestRoutes from "./routes/interest.js";
import languageRoutes from "./routes/language.js";
import skillRoutes from "./routes/skill.js";
import cookieParser from "cookie-parser";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import slugRoutes from "./routes/slug.js";
config({
    path: "./.env",
});
const app = express();
app.use(express.json());
app.use(cookieParser());
// Use Morgan middleware for logging HTTP requests
app.use(morganMiddleware);
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || " ";
connectDB(MONGO_URI);
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use("/user", userRoutes);
app.use("/experience", experienceRoutes);
app.use("/education", educationRoutes);
app.use("/award", awardRoutes);
app.use("/certificate", certificateRoutes);
app.use("/course", courseRoutes);
app.use("/interest", interestRoutes);
app.use("/language", languageRoutes);
app.use("/skill", skillRoutes);
app.use("/", slugRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
export default app;
