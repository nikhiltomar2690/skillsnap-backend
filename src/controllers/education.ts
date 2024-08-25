import { Request, Response } from "express";
import { Education } from "../models/education.js";
import { User } from "../models/user.js";
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

  if (!userId || !degreeName) {
    return res.status(400).json({
      success: false,
      message: "userId and degreeName are required",
    });
  }

  try {
    const newEducation = new Education({
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
    });

    const savedEducation = await newEducation.save();

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { education: savedEducation._id },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      data: savedEducation,
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
    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found",
      });
    }

    // Remove the education reference from the User document
    await User.findByIdAndUpdate(
      education.userId,
      {
        $pull: { education: id }, // Assuming `education` is an array of education ObjectIds in the User schema
      },
      { new: true } // Return the updated document
    );

    // Delete the education entry
    await Education.findByIdAndDelete(id);

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
    const education = await Education.findById(id).populate(
      "userId",
      "email name"
    );

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
