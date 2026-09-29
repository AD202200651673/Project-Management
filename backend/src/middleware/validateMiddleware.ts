import type { Request, Response, NextFunction } from "express";

/**
 * Generic request validation middleware helper
 */
export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter((field) => !req.body || req.body[field] === undefined || req.body[field] === null || req.body[field] === "");
    if (missing.length > 0) {
      res.status(400).json({
        message: `Missing required field(s): ${missing.join(", ")}`,
      });
      return;
    }
    next();
  };
};
