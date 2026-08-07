import cron from "node-cron";
import { prisma } from "@closetiq/db";
import { getCostPerWearReport } from "../services/costPerWear.service";

// runs every night at 2am — cost-per-wear is cheap to compute live, so this
// mainly exists as a pattern; more useful once you cache results instead of
// computing on every request
export function scheduleCostPerWearRecompute() {
  cron.schedule("0 2 * * *", async () => {
    const users = await prisma.user.findMany({ select: { id: true } });
    for (const { id: userId } of users) {
      await getCostPerWearReport(userId); // swap for a cache-write once you add one
    }
    console.log(`[cron] cost-per-wear recomputed for ${users.length} users`);
  });
}