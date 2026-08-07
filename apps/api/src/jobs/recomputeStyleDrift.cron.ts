import cron from "node-cron";
import { prisma } from "@closetiq/db";
import { getStyleDriftTimeline } from "../services/style.service";

// runs weekly, Sunday midnight
export function scheduleStyleDriftRecompute() {
  cron.schedule("0 0 * * 0", async () => {
    const users = await prisma.user.findMany({ select: { id: true } });
    for (const { id: userId } of users) {
      await getStyleDriftTimeline(userId);
    }
    console.log(`[cron] style drift recomputed for ${users.length} users`);
  });
}