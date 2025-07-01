import mongoose, { Schema } from "mongoose";

import { ChatDocument } from "interfaces";

const ChatSchema = new Schema<ChatDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    messageType: {
      type: String,
      enum: ["text", "file", "gif"],
      required: true,
    },
    message: {
      type: String,
      required: function (this: ChatDocument) {
        return this.messageType === "text" || this.messageType === "gif";
      },
    },
    fileUrl: {
      type: String,
      required: function (this: ChatDocument) {
        return this.messageType === "file";
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    sessionKeyId: {
      type: String,
      required: function (this: ChatDocument) {
        return this.encrypted === true;
      },
    },
    encryptedSessionKey: {
      type: String,
      required: function (this: ChatDocument) {
        return this.encrypted === true;
      },
    },
    iv: {
      type: String,
      required: function (this: ChatDocument) {
        return this.encrypted === true;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Chat ||
  mongoose.model<ChatDocument>("Chat", ChatSchema, "chats");
