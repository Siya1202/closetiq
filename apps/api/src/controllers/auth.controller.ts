import { Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware";
import * as authService from "../services/auth.service";

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

export async function signupController(req: Request, res: Response) {
  const { email, password, name } = req.body as z.infer<typeof signupSchema>;
  const token = await authService.signup(email, password, name);
  res.status(201).json({ token });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const token = await authService.login(email, password);
  res.status(200).json({ token });
}
