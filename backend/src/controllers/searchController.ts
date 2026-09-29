import type { Request, Response } from "express";
import { SearchService } from "../services/searchService.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const search = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  const results = await SearchService.searchAll((query as string) || "");
  res.json(results);
});