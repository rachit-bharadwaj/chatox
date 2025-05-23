import mongoose from "mongoose";

export interface ChatDocument extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  messageType: "text" | "file" | "gif";
  message?: string;
  fileUrl?: string;
  timestamp?: Date;
}
