import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  // Zod validation errors that escaped the validate() middleware
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({ error: "Validation failed", details });
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err instanceof Error
      ? err.message
      : "Internal server error";

  res.status(500).json({ error: message });
}
