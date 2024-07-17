import { Router } from "express";

// controllers
import { getMessages } from "../controllers/chat";

// middlewares
import { verifyToken } from "../middlewares/auth";

const chatRoutes = Router();

chatRoutes.post("/messages", verifyToken, getMessages);

export default chatRoutes;
