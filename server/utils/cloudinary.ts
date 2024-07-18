import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dnrct2gvm",
  api_key: "191841338847426",
  api_secret: "5_w3hXxF1NJT9KJuskSxPSk1f9c",
});

export const uploadToCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (uploadResult && uploadResult.public_id) {
      fs.unlinkSync(localFilePath); // Remove the local file after upload if successful
    } else {
      throw new Error("Failed to upload file to Cloudinary.");
    }

    return uploadResult;
  } catch (error) {
    console.error("Error uploading file:", error);
    fs.unlinkSync(localFilePath); // Ensure local file is removed even if there's an error during upload
    return null;
  }
};
