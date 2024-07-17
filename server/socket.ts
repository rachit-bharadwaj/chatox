import Chat from "./database/models/Chat.schema";
import { Server as SocketServer } from "socket.io";

const setupSocket = (server: any) => {
  const io = new SocketServer(server, {
    cors: {
      origin: [process.env.CLIENT_URL!],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const sendMessage = async (chat: any) => {
    const senderSocketId = userSocketMap.get(chat.sender);
    const receiverSocketId = userSocketMap.get(chat.receiver);

    const createChat = await Chat.create(chat);

    const chatData = await Chat.findById(createChat._id)
      .populate("sender", "name userName email profilePicture bio")
      .populate("receiver", "name userName email profilePicture bio");

    if (receiverSocketId)
      io.to(receiverSocketId).emit("receiveMessage", chatData);

    if (senderSocketId) io.to(senderSocketId).emit("receiveMessage", chatData);
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    console.log("New connection attempt:", socket.id, "with userId:", userId);

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id: ${socket.id}`);
    } else {
      console.warn("Connection without userId:", socket.id);
    }

    socket.on("sendMessage", async (message) => {
      if (!message.receiver) {
        console.error("Message does not have receiver:", message);
        return;
      }

      await sendMessage(message);
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      console.log(`User disconnected: ${userId} with socket id: ${socket.id}`);
    });
  });

  io.on("error", (err) => {
    console.error("Socket error:", err);
  });
};

export default setupSocket;
