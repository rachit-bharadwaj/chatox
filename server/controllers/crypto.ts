import type { Request, Response } from "express";
import User from "../database/models/User.schema";
import connectDB from "../database/connection/mongoose";

export const storePublicKey = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { userId, publicKey } = req.body;

    if (!userId || !publicKey) {
      return res.status(400).json({ message: "User ID and public key are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.publicKey = publicKey;
    user.keyGeneratedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Public key stored successfully" });
  } catch (error: any) {
    console.error("Error storing public key:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPublicKey = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select('publicKey keyGeneratedAt');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.publicKey) {
      return res.status(404).json({ message: "Public key not found for user" });
    }

    return res.status(200).json({ 
      publicKey: user.publicKey,
      keyGeneratedAt: user.keyGeneratedAt
    });
  } catch (error: any) {
    console.error("Error retrieving public key:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMultiplePublicKeys = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "User IDs array is required" });
    }

    const users = await User.find({ 
      _id: { $in: userIds } 
    }).select('_id publicKey keyGeneratedAt');

    const publicKeys = users.reduce((acc, user) => {
      if (user.publicKey) {
        acc[user._id.toString()] = {
          publicKey: user.publicKey,
          keyGeneratedAt: user.keyGeneratedAt
        };
      }
      return acc;
    }, {} as Record<string, { publicKey: string; keyGeneratedAt: Date }>);

    return res.status(200).json({ publicKeys });
  } catch (error: any) {
    console.error("Error retrieving public keys:", error);
    return res.status(500).json({ message: error.message });
  }
};