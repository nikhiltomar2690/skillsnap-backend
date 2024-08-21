import { Request, Response } from "express";
import { Interest } from "../models/interest.js";

export const createInterest = async (req: Request, res: Response) => {
  const { userId, interests } = req.body;

  if (
    !userId ||
    !interests ||
    !Array.isArray(interests) ||
    interests.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "userId and an array of interests are required.",
    });
  }

  try {
    const newInterest = new Interest({
      userId,
      interests,
    });

    await newInterest.save();
    return res.status(201).json({
      success: true,
      message: "Interest created successfully",
      data: newInterest,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteInterest = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedInterest = await Interest.findByIdAndDelete(id);

    if (!deletedInterest) {
      return res.status(404).json({
        success: false,
        message: "Interest not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interest deleted successfully",
      data: deletedInterest,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterest = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const interest = await Interest.findById(id).populate(
      "userId",
      "name email"
    );

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Interest not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: interest,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
