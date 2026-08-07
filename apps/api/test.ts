import * as dotenv from "dotenv";
dotenv.config();
import { tagItemFromImage } from "./src/services/vision.service";

async function run() {
  try {
    const res = await tagItemFromImage("/uploads/ce57d92d-3901-4eaa-996f-719951015b3a.jpg");
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("FAILED:", err);
  }
}
run();
