import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
} from "../controllers/course.js";

const app = express.Router();

app.post("/create", createCourse);
app.get("/get/:id", getCourse);
app.delete("/delete/:id", deleteCourse);

export default app;
