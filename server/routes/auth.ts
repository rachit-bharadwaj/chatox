import { Router } from "express";

// controllers
import { login, register } from "../controllers/auth.ts";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);

export default authRoutes;
