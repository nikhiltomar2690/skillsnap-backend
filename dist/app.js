import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/connectDB.js";
import userRoutes from "./routes/user.js";
import experienceRoutes from "./routes/experience.js";
import educationRoutes from "./routes/education.js";
config({
    path: "./.env",
});
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || " ";
connectDB(MONGO_URI);
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use("/user", userRoutes);
app.use("/experience", experienceRoutes);
app.use("/education", educationRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
export default app;
