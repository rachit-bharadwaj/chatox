import { Router } from "express";

// controllers
import { getContacts, search } from "../controllers/contact";

// middlewares
import { verifyToken } from "../middlewares/auth";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, search);
contactRoutes.get("/get-contacts", verifyToken, getContacts);

export default contactRoutes;
