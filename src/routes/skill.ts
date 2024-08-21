import express from "express";
import { createSkills, deleteSkills, getSkills } from "../controllers/skill.js";

const app = express.Router();

app.post("/create", createSkills);
app.get("/get/:id", getSkills);
app.delete("/delete/:id", deleteSkills);

export default app;
