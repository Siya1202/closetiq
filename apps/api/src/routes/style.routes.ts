import { Router } from "express";
import { styleDriftController } from "../controllers/style.controller";

const router = Router();

/**
 * @swagger
 * /api/style/drift:
 *   get:
 *     summary: Get style drift timeline for the user
 *     tags: [Style]
 *     responses:
 *       200:
 *         description: Style drift timeline
 *       401:
 *         description: Unauthorized
 */
router.get("/drift", styleDriftController);

export default router;