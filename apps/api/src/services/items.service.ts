import { prisma } from "@closetiq/db";

export async function createItem(userId: string, data: {
  photoUrl: string;
  category: string;
  color?: string;
  pattern?: string;
  season?: string;
  formality?: string;
  brand?: string;
  price?: number;
  purchaseDate?: string;
  source?: string;
}) {
  return prisma.item.create({
    data: { ...data, userId, purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined },
  });
}

export async function listItems(userId: string) {
  return prisma.item.findMany({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getItemById(userId: string, itemId: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId) {
    throw new Error("Item not found");
  }
  return item;
}
