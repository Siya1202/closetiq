import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: message });
}
