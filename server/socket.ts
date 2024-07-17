import { Server as SocketServer } from "socket.io";

const setupSocket = (server: any) => {
  const io = new SocketServer(server, {
    cors: {
      origin: [process.env.CLIENT_URL!],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    console.log('New connection attempt:', socket.id, 'with userId:', userId);

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id: ${socket.id}`);
    } else {
      console.warn('Connection without userId:', socket.id);
    }

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
