import { prisma } from "@closetiq/db";
import { env } from "../config/env";

/**
 * Generates a 1536-dim text embedding for a clothing item using
 * openai/text-embedding-3-small via OpenRouter.
 *
 * Instead of raw image pixels (CLIP), we embed a structured text description
 * of the item's metadata so semantically similar items score closer together.
 * e.g. "blue casual cotton top summer" vs "navy informal shirt warm weather"
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding generation failed (${response.status}): ${body}`);
  }

  const data = await response.json() as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding as number[]; // number[1536]
}

/**
 * Builds a plain-text description of an item's attributes for embedding.
 * This is what gets embedded — keeps similar items (e.g. "blue jeans", "navy denim")
 * close in the vector space.
 */
export function buildItemEmbeddingText(item: {
  category: string;
  color?: string | null;
  pattern?: string | null;
  season?: string | null;
  formality?: string | null;
  brand?: string | null;
}): string {
  return [item.color, item.pattern, item.formality, item.category, item.season, item.brand]
    .filter(Boolean)
    .join(" ");
}

/**
 * Persists the embedding vector for an item via raw SQL.
 * Prisma doesn't support the `vector` column type natively yet.
 */
export async function saveItemEmbedding(itemId: string, embedding: number[]) {
  const vectorLiteral = `[${embedding.join(",")}]`;
  await prisma.$executeRawUnsafe(
    `UPDATE items SET embedding = $1::vector, "embeddingUpdatedAt" = now() WHERE id = $2`,
    vectorLiteral,
    itemId
  );
}