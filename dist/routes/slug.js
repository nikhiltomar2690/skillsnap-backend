import express from "express";
import { getUserProfileBySlug } from "../controllers/slug.js";
const app = express.Router();
app.get("/:slug", getUserProfileBySlug);
export default app;
