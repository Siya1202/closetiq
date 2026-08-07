import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import * as itemsService from "../services/items.service";
import { generateEmbedding, buildItemEmbeddingText, saveItemEmbedding } from "../services/embedding.service";

const createItemSchema = z.object({
  photoUrl: z.string().url({ message: "photoUrl must be a valid URL" }),
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
