import { Router } from "express";

// controllers
import { search } from "../controllers/contact";

// middlewares
import { verifyToken } from "../middlewares/auth";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, search);

export default contactRoutes;
