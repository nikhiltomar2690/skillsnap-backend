import express from "express";
import {
  createCertificate,
  deleteCertificate,
  getCertificate,
} from "../controllers/certificate.js";

const app = express.Router();

app.post("/create", createCertificate);
app.get("/get/:id", getCertificate);
app.delete("/delete/:id", deleteCertificate);

export default app;
