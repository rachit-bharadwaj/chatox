// zustand
import { create } from "zustand";
import { createAuthSlice } from "./slices/authSlice";

// types
import { AppState } from "../types";

const useAppStore = create<AppState>((set) => ({
  ...createAuthSlice(set),
}));

export default useAppStore;
