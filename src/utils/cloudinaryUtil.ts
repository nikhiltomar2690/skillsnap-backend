import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a file to Cloudinary and deletes the local file after successful upload.
export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return result.secure_url;
  } catch (error: any) {
    // Remove the file even if the upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Error uploading to Cloudinary:", error.message);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
