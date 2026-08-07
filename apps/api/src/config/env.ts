import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  openRouterApiKey: required("OPENROUTER_API_KEY"),
  // Optional — if set, CORS is locked to this origin; otherwise open (*) for local dev
  frontendUrl: process.env.FRONTEND_URL,
};
