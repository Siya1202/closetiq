import { Router, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/auth.middleware";
import { env } from "../config/env";

const router = Router();

/**
 * @swagger
 * /api/upload/sign:
 *   post:
 *     summary: Generate a Cloudinary signed upload signature
 *     tags: [Upload]
 *     responses:
 *       200:
 *         description: Signed payload
 *       401:
 *         description: Unauthorized
 */
router.post("/sign", authMiddleware, (_req: Request, res: Response) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    env.cloudinaryApiSecret
  );

  res.json({
    signature,
    timestamp,
    apiKey: env.cloudinaryApiKey,
    cloudName: env.cloudinaryCloudName,
  });
});

export default router;
