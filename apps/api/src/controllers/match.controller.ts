import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { generateEmbedding } from "../services/embedding.service";
import { findSimilarItems } from "../services/matching.service";

const matchSchema = z.object({
  // A text description of the style the user is looking for.
  // e.g. "blue casual denim jacket" or "floral summer dress"
  // Since we use text embeddings, this is how reverse-matching works.
  query: z.string().min(1, { message: "query is required" }),
  limit: z.number().int().positive().max(20).optional(),
});

export const validateMatch = validate(matchSchema);

export async function matchController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const { query, limit } = req.body as z.infer<typeof matchSchema>;

  const referenceEmbedding = await generateEmbedding(query);
  const matches = await findSimilarItems(userId, referenceEmbedding, limit);

  res.status(200).json({ matches });
}