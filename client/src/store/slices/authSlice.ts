import { SetAuth, User } from "../../types";

export const createAuthSlice = (set: SetAuth) => ({
  userData: <User>{},
  setUserData: (data: User) => set({ userData: data }),
});
