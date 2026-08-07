import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getStyleDriftTimeline } from "../services/style.service";

export async function styleDriftController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const timeline = await getStyleDriftTimeline(userId);
  res.status(200).json(timeline);
}