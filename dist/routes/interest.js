import express from "express";
import { createInterest, deleteInterest, getInterest, } from "../controllers/interest.js";
const app = express.Router();
app.post("/create", createInterest);
app.get("/get/:id", getInterest);
app.delete("/delete/:id", deleteInterest);
export default app;
