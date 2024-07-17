/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useAppStore from "../store";
import { HOST } from "../constants";

interface SocketContextType {
  current: Socket | null;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { userData, selectedChatData, addMessage } = useAppStore();

  useEffect(() => {
    console.log("User data before connecting socket:", userData);

    if (userData._id) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userData._id },
      });

      const handleReceiveMessage = (message: any) => {
        console.log("Received message:", message);
        if (!message || !message.sender || !message.receiver) {
          console.error("Message structure is incorrect:", message);
          return;
        }

        if (
          selectedChatData &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.receiver._id)
        ) {
          addMessage(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current?.id);
      });

      socket.current.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      socket.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userData, addMessage, selectedChatData]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
