import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
