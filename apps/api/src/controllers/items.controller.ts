import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import * as itemsService from "../services/items.service";
import * as visionService from "../services/vision.service";
import { generateEmbedding, buildItemEmbeddingText, saveItemEmbedding } from "../services/embedding.service";
import { prisma } from "@closetiq/db";

const createItemSchema = z.object({
  photoUrl: z.string().min(1, { message: "photoUrl is required" }),
  category: z.string().min(1, { message: "category is required" }),
  color: z.string().optional(),
  pattern: z.string().optional(),
  season: z.string().optional(),
  formality: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive().optional(),
  purchaseDate: z.string().datetime({ offset: true }).optional(),
  source: z.string().optional(),
});

export const validateCreateItem = validate(createItemSchema);

const autoTagSchema = z.object({
  // Not .url() — apiUploadPhoto returns a relative path like "/uploads/xyz.jpg",
  // which vision.service.ts reads directly off disk. A strict .url() check here
  // rejected every real upload before it ever reached the vision model.
  photoUrl: z.string().min(1, { message: "photoUrl is required" }),
});

export const validateAutoTag = validate(autoTagSchema);

export async function createItemController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const body = req.body as z.infer<typeof createItemSchema>;

  const item = await itemsService.createItem(userId, body);

  // Fire-and-forget: generate + persist embedding asynchronously
  // so the HTTP response isn't blocked by the OpenRouter round-trip
  const embeddingText = buildItemEmbeddingText(item);
  generateEmbedding(embeddingText)
    .then((embedding) => saveItemEmbedding(item.id, embedding))
    .catch((err) => console.error(`[embedding] failed for item ${item.id}:`, err));

  res.status(201).json(item);
}

export async function listItemsController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const items = await itemsService.listItems(userId);
  res.status(200).json(items);
}

export async function getItemController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const { itemId } = req.params;
  const item = await itemsService.getItemById(userId, itemId);
  res.status(200).json(item);
}

export async function autoTagItemController(req: AuthedRequest, res: Response) {
  const body = req.body as z.infer<typeof autoTagSchema>;

  try {
    const tags = await visionService.tagItemFromImage(body.photoUrl);
    res.status(200).json(tags);
  } catch (err: any) {
    console.error("[vision] failed to auto-tag image:", err);
    // Do not crash the process; surface a 502 Bad Gateway or 500 error
    res.status(502).json({ error: "Failed to analyze image", details: err.message });
  }
}

export async function deleteItemController(req: AuthedRequest, res: Response) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    if (item.userId !== req.user!.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.item.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete item:", err);
    res.status(500).json({ error: "Failed to delete item", details: err.message });
  }
}

