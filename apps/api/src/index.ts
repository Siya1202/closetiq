import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
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
app.use(cookieParser());


app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use("/api/auth", authRoutes);

const swaggerHandler = swaggerUi.setup(swaggerSpec);

app.use("/api-docs", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (env.nodeEnv !== "production") {
    return next();
  }
  
  if (!env.apiDocsUser || !env.apiDocsPassword) {
    return res.status(404).send("API docs not available");
  }

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [user, password] = Buffer.from(b64auth, "base64").toString().split(":");

  if (user === env.apiDocsUser && password === env.apiDocsPassword) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
}, ...(swaggerUi.serve as any[]), swaggerHandler as any);

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