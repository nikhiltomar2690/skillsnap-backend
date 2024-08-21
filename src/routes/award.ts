import express from "express";
import { createAward, deleteAward, getAward } from "../controllers/award.js";

const app = express.Router();

app.post("/create", createAward);
app.get("/get/:id", getAward);
app.delete("/delete/:id", deleteAward);

export default app;
