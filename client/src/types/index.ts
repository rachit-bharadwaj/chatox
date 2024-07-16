import { createAuthSlice } from "../store/slices/authSlice";

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  userName?: string;
  emailOrUsername?: string;
  profilePicture?: string;
  bio?: string;
};

export type SetAuth = (data: { userData: User }) => void;

export type AuthSlice = ReturnType<typeof createAuthSlice>;

export type AppState = AuthSlice;

export type ChatPreview = {
  _id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar: string;
};
