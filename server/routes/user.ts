import { Router } from "express";

// controllers
import {
  fetchAllUsers,
  fetchByUserName,
  editProfile,
  checkUsernameAvailability,
  checkEmailAvailability,
} from "../controllers/user";

// middlewares
import { multerMiddleware } from "../middlewares/multer";

const userRoutes = Router();

userRoutes.get("/fetchAll", fetchAllUsers);
userRoutes.post("/fetchByUserName", fetchByUserName);
userRoutes.post("/editProfile", multerMiddleware, editProfile);
userRoutes.post("/checkUsername", checkUsernameAvailability);
userRoutes.post("/checkEmail", checkEmailAvailability);

export default userRoutes;
