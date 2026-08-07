import { prisma } from "@closetiq/db";

interface SimilarItem {
  id: string;
  photoUrl: string;
  category: string;
  distance: number;
}

export async function findSimilarItems(userId: string, referenceEmbedding: number[], limit = 5) {
  const vectorLiteral = `[${referenceEmbedding.join(",")}]`;

  // pgvector's <-> operator computes distance directly in SQL — much faster
  // than pulling every embedding into JS and comparing manually
  return prisma.$queryRawUnsafe<SimilarItem[]>(
    `SELECT id, "photoUrl", category, embedding <-> $1::vector AS distance
     FROM items
     WHERE "userId" = $2 AND embedding IS NOT NULL AND "archivedAt" IS NULL
     ORDER BY distance ASC
     LIMIT $3`,
    vectorLiteral,
    userId,
    limit
  );
}