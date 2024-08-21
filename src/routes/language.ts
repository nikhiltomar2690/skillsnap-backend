import express from "express";
import {
  createLanguage,
  deleteLanguage,
  getLanguage,
} from "../controllers/language.js";

const app = express.Router();

app.post("/create", createLanguage);
app.get("/get/:id", getLanguage);
app.delete("/delete/:id", deleteLanguage);

export default app;
