import { PrismaClient } from "@closetiq/db";
const prisma = new PrismaClient();

async function run() {
  try {
    const count = await prisma.user.count();
    console.log("DB connection successful! Users:", count);
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}
run();
