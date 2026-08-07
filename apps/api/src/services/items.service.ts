import { prisma, Item } from "@closetiq/db";

// Helper to compute derived fields
function attachWearStats(item: any) {
  const wearCount = item.wearLogs?.length ?? 0;
  
  let lastWornAt = null;
  if (wearCount > 0) {
    const dates = item.wearLogs.map((log: any) => new Date(log.wornAt).getTime());
    lastWornAt = new Date(Math.max(...dates));
  }

  let costPerWear = null;
  if (item.price != null && wearCount > 0) {
    costPerWear = item.price / wearCount;
  } else if (item.price != null && wearCount === 0) {
    costPerWear = item.price;
  }

  // Strip wearLogs from response to keep payload small, unless needed
  const { wearLogs, ...rest } = item;
  return {
    ...rest,
    wearCount,
    lastWornAt,
    costPerWear,
  };
}

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
  const items = await prisma.item.findMany({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: { wearLogs: { select: { wornAt: true } } }
  });
  return items.map(attachWearStats);
}

export async function getItemById(userId: string, itemId: string) {
  const item = await prisma.item.findUnique({ 
    where: { id: itemId },
    include: { wearLogs: { select: { wornAt: true } } }
  });
  if (!item || item.userId !== userId) {
    throw new Error("Item not found");
  }
  return attachWearStats(item);
}
