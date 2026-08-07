import { prisma } from "@closetiq/db";

export async function getStyleDriftTimeline(userId: string) {
  const items = await prisma.item.findMany({
    where: { userId, archivedAt: null, purchaseDate: { not: null } },
    orderBy: { purchaseDate: "asc" },
  });

  const byMonth: Record<string, { category: string; color: string | null }[]> = {};

  for (const item of items) {
    const monthKey = item.purchaseDate!.toISOString().slice(0, 7); // "2026-03"
    byMonth[monthKey] ??= [];
    byMonth[monthKey].push({ category: item.category, color: item.color });
  }

  return Object.entries(byMonth).map(([month, monthItems]) => {
    const categoryCounts: Record<string, number> = {};
    for (const { category } of monthItems) {
      categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    }
    const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    return { month, itemCount: monthItems.length, dominantCategory };
  });
}