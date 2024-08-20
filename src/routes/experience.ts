import express from "express";
import {
  createExperience,
  deleteExperience,
  getExperience,
} from "../controllers/experience.js";

const app = express.Router();

app.post("/create", createExperience);

app.get("/get/:id", getExperience);

app.delete("/delete/:id", deleteExperience);

export default app;
