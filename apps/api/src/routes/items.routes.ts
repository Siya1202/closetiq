import { Router } from "express";
import {
  createItemController,
  listItemsController,
  getItemController,
  validateCreateItem,
  autoTagItemController,
  validateAutoTag,
  deleteItemController,
} from "../controllers/items.controller";

const router = Router();

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new wardrobe item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *               - category
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *               color:
 *                 type: string
 *               pattern:
 *                 type: string
 *               season:
 *                 type: string
 *               formality:
 *                 type: string
 *               brand:
 *                 type: string
 *               price:
 *                 type: number
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", validateCreateItem, createItemController);

/**
 * @swagger
 * /api/items/auto-tag:
 *   post:
 *     summary: Auto-tag an item from its photo
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Tags returned successfully
 *       502:
 *         description: Failed to analyze image
 */
router.post("/auto-tag", validateAutoTag, autoTagItemController);

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: List all wardrobe items for the user
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items
 *       401:
 *         description: Unauthorized
 */
router.get("/", listItemsController);

/**
 * @swagger
 * /api/items/{itemId}:
 *   get:
 *     summary: Get a specific wardrobe item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.get("/:itemId", getItemController);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.delete("/:id", deleteItemController);

export default router;
