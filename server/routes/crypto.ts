import { Router } from "express";
import { storePublicKey, getPublicKey, getMultiplePublicKeys } from "../controllers/crypto";
import { verifyToken } from "../middlewares/auth";

const cryptoRoutes = Router();

cryptoRoutes.post("/public-key", verifyToken, storePublicKey);
cryptoRoutes.get("/public-key/:userId", verifyToken, getPublicKey);
cryptoRoutes.post("/public-keys", verifyToken, getMultiplePublicKeys);

export default cryptoRoutes;