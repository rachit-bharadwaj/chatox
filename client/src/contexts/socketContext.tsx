/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { HOST } from "../constants";
import { notificationManager } from "../utils/notifications";
import useAppStore from "../store";

interface SocketContextType {
  current: Socket | null;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { userData, selectedChatData, addMessage } = useAppStore();

  useEffect(() => {
    if (userData && userData._id) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userData._id },
      });

      const handleReceiveMessage = (message: any) => {
        if (!message || !message.sender || !message.receiver) {
          console.error("Message structure is incorrect:", message);
          return;
        }

        // Check if this message is for the current user
        if (message.receiver._id === userData._id) {
          // Add message to store
          addMessage(message);

          // Show notification if message is not from currently selected chat
          if (
            !selectedChatData ||
            selectedChatData._id !== message.sender._id
          ) {
            // Get sender name for notification
            const senderName = message.sender.name || message.sender.userName || 'Someone';
            const messageText = message.messageType === 'text' ? message.message : 'Sent you a GIF';
            
            // Trigger notification
            notificationManager.notifyNewMessage(
              senderName,
              messageText,
              message.sender._id
            );
          }
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

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
