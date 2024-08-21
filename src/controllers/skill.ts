import { Request, Response } from "express";
import { Skills } from "../models/skill.js";

// Create Skills
export const createSkills = async (req: Request, res: Response) => {
  const { userId, skills } = req.body;

  // Validate input
  if (!userId || !skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      success: false,
      message: "userId and an array of skills are required.",
    });
  }

  try {
    const newSkills = new Skills({
      userId,
      skills,
    });

    await newSkills.save();
    return res.status(201).json({
      success: true,
      message: "Skills added successfully",
      data: newSkills,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSkills = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSkills = await Skills.findByIdAndDelete(id);

    if (!deletedSkills) {
      return res.status(404).json({
        success: false,
        message: "Skills entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skills entry deleted successfully",
      data: deletedSkills,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSkills = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const skills = await Skills.findById(id).populate("userId", "name email");

    if (!skills) {
      return res.status(404).json({
        success: false,
        message: "Skills entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
