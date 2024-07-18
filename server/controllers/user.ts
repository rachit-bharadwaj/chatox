import type { Request, Response } from "express";
import User from "../database/models/User.schema";
import dotenv from "dotenv";
import connectDB from "../database/connection/mongoose";

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
    const { _id, name, userName, profilePicture, bio } = req.body;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.userName = userName;
    user.profilePicture = profilePicture;
    user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
