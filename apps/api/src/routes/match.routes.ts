import { Router } from "express";
import { matchController, validateMatch } from "../controllers/match.controller";

const router = Router();

/**
 * @swagger
 * /api/match:
 *   post:
 *     summary: Find similar items (reverse outfit matching)
 *     tags: [Match]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Text description of the style
 *               limit:
 *                 type: number
 *                 description: Maximum number of matches to return (max 20)
 *     responses:
 *       200:
 *         description: List of matched items
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", validateMatch, matchController);

export default router;