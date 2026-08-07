import { prisma } from "@closetiq/db";

async function assertOwnership(userId: string, itemId: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId) {
    throw new Error("Item not found");
  }
}

export async function createWearLog(userId: string, itemId: string, occasion?: string) {
  await assertOwnership(userId, itemId);
  return prisma.wearLog.create({ data: { itemId, occasion } });
}

export async function listWearLogs(userId: string, itemId: string) {
  await assertOwnership(userId, itemId);
  return prisma.wearLog.findMany({
    where: { itemId },
    orderBy: { wornAt: "desc" },
  });
}
