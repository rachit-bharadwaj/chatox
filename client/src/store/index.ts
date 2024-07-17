// zustand
import { create } from "zustand";
import { createAuthSlice } from "./slices/authSlice";
import { createChatSlice } from "./slices/chatSlice";

// types
import { AppState } from "../types";

const useAppStore = create<AppState>((set, get) => ({
  ...createAuthSlice(set),
  ...createChatSlice(set, get),
}));

export default useAppStore;
