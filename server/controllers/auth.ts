import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../database/models/User.schema";
import dotenv from "dotenv";
import connectDB from "../database/connection/mongoose";

dotenv.config();

const secretKey = process.env.JWT_KEY!;

export const register = async (req: Request, res: Response) => {
  await connectDB();

  const { name, userName, email, password } = req.body;

  // check if user with same email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // hash password with salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create new user
  const newUser = new User({
    name,
    userName,
    email,
    password: hashedPassword,
  });

  // save user
  await newUser.save();
  res.status(201).json({ message: "User created successfully" });
};

export const login = async (req: Request, res: Response) => {
  await connectDB();

  const { emailOrUsername, password } = req.body;

  // check if user exists
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // generate JWT token
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "7d" });

  res.cookie("token", token, {
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ user });
};

export const getUserInfo = async (req: Request, res: Response) => {
  await connectDB();

  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};
