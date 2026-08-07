import { Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware";
import * as authService from "../services/auth.service";

import { env } from "../config/env";

const signupSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const validateSignup = validate(signupSchema);
export const validateLogin = validate(loginSchema);

function setAuthCookie(res: Response, token: string) {
  const isProd = env.nodeEnv === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    // "none" is required for cross-site cookies (Vercel → Railway).
    // Browsers reject "none" without secure:true, so fall back to "lax" locally.
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function signupController(req: Request, res: Response) {
  const { email, password, name } = req.body as z.infer<typeof signupSchema>;
  const token = await authService.signup(email, password, name);
  setAuthCookie(res, token);
  res.status(201).json({ success: true });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const token = await authService.login(email, password);
  setAuthCookie(res, token);
  res.status(200).json({ success: true });
}

export async function logoutController(req: Request, res: Response) {
  const isProd = env.nodeEnv === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ success: true });
}

export async function meController(req: Request, res: Response) {
  // If this is reached, the authMiddleware passed
  res.status(200).json({ authenticated: true });
}
