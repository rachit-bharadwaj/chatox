import type { NextFunction, Request, Response } from "express";

// database
import User from "../database/models/User.schema";
import Chat from "../database/models/Chat.schema";
import connectDB from "../database/connection/mongoose";
import mongoose from "mongoose";

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await connectDB();

    const { searchTerm, userId } = req.body;

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ name: regex }, { userName: regex }, { email: regex }] },
      ],
    });
    res.status(200).json({ contacts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    await connectDB();

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts: any = await Chat.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
          lastMessage: { $first: "$message" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          name: "$contactInfo.name",
          userName: "$contactInfo.userName",
          email: "$contactInfo.email",
          profilePicture: "$contactInfo.profilePicture",
          lastMessageTime: 1,
          lastMessage: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]).exec();



    return res.status(200).json({ contacts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
