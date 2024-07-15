import { Router } from "express";

// controllers
import { fetchAllUsers } from "../controllers/user";

const userRoutes = Router();

userRoutes.get("/fetchAll", fetchAllUsers);

export default userRoutes;
