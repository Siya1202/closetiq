import { Router } from "express";
import {
  createWearLogController,
  listWearLogsController,
  validateCreateWearLog,
} from "../controllers/wearlogs.controller";

const router = Router({ mergeParams: true }); // lets this router see :itemId from the parent mount

/**
 * @swagger
 * /api/items/{itemId}/wearlogs:
 *   post:
 *     summary: Log a wear event for an item
 *     tags: [WearLogs]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               occasion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wear log created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.post("/", validateCreateWearLog, createWearLogController);

/**
 * @swagger
 * /api/items/{itemId}/wearlogs:
 *   get:
 *     summary: List all wear logs for an item
 *     tags: [WearLogs]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of wear logs
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.get("/", listWearLogsController);

export default router;
