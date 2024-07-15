import { createAuthSlice } from "../store/slices/authSlice";

export type User = {
  name?: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  userName?: string;
  emailOrUsername?: string;
};

export type SetAuth = (data: { userData: User }) => void;

export type AuthSlice = ReturnType<typeof createAuthSlice>;

export type AppState = AuthSlice;
