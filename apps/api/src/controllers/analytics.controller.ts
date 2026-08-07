import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import * as costPerWearService from "../services/costPerWear.service";

export async function getCostPerWearController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const report = await costPerWearService.getCostPerWearReport(userId);
  res.status(200).json(report);
}
