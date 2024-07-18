import { Router } from "express";
import {
  fetchAllUsers,
  fetchByUserName,
  editProfile,
} from "../controllers/user";
import { multerMiddleware } from "../middlewares/multer";

const userRoutes = Router();

userRoutes.get("/fetchAll", fetchAllUsers);
userRoutes.post("/fetchByUserName", fetchByUserName);
userRoutes.post("/editProfile", multerMiddleware, editProfile);

export default userRoutes;
