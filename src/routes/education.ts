import express from "express";
import {
  createEducation,
  deleteEducation,
  getEducation,
} from "../controllers/education.js";

const app = express.Router();

app.post("/create", createEducation);
app.get("/get/:id", getEducation);
app.delete("/delete/:id", deleteEducation);

export default app;
