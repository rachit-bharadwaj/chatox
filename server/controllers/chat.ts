import { Request, Response } from "express";

// database
import Chat from "../database/models/Chat.schema";
import connectDB from "../database/connection/mongoose";

export const getMessages = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { userId, receiverId } = req.body;

    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
