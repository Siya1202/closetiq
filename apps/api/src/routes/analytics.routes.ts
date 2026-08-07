import { Router } from "express";
import { getCostPerWearController } from "../controllers/analytics.controller";

const router = Router();

/**
 * @swagger
 * /api/analytics/cost-per-wear:
 *   get:
 *     summary: Get cost-per-wear report for all items
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Cost-per-wear report
 *       401:
 *         description: Unauthorized
 */
router.get("/cost-per-wear", getCostPerWearController);

export default router;
