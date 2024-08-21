import { Request, Response } from "express";
import { Certificate } from "../models/certificate.js";

// Create Certificate
export const createCertificate = async (req: Request, res: Response) => {
  const {
    userId,
    certificateName,
    link,
    startDate,
    endDate,
    isLifetime,
    description,
  } = req.body;

  if (!userId || !certificateName) {
    return res.status(400).json({
      success: false,
      message: "userId and certificateName are required.",
    });
  }

  try {
    const newCertificate = new Certificate({
      userId,
      certificateName,
      link,
      startDate,
      endDate,
      isLifetime,
      description,
    });

    await newCertificate.save();
    return res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: newCertificate,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Certificate
export const deleteCertificate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCertificate = await Certificate.findByIdAndDelete(id);

    if (!deletedCertificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: deletedCertificate,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Certificate by ID
export const getCertificate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
