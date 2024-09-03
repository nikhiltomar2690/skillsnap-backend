import { Request, Response } from "express";
import { Education } from "../models/education.js";
import { User } from "../models/user.js";
import {
  createNewEducation,
  updateUserWithEducation,
  getEducationById,
  deleteEducationById,
  removeEducationFromUser,
} from "../queries/educationQueries.js";

// Create Education Entry
export const createEducation = async (req: Request, res: Response) => {
  const {
    userId,
    degreeName,
    link,
    school,
    city,
    country,
    startDate,
    endDate,
    isCurrent,
    description,
  } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  if (!degreeName) {
    return res.status(400).json({
      success: false,
      message: "Degree name is required",
    });
  }

  try {
    const newEducation = await createNewEducation(userId, {
      degreeName,
      link,
      school,
      city,
      country,
      startDate,
      endDate,
      isCurrent,
      description,
    });

    await updateUserWithEducation(userId, newEducation._id.toString());

    return res.status(201).json({
      success: true,
      data: newEducation,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Education Entry
export const deleteEducation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Education ID is required",
    });
  }

  try {
    // Find the education entry
    const education = await deleteEducationById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found",
      });
    }

    // Remove the education reference from the User document
    await removeEducationFromUser(education.userId.toString(), id);

    return res.status(200).json({
      success: true,
      message: "Education entry deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Education Entry by ID
export const getEducation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Education ID is required",
    });
  }

  try {
    const education = await getEducationById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
