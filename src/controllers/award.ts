import { Request, Response } from "express";
import { Award } from "../models/award.js";
import { User } from "../models/user.js";

export const createAward = async (req: Request, res: Response) => {
  const { userId, awardName, link, issuedBy, awardDate, description } =
    req.body;

  if (!userId || !awardName) {
    return res.status(400).json({
      success: false,
      message: "User ID and Award Name are required",
    });
  }

  try {
    // Create a new award
    const newAward = new Award({
      userId,
      awardName,
      link,
      issuedBy,
      awardDate,
      description,
    });

    // Save the award to the database
    const savedAward = await newAward.save();

    // save the reference in the User object
    await User.findByIdAndUpdate(
      userId,
      { $push: { awards: savedAward._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Award created successfully",
      data: newAward,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAward = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Award ID is required",
    });
  }

  try {
    const award = await Award.findByIdAndDelete(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    await User.findByIdAndUpdate(award.userId, {
      $pull: { awards: id },
    });

    return res.status(200).json({
      success: true,
      message: "Award deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAward = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find the award by ID
    const award = await Award.findById(id).populate("userId", "name email");

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: award,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
