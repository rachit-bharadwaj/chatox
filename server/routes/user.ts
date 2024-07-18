import { Router } from "express";

// controllers
import {
  fetchAllUsers,
  fetchByUserName,
  editProfile,
} from "../controllers/user";

const userRoutes = Router();

userRoutes.get("/fetchAll", fetchAllUsers);
userRoutes.post("/fetchByUserName", fetchByUserName);
userRoutes.post("/editProfile", editProfile);

export default userRoutes;
