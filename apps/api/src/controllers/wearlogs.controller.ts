import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import * as wearLogsService from "../services/wearlogs.service";

const createWearLogSchema = z.object({
  occasion: z.string().min(1).optional(),
  wornAt: z.string().datetime({ offset: true }).optional(),
});

export const validateCreateWearLog = validate(createWearLogSchema);

export async function createWearLogController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const { itemId } = req.params;
  const { occasion, wornAt } = req.body as z.infer<typeof createWearLogSchema>;
  const parsedDate = wornAt ? new Date(wornAt) : undefined;
  const wearLog = await wearLogsService.createWearLog(userId, itemId, occasion, parsedDate);
  res.status(201).json(wearLog);
}

export async function listWearLogsController(req: AuthedRequest, res: Response) {
  const userId = req.user!.id;
  const { itemId } = req.params;
  const wearLogs = await wearLogsService.listWearLogs(userId, itemId);
  res.status(200).json(wearLogs);
}
