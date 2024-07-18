import { createAuthSlice } from "../store/slices/authSlice";
import { createChatSlice } from "../store/slices/chatSlice";

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  userName?: string;
  emailOrUsername?: string;
  profilePicture?: string;
  bio?: string;
};

export type SetAuth = (partial: Partial<{ userData: User }>) => void;

export type AuthSlice = ReturnType<typeof createAuthSlice>;

export type SetChat = (
  partial: Partial<AppState> | ((state: AppState) => Partial<AppState>),
  replace?: boolean
) => void;

export type ChatSlice = ReturnType<typeof createChatSlice>;

export type AppState = AuthSlice & ChatSlice;

export type Contact = {
  email: string;
  lastMessageTime: string;
  lastMessage: string;
  name: string;
  profilePicture: string;
  userName: string;
  _id: string;
};

export type Message = {
  _id: string;
  sender: User;
  receiver: User;
  messageType: string;
  message?: string;
  fileUrl?: string;
  timestamp: string;
};
