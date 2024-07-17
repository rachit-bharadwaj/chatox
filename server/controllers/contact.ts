import type { NextFunction, Request, Response } from "express";

// database
import User from "../database/models/User.schema";
import connectDB from "../database/connection/mongoose";

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
