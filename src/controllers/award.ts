import { Request, Response } from "express";
import { Award } from "../models/award.js";
import { User } from "../models/user.js";
import {
  createNewAward,
  updateUserWithAward,
  deleteAwardById,
  removeAwardFromUser,
  getAwardById,
} from "../queries/awardQueries.js";

export const createAward = async (req: Request, res: Response) => {
  const { userId, awardName, link, issuedBy, awardDate, description } =
    req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  if (!awardName) {
    return res.status(400).json({
      success: false,
      message: "Award name is required",
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
    const savedAward = await createNewAward(userId, {
      awardName,
      link,
      issuedBy,
      awardDate,
      description,
    });

    // save the reference in the User object
    await updateUserWithAward(userId, savedAward._id.toString());

    return res.status(201).json({
      success: true,
      message: "Award created successfully",
      data: savedAward,
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
    const award = await deleteAwardById(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    await removeAwardFromUser(award.userId.toString(), id);

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

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Award ID is required",
    });
  }

  try {
    // Find the award by ID
    const award = await getAwardById(id);

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
