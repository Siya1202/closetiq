import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json()); // parses JSON body into req.body

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

// error middleware always goes last
app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
