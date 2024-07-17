import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    jwt.verify(token, process.env.JWT_KEY!, async (err: any, decoded: any) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });

      req.body.userId = decoded.userId;

      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
