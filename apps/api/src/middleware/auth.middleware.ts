import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthedRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization; // "Bearer eyJhbGc..."
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
