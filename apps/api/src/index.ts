import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { env } from "./config/env";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import itemsRoutes from "./routes/items.routes";
import wearLogsRoutes from "./routes/wearlogs.routes";
import analyticsRoutes from "./routes/analytics.routes";
import matchRoutes from "./routes/match.routes";
import styleRoutes from "./routes/style.routes";
import uploadRoutes from "./routes/upload.routes";
import { scheduleCostPerWearRecompute } from "./jobs/recomputeCostPerWear.cron";
import { scheduleStyleDriftRecompute } from "./jobs/recomputeStyleDrift.cron";

const app = express();

// Lock CORS to the deployed frontend URL in production.
// Falls back to open (*) in local dev when FRONTEND_URL is not set.
app.use(
  cors({
    origin: env.frontendUrl ?? "*",
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use("/api/auth", authRoutes);

// @ts-expect-error: types for swagger-ui-express and express are out of sync
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/items", authMiddleware, itemsRoutes);
app.use("/api/items/:itemId/wearlogs", authMiddleware, wearLogsRoutes);
app.use("/api/analytics", authMiddleware, analyticsRoutes);
app.use("/api/match", authMiddleware, matchRoutes);
app.use("/api/style", authMiddleware, styleRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorMiddleware);

scheduleCostPerWearRecompute();
scheduleStyleDriftRecompute();

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port} [${env.nodeEnv}]`);
});