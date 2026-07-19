import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function signupController(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const token = await authService.signup(email, password, name);
  res.status(201).json({ token });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  res.status(200).json({ token });
}
