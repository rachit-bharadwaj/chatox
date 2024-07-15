import { Router } from "express";

import { verifyToken } from "../middlewares/auth";

// controllers
import { getUserInfo, login, register } from "../controllers/auth";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.get("/getUserInfo", verifyToken, getUserInfo);

export default authRoutes;
