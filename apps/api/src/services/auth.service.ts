import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@closetiq/db";
import { env } from "../config/env";

export async function signup(email: string, password: string, name?: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });
  return issueToken(user.id);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  return issueToken(user.id);
}

function issueToken(userId: string) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
}
