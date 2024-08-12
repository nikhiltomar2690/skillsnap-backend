import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/connectDB.js";

config({
  path: "./.env",
});

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || " ";

connectDB(MONGO_URI);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
