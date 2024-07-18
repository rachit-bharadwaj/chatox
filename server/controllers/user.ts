import type { Request, Response } from "express";
import User from "../database/models/User.schema";
import dotenv from "dotenv";
import connectDB from "../database/connection/mongoose";
import { uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs";

dotenv.config();

export const fetchAllUsers = async (req: Request, res: Response) => {
  await connectDB();

  try {
    const users = await User.find({});

    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchByUserName = async (req: Request, res: Response) => {
  await connectDB();

  try {
    const { userName } = req.body;

    const user = await User.findOne({ userName });

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  await connectDB();

  try {
    const { _id, name, userName, bio } = req.body;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      const localFilePath = req.file.path;
      const uploadResult = await uploadToCloudinary(localFilePath);
      if (uploadResult) {
        user.profilePicture = uploadResult.url;
      }
    }

    user.name = name;
    user.userName = userName;
    user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
