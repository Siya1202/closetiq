import { prisma } from "@closetiq/db";

export async function getCostPerWearReport(userId: string) {
  const items = await prisma.item.findMany({
    where: { userId, archivedAt: null },
    include: { wearLogs: true },
  });

  return items.map((item) => {
    const wearCount = item.wearLogs.length;
    return {
      id: item.id,
      brand: item.brand,
      color: item.color,
      category: item.category,
      photoUrl: item.photoUrl,
      price: item.price,
      wearCount,
      costPerWear: item.price != null ? item.price / (wearCount || 1) : null,
      isRegretBuy: item.price != null && wearCount <= 1 && item.price > 1000, // simple starter heuristic — tune later
    };
  });
}
